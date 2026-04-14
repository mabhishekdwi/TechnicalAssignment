import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://restful-booker.herokuapp.com';

/**
 * Booking Management — GET
 *
 * GET /booking         → list of { bookingid: number }
 * GET /booking/:id     → full booking object
 * GET /booking?filter  → filtered list
 */
test.describe('Booking Management — GET', { tag: ['@booking-get', '@api'] }, () => {

  // ── TC-GET-001 ────────────────────────────────────────────────────────────────
  test(
    'TC-GET-001: Get all bookings returns a non-empty array',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - GET');
      allure.story('List All Bookings');
      allure.severity('critical');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.get('/booking', {
        headers: { 'Accept': 'application/json' }
      });

      await allure.step('Verify HTTP 200 status', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verify response is a non-empty array of booking IDs', async () => {
        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toHaveProperty('bookingid');
        expect(typeof body[0].bookingid).toBe('number');
        allure.attachment('Total Bookings', String(body.length), 'text/plain');
      });

      await ctx.dispose();
    }
  );

  // ── TC-GET-002 ────────────────────────────────────────────────────────────────
  test(
    'TC-GET-002: Get booking by valid ID returns complete booking object',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - GET');
      allure.story('Get Single Booking');
      allure.severity('critical');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      // Dynamically retrieve a valid ID to avoid hard-coded fragile IDs
      const listResponse = await ctx.get('/booking', {
        headers: { 'Accept': 'application/json' }
      });
      const bookings  = await listResponse.json();
      const bookingId = bookings[0].bookingid;
      allure.parameter('Booking ID', String(bookingId));

      const response = await ctx.get(`/booking/${bookingId}`, {
        headers: { 'Accept': 'application/json' }
      });

      await allure.step('Verify HTTP 200 status', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verify schema: all required fields present', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('firstname');
        expect(body).toHaveProperty('lastname');
        expect(body).toHaveProperty('totalprice');
        expect(body).toHaveProperty('depositpaid');
        expect(body).toHaveProperty('bookingdates');
        expect(body.bookingdates).toHaveProperty('checkin');
        expect(body.bookingdates).toHaveProperty('checkout');
        allure.attachment('Booking Details', JSON.stringify(body, null, 2), 'application/json');
      });

      await ctx.dispose();
    }
  );

  // ── TC-GET-003 ────────────────────────────────────────────────────────────────
  test(
    'TC-GET-003: Get booking with non-existent ID returns 404',
    { tag: ['@negative', '@smoke'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - GET');
      allure.story('Invalid Booking ID');
      allure.severity('normal');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.get('/booking/9999999', {
        headers: { 'Accept': 'application/json' }
      });

      await allure.step('Verify HTTP 404 status for non-existent booking', async () => {
        expect(response.status()).toBe(404);
      });

      await ctx.dispose();
    }
  );

  // ── TC-GET-004 ────────────────────────────────────────────────────────────────
  test(
    'TC-GET-004: Filter bookings by checkin date',
    { tag: ['@positive'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Booking - GET');
      allure.story('Filter Bookings by Date');
      allure.severity('normal');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.get('/booking?checkin=2024-01-01', {
        headers: { 'Accept': 'application/json' }
      });

      await allure.step('Verify HTTP 200 and array response', async () => {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBeTruthy();
        allure.attachment('Filtered Bookings Count', String(body.length), 'text/plain');
      });

      await ctx.dispose();
    }
  );
});
