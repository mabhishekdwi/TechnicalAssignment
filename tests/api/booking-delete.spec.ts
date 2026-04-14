import { test, expect, request, APIRequestContext } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://restful-booker.herokuapp.com';

// ── Shared helpers ────────────────────────────────────────────────────────────

async function getAuthToken(ctx: APIRequestContext): Promise<string> {
  const res  = await ctx.post('/auth', {
    data: { username: 'admin', password: 'password123' },
    headers: { 'Content-Type': 'application/json' }
  });
  const body = await res.json();
  return body.token as string;
}

async function createBooking(ctx: APIRequestContext): Promise<number> {
  const res  = await ctx.post('/booking', {
    data: {
      firstname:       'ToDelete',
      lastname:        'User',
      totalprice:      100,
      depositpaid:     true,
      bookingdates: {
        checkin:  '2024-05-01',
        checkout: '2024-05-05'
      },
      additionalneeds: 'None'
    },
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
  });
  const body = await res.json();
  return body.bookingid as number;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('Booking Management — DELETE', { tag: ['@booking-delete', '@api'] }, () => {

  // ── TC-DEL-001 ────────────────────────────────────────────────────────────────
  test(
    'TC-DEL-001: Delete an existing booking with valid auth token',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - DELETE');
      allure.story('Successful Deletion');
      allure.severity('critical');

      const ctx       = await request.newContext({ baseURL: BASE_URL });
      const token     = await getAuthToken(ctx);
      const bookingId = await createBooking(ctx);
      allure.parameter('Booking ID', String(bookingId));

      // Delete
      const deleteResponse = await ctx.delete(`/booking/${bookingId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie':        `token=${token}`
        }
      });

      await allure.step('Verify HTTP 201 on DELETE (API design)', async () => {
        expect(deleteResponse.status()).toBe(201);
      });

      // Confirm deletion
      await allure.step('Verify booking no longer exists — GET returns 404', async () => {
        const verifyResponse = await ctx.get(`/booking/${bookingId}`, {
          headers: { 'Accept': 'application/json' }
        });
        expect(verifyResponse.status()).toBe(404);
      });

      await ctx.dispose();
    }
  );

  // ── TC-DEL-002 ────────────────────────────────────────────────────────────────
  test(
    'TC-DEL-002: Delete without auth token is rejected with 403',
    { tag: ['@negative', '@smoke'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - DELETE');
      allure.story('Unauthorized Deletion');
      allure.severity('normal');

      const ctx       = await request.newContext({ baseURL: BASE_URL });
      const bookingId = await createBooking(ctx);
      allure.parameter('Booking ID', String(bookingId));

      const response = await ctx.delete(`/booking/${bookingId}`, {
        headers: { 'Content-Type': 'application/json' }
        // No Cookie intentionally
      });

      await allure.step('Verify HTTP 403 Forbidden without auth', async () => {
        expect(response.status()).toBe(403);
      });

      await ctx.dispose();
    }
  );

  // ── TC-DEL-003 ────────────────────────────────────────────────────────────────
  test(
    'TC-DEL-003: Delete a non-existent booking ID returns 405',
    { tag: ['@negative'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - DELETE');
      allure.story('Delete Non-Existent Booking');
      allure.severity('minor');

      const ctx   = await request.newContext({ baseURL: BASE_URL });
      const token = await getAuthToken(ctx);

      const response = await ctx.delete('/booking/9999999', {
        headers: {
          'Content-Type': 'application/json',
          'Cookie':        `token=${token}`
        }
      });

      await allure.step('Verify server responds with 405 for unknown ID', async () => {
        // Restful-Booker returns 405 Method Not Allowed for unknown IDs
        expect(response.status()).toBe(405);
      });

      await ctx.dispose();
    }
  );
});
