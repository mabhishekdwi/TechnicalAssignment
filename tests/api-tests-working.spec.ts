import { test, expect, Page } from '@playwright/test';
import { allure } from 'allure-playwright';
import { AUTOMATION_EXERCISE_ENDPOINTS, API_BASE_URLS } from '../config/apiEndpoints.js';

/**
 * API Test Suite for AutomationExercise.com
 * Tests API endpoints using page navigation (due to CloudFlare protection)
 */
test.describe('AutomationExercise API Tests', { tag: '@api' }, () => {
  const timestamp = Date.now();

  // Helper function to make API GET request via browser
  async function apiGet(page: Page, endpoint: string): Promise<any> {
    const url = `${API_BASE_URLS.AUTOMATION_EXERCISE}${endpoint}`;
    await page.goto(url);
    await page.waitForLoadState('load');

    const bodyText = await page.locator('body').textContent();
    return JSON.parse(bodyText || '{}');
  }

  // Helper function to make API POST request via page.evaluate
  async function apiPost(page: Page, endpoint: string, data: any): Promise<any> {
    const url = `${API_BASE_URLS.AUTOMATION_EXERCISE}${endpoint}`;

    const response = await page.evaluate(async ({ url, data }) => {
      const formData = new URLSearchParams(data);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      return await res.json();
    }, { url, data });

    return response;
  }

  // ==========================================
  // API 1: GET All Products List
  // ==========================================
  test('API-001: GET All Products List', { tag: '@critical' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Products API');
    allure.severity('critical');
    allure.description('Verify GET request to retrieve all products list');

    await allure.step('Send GET request to /api/productsList', async () => {
      const responseBody = await apiGet(page, AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_PRODUCTS);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify response contains products list', async () => {
        expect(responseBody).toHaveProperty('products');
        expect(Array.isArray(responseBody.products)).toBeTruthy();
        expect(responseBody.products.length).toBeGreaterThan(0);

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
        allure.parameter('Products Count', responseBody.products.length);
      });
    });
  });

  // ==========================================
  // API 2: POST To All Products List (Negative)
  // ==========================================
  test('API-002: POST To All Products List (Negative)', { tag: '@negative' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Products API');
    allure.severity('normal');
    allure.description('Verify POST request to /api/productsList returns 405 error');

    await allure.step('Send POST request to /api/productsList (unsupported method)', async () => {
      const responseBody = await apiPost(page, AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_PRODUCTS, {});

      await allure.step('Verify response code is 405', async () => {
        expect(responseBody.responseCode).toBe(405);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message', async () => {
        expect(responseBody.message).toContain('not supported');
        allure.attachment('Error Response', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 3: GET All Brands List
  // ==========================================
  test('API-003: GET All Brands List', { tag: '@critical' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Brands API');
    allure.severity('critical');
    allure.description('Verify GET request to retrieve all brands list');

    await allure.step('Send GET request to /api/brandsList', async () => {
      const responseBody = await apiGet(page, AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_BRANDS);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify response contains brands list', async () => {
        expect(responseBody).toHaveProperty('brands');
        expect(Array.isArray(responseBody.brands)).toBeTruthy();
        expect(responseBody.brands.length).toBeGreaterThan(0);

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
        allure.parameter('Brands Count', responseBody.brands.length);
      });
    });
  });

  // ==========================================
  // API 5: POST To Search Product with search parameter
  // ==========================================
  test('API-005: POST Search Product with search parameter', { tag: '@critical' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Search API');
    allure.severity('critical');
    allure.description('Verify POST request to search product with search_product parameter');

    const searchTerm = 'top';

    await allure.step(`Search for products with term: "${searchTerm}"`, async () => {
      const responseBody = await apiPost(page, AUTOMATION_EXERCISE_ENDPOINTS.SEARCH_PRODUCT, {
        search_product: searchTerm
      });

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify searched products are returned', async () => {
        expect(responseBody).toHaveProperty('products');
        expect(Array.isArray(responseBody.products)).toBeTruthy();

        allure.parameter('Search Term', searchTerm);
        allure.parameter('Products Found', responseBody.products.length);
        allure.attachment('Search Results', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 7: POST To Verify Login with valid details
  // ==========================================
  test('API-007: POST Verify Login with valid details', { tag: '@critical' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Authentication API');
    allure.severity('critical');
    allure.description('Verify POST request to verify login with valid email and password');

    await allure.step('Send POST request with valid credentials', async () => {
      const responseBody = await apiPost(page, AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN, {
        email: 'testapi@yopmail.com',
        password: 'Test@123'
      });

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify success message', async () => {
        expect(responseBody.message).toContain('User exists');
        allure.attachment('Response', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 8: POST To Verify Login without email parameter
  // ==========================================
  test('API-008: POST Verify Login without email (Negative)', { tag: '@negative' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Authentication API');
    allure.severity('normal');
    allure.description('Verify POST request without email parameter returns 400');

    await allure.step('Send POST request without email parameter', async () => {
      const responseBody = await apiPost(page, AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN, {
        password: 'Test@123'
      });

      await allure.step('Verify response code is 400', async () => {
        expect(responseBody.responseCode).toBe(400);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message', async () => {
        expect(responseBody.message).toContain('parameter');
        allure.attachment('Error Response', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 10: POST To Verify Login with invalid details
  // ==========================================
  test('API-010: POST Verify Login with invalid details (Negative)', { tag: '@negative' }, async ({ page }) => {
    allure.epic('API Testing');
    allure.story('Authentication API');
    allure.severity('normal');
    allure.description('Verify POST request with invalid credentials returns 404');

    await allure.step('Send POST request with invalid credentials', async () => {
      const responseBody = await apiPost(page, AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN, {
        email: 'invalid@notexists.com',
        password: 'WrongPassword123'
      });

      await allure.step('Verify response code is 404', async () => {
        expect(responseBody.responseCode).toBe(404);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message', async () => {
        expect(responseBody.message).toContain('not exist');
        allure.attachment('Error Response', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });
});
