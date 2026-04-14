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

const BOOKING_PAYLOAD = {
  firstname:       'James',
  lastname:        'Brown',
  totalprice:      111,
  depositpaid:     true,
  bookingdates: {
    checkin:  '2024-01-01',
    checkout: '2024-01-10'
  },
  additionalneeds: 'Breakfast'
};

const UPDATED_PAYLOAD = {
  firstname:       'James',
  lastname:        'Updated',
  totalprice:      250,
  depositpaid:     false,
  bookingdates: {
    checkin:  '2024-06-01',
    checkout: '2024-06-10'
  },
  additionalneeds: 'Dinner'
};

// ── Tests ──────────────────────────────────────────────────────────────────────

test.describe('Booking Management — CREATE / UPDATE', { tag: ['@booking-crud', '@api'] }, () => {

  // ── TC-CU-001 ─────────────────────────────────────────────────────────────────
  test(
    'TC-CU-001: Create a new booking with valid payload',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - CREATE');
      allure.story('Create Booking');
      allure.severity('critical');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.post('/booking', {
        data: BOOKING_PAYLOAD,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });

      await allure.step('Verify HTTP 200 status', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verify response schema: bookingid + booking object', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('bookingid');
        expect(typeof body.bookingid).toBe('number');
        expect(body.booking.firstname).toBe(BOOKING_PAYLOAD.firstname);
        expect(body.booking.lastname).toBe(BOOKING_PAYLOAD.lastname);
        expect(body.booking.totalprice).toBe(BOOKING_PAYLOAD.totalprice);
        expect(body.booking.depositpaid).toBe(BOOKING_PAYLOAD.depositpaid);
        expect(body.booking.bookingdates.checkin).toBe(BOOKING_PAYLOAD.bookingdates.checkin);
        allure.attachment('Created Booking', JSON.stringify(body, null, 2), 'application/json');
        allure.parameter('Booking ID', String(body.bookingid));
      });

      await ctx.dispose();
    }
  );

  // ── TC-CU-002 ─────────────────────────────────────────────────────────────────
  test(
    'TC-CU-002: Create booking with missing required fields returns 500',
    { tag: ['@negative'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - CREATE');
      allure.story('Invalid Booking Payload');
      allure.severity('normal');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      // Send an incomplete payload — bookingdates, totalprice and depositpaid missing
      const response = await ctx.post('/booking', {
        data: { firstname: 'John' },
        headers: { 'Content-Type': 'application/json' }
      });

      await allure.step('Verify server returns 500 for incomplete payload', async () => {
        expect(response.status()).toBe(500);
      });

      await ctx.dispose();
    }
  );

  // ── TC-CU-003 ─────────────────────────────────────────────────────────────────
  test(
    'TC-CU-003: Full update (PUT) of an existing booking with valid auth token',
    { tag: ['@positive', '@smoke'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - UPDATE');
      allure.story('Full Update via PUT');
      allure.severity('critical');

      const ctx   = await request.newContext({ baseURL: BASE_URL });
      const token = await getAuthToken(ctx);

      // 1. Create a booking to update
      const createRes = await ctx.post('/booking', {
        data: BOOKING_PAYLOAD,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const created   = await createRes.json();
      const bookingId = created.bookingid;
      allure.parameter('Booking ID', String(bookingId));

      // 2. Update it
      const response = await ctx.put(`/booking/${bookingId}`, {
        data: UPDATED_PAYLOAD,
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
          'Cookie':        `token=${token}`
        }
      });

      await allure.step('Verify HTTP 200 on PUT', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verify updated fields in response', async () => {
        const body = await response.json();
        expect(body.lastname).toBe(UPDATED_PAYLOAD.lastname);
        expect(body.totalprice).toBe(UPDATED_PAYLOAD.totalprice);
        expect(body.depositpaid).toBe(UPDATED_PAYLOAD.depositpaid);
        expect(body.additionalneeds).toBe(UPDATED_PAYLOAD.additionalneeds);
        allure.attachment('Updated Booking', JSON.stringify(body, null, 2), 'application/json');
      });

      await ctx.dispose();
    }
  );

  // ── TC-CU-004 ─────────────────────────────────────────────────────────────────
  test(
    'TC-CU-004: PUT update without auth token is rejected with 403',
    { tag: ['@negative'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - UPDATE');
      allure.story('Unauthorized Update');
      allure.severity('normal');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      // Fetch an existing ID rather than hard-coding one
      const listRes   = await ctx.get('/booking', { headers: { 'Accept': 'application/json' } });
      const bookings  = await listRes.json();
      const bookingId = bookings[0].bookingid;

      const response = await ctx.put(`/booking/${bookingId}`, {
        data: UPDATED_PAYLOAD,
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json'
          // No Cookie / auth header intentionally
        }
      });

      await allure.step('Verify HTTP 403 Forbidden when token is absent', async () => {
        expect(response.status()).toBe(403);
      });

      await ctx.dispose();
    }
  );

  // ── TC-CU-005 ─────────────────────────────────────────────────────────────────
  test(
    'TC-CU-005: Partial update (PATCH) of an existing booking',
    { tag: ['@positive'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - UPDATE');
      allure.story('Partial Update via PATCH');
      allure.severity('normal');

      const ctx   = await request.newContext({ baseURL: BASE_URL });
      const token = await getAuthToken(ctx);

      // Create booking to patch
      const createRes = await ctx.post('/booking', {
        data: BOOKING_PAYLOAD,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const created   = await createRes.json();
      const bookingId = created.bookingid;
      allure.parameter('Booking ID', String(bookingId));

      const patchResponse = await ctx.patch(`/booking/${bookingId}`, {
        data: { firstname: 'Patched', totalprice: 999 },
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json',
          'Cookie':        `token=${token}`
        }
      });

      await allure.step('Verify HTTP 200 on PATCH', async () => {
        expect(patchResponse.status()).toBe(200);
      });

      await allure.step('Verify only patched fields changed', async () => {
        const body = await patchResponse.json();
        expect(body.firstname).toBe('Patched');
        expect(body.totalprice).toBe(999);
        // Unchanged fields stay the same
        expect(body.lastname).toBe(BOOKING_PAYLOAD.lastname);
        allure.attachment('Patched Booking', JSON.stringify(body, null, 2), 'application/json');
      });

      await ctx.dispose();
    }
  );
});
