import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://restful-booker.herokuapp.com';

/**
 * End-to-End API Test: Create → Update → Verify → Delete
 *
 * Validates the complete booking lifecycle in one chained scenario, ensuring
 * data integrity is maintained across all CRUD operations.
 */
test.describe('E2E: Booking Lifecycle — Create → Update → Verify → Delete', {
  tag: ['@e2e', '@api', '@critical']
}, () => {

  test('E2E-API-001: Full booking lifecycle', async () => {
    allure.epic('Restful-Booker API');
    allure.feature('End-to-End Booking Lifecycle');
    allure.story('Create → Update → Verify → Delete');
    allure.severity('critical');

    const ctx = await request.newContext({ baseURL: BASE_URL });
    let token: string;
    let bookingId: number;

    // ── Step 1: Authenticate ─────────────────────────────────────────────────
    await allure.step('1. POST /auth — Obtain auth token', async () => {
      const response = await ctx.post('/auth', {
        data: { username: 'admin', password: 'password123' },
        headers: { 'Content-Type': 'application/json' }
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      token = body.token;
      expect(token).toBeTruthy();
      allure.attachment('Auth Token', token, 'text/plain');
    });

    // ── Step 2: Create Booking ───────────────────────────────────────────────
    await allure.step('2. POST /booking — Create a new booking', async () => {
      const response = await ctx.post('/booking', {
        data: {
          firstname:       'E2E',
          lastname:        'LifecycleTest',
          totalprice:      150,
          depositpaid:     true,
          bookingdates: {
            checkin:  '2024-08-01',
            checkout: '2024-08-10'
          },
          additionalneeds: 'Breakfast'
        },
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      bookingId  = body.bookingid;

      expect(bookingId).toBeTruthy();
      expect(body.booking.firstname).toBe('E2E');
      expect(body.booking.lastname).toBe('LifecycleTest');
      expect(body.booking.totalprice).toBe(150);

      allure.parameter('Booking ID', String(bookingId));
      allure.attachment('Created Booking', JSON.stringify(body, null, 2), 'application/json');
    });

    // ── Step 3: Verify Created Booking ───────────────────────────────────────
    await allure.step('3. GET /booking/:id — Verify booking exists with correct data', async () => {
      const response = await ctx.get(`/booking/${bookingId}`, {
        headers: { 'Accept': 'application/json' }
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.firstname).toBe('E2E');
      expect(body.lastname).toBe('LifecycleTest');
      expect(body.totalprice).toBe(150);
      expect(body.depositpaid).toBe(true);
      expect(body.bookingdates.checkin).toBe('2024-08-01');
      expect(body.bookingdates.checkout).toBe('2024-08-10');
    });

    // ── Step 4: Full Update (PUT) ────────────────────────────────────────────
    await allure.step('4. PUT /booking/:id — Full update of the booking', async () => {
      const response = await ctx.put(`/booking/${bookingId}`, {
        data: {
          firstname:       'E2E',
          lastname:        'Updated',
          totalprice:      300,
          depositpaid:     false,
          bookingdates: {
            checkin:  '2024-09-01',
            checkout: '2024-09-15'
          },
          additionalneeds: 'Lunch and Dinner'
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
          'Cookie':        `token=${token}`
        }
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.lastname).toBe('Updated');
      expect(body.totalprice).toBe(300);
      expect(body.depositpaid).toBe(false);
      expect(body.additionalneeds).toBe('Lunch and Dinner');
      allure.attachment('Updated Booking', JSON.stringify(body, null, 2), 'application/json');
    });

    // ── Step 5: Verify Updated Data ─────────────────────────────────────────
    await allure.step('5. GET /booking/:id — Verify updated data persisted', async () => {
      const response = await ctx.get(`/booking/${bookingId}`, {
        headers: { 'Accept': 'application/json' }
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.lastname).toBe('Updated');
      expect(body.totalprice).toBe(300);
      expect(body.depositpaid).toBe(false);
      expect(body.bookingdates.checkin).toBe('2024-09-01');
    });

    // ── Step 6: Partial Update (PATCH) ──────────────────────────────────────
    await allure.step('6. PATCH /booking/:id — Partial update: change totalprice only', async () => {
      const response = await ctx.patch(`/booking/${bookingId}`, {
        data: { totalprice: 500 },
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
          'Cookie':        `token=${token}`
        }
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.totalprice).toBe(500);
      // Other fields should remain unchanged from previous PUT
      expect(body.lastname).toBe('Updated');
    });

    // ── Step 7: Delete Booking ───────────────────────────────────────────────
    await allure.step('7. DELETE /booking/:id — Delete the booking', async () => {
      const response = await ctx.delete(`/booking/${bookingId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie':        `token=${token}`
        }
      });
      expect(response.status()).toBe(201);
    });

    // ── Step 8: Confirm Deletion ─────────────────────────────────────────────
    await allure.step('8. GET /booking/:id — Confirm booking no longer exists', async () => {
      const response = await ctx.get(`/booking/${bookingId}`, {
        headers: { 'Accept': 'application/json' }
      });
      expect(response.status()).toBe(404);
    });

    await ctx.dispose();
  });
});
