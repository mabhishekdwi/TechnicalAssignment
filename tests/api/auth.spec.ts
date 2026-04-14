import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://restful-booker.herokuapp.com';

/**
 * Authentication — POST /auth
 *
 * Positive: valid credentials → returns { token: string }
 * Negative: wrong password   → returns { reason: 'Bad credentials' }
 */
test.describe('Authentication — POST /auth', { tag: ['@auth', '@api'] }, () => {

  // ── TC-AUTH-001 ──────────────────────────────────────────────────────────────
  test(
    'TC-AUTH-001: Create auth token with valid credentials',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Authentication');
      allure.story('Successful Token Generation');
      allure.severity('critical');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.post('/auth', {
        data: { username: 'admin', password: 'password123' },
        headers: { 'Content-Type': 'application/json' }
      });

      await allure.step('Verify HTTP 200 status', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verify response contains a non-empty token', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('token');
        expect(typeof body.token).toBe('string');
        expect(body.token.length).toBeGreaterThan(0);
        allure.attachment('Token', body.token, 'text/plain');
      });

      await ctx.dispose();
    }
  );

  // ── TC-AUTH-002 ──────────────────────────────────────────────────────────────
  test(
    'TC-AUTH-002: Auth returns error reason with invalid credentials',
    { tag: ['@negative', '@smoke'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Authentication');
      allure.story('Failed Token Generation');
      allure.severity('normal');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.post('/auth', {
        data: { username: 'admin', password: 'wrongpassword' },
        headers: { 'Content-Type': 'application/json' }
      });

      await allure.step('Verify HTTP 200 status (API design returns 200 with error body)', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Verify response contains "Bad credentials" reason', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('reason');
        expect(body.reason).toBe('Bad credentials');
        allure.attachment('Response Body', JSON.stringify(body, null, 2), 'application/json');
      });

      await ctx.dispose();
    }
  );

  // ── TC-AUTH-003 ──────────────────────────────────────────────────────────────
  test(
    'TC-AUTH-003: Auth returns error reason with empty credentials',
    { tag: ['@negative'] },
    async () => {
      allure.epic('Restful-Booker API');
      allure.feature('Authentication');
      allure.story('Empty Credentials');
      allure.severity('minor');

      const ctx = await request.newContext({ baseURL: BASE_URL });

      const response = await ctx.post('/auth', {
        data: { username: '', password: '' },
        headers: { 'Content-Type': 'application/json' }
      });

      await allure.step('Verify response indicates bad credentials', async () => {
        const body = await response.json();
        expect(body).toHaveProperty('reason');
        expect(body.reason).toBe('Bad credentials');
      });

      await ctx.dispose();
    }
  );
});
