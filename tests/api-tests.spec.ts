import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { ApiUtil } from '../utils/ApiUtil.js';
import { AUTOMATION_EXERCISE_ENDPOINTS, API_BASE_URLS } from '../config/apiEndpoints.js';

/**
 * API Test Suite for AutomationExercise.com
 * Tests all 14 API endpoints with positive and negative scenarios
 */
test.describe('AutomationExercise API Tests', { tag: '@api' }, () => {
  let apiUtil: ApiUtil;
  const timestamp = Date.now();

  // Test data for user registration
  const testUser = {
    name: `API Test User ${timestamp}`,
    email: `apitest${timestamp}@example.com`,
    password: 'Test@123',
    title: 'Mr',
    birth_date: '15',
    birth_month: '6',
    birth_year: '1990',
    firstname: 'API',
    lastname: 'User',
    company: 'Test Company',
    address1: '123 API Street',
    address2: 'Suite 100',
    country: 'India',
    zipcode: '400001',
    state: 'Maharashtra',
    city: 'Mumbai',
    mobile_number: '9876543210'
  };

  test.beforeAll(async () => {
    allure.epic('API Testing');
    allure.feature('AutomationExercise APIs');

    // Initialize API Utility
    apiUtil = new ApiUtil();
    await apiUtil.init({
      baseURL: API_BASE_URLS.AUTOMATION_EXERCISE
    });
  });

  test.afterAll(async () => {
    await apiUtil.dispose();
  });

  // ==========================================
  // API 1: Get All Products List
  // ==========================================
  test('API-001: GET All Products List', { tag: '@critical' }, async () => {
    allure.story('Products API');
    allure.severity('critical');
    allure.description('Verify GET request to retrieve all products list');

    await allure.step('Send GET request to /api/productsList', async () => {
      const response = await apiUtil.get(AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_PRODUCTS);
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
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
  // API 2: POST To All Products List
  // ==========================================
  test('API-002: POST To All Products List (Negative)', async () => {
    allure.story('Products API');
    allure.severity('normal');
    allure.description('Verify POST method is not supported for products list');

    await allure.step('Send POST request to /api/productsList', async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_PRODUCTS);
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 405', async () => {
        expect(responseBody.responseCode).toBe(405);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message for unsupported method', async () => {
        expect(responseBody.message).toBe('This request method is not supported.');
        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 3: Get All Brands List
  // ==========================================
  test('API-003: GET All Brands List', { tag: '@critical' }, async () => {
    allure.story('Brands API');
    allure.severity('critical');
    allure.description('Verify GET request to retrieve all brands list');

    await allure.step('Send GET request to /api/brandsList', async () => {
      const response = await apiUtil.get(AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_BRANDS);

      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify response contains brands list', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody).toHaveProperty('responseCode');
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody).toHaveProperty('brands');
        expect(Array.isArray(responseBody.brands)).toBeTruthy();
        expect(responseBody.brands.length).toBeGreaterThan(0);

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
        allure.parameter('Brands Count', responseBody.brands.length);
      });
    });
  });

  // ==========================================
  // API 4: PUT To All Brands List
  // ==========================================
  test('API-004: PUT To All Brands List (Negative)', async () => {
    allure.story('Brands API');
    allure.severity('normal');
    allure.description('Verify PUT method is not supported for brands list');

    await allure.step('Send PUT request to /api/brandsList', async () => {
      const response = await apiUtil.put(AUTOMATION_EXERCISE_ENDPOINTS.GET_ALL_BRANDS);

      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 405', async () => {
        expect(responseBody.responseCode).toBe(405);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message for unsupported method', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(405);
        expect(responseBody.message).toBe('This request method is not supported.');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 5: POST To Search Product
  // ==========================================
  test('API-005: POST To Search Product with search parameter', { tag: '@critical' }, async () => {
    allure.story('Product Search API');
    allure.severity('critical');
    allure.description('Verify POST request to search products with search_product parameter');

    const searchTerm = 'top';

    await allure.step(`Send POST request to search for "${searchTerm}"`, async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.SEARCH_PRODUCT, {
        data: new URLSearchParams({ search_product: searchTerm })
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Search Term', searchTerm);
      });

      await allure.step('Verify response contains searched products', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody).toHaveProperty('products');
        expect(Array.isArray(responseBody.products)).toBeTruthy();

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
        allure.parameter('Found Products', responseBody.products.length);
      });
    });
  });

  // ==========================================
  // API 6: POST To Search Product without parameter
  // ==========================================
  test('API-006: POST To Search Product without search_product parameter (Negative)', async () => {
    allure.story('Product Search API');
    allure.severity('normal');
    allure.description('Verify POST request fails without required search_product parameter');

    await allure.step('Send POST request without search_product parameter', async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.SEARCH_PRODUCT);

      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 400', async () => {
        expect(responseBody.responseCode).toBe(400);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message for missing parameter', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(400);
        expect(responseBody.message).toBe('Bad request, search_product parameter is missing in POST request.');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 7: POST To Verify Login with valid details
  // ==========================================
  test('API-007: POST To Verify Login with valid details', { tag: '@critical' }, async () => {
    allure.story('Authentication API');
    allure.severity('critical');
    allure.description('Verify login with valid email and password');

    // First create an account to login
    const createResponse = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.CREATE_ACCOUNT, {
      data: new URLSearchParams(testUser)
    });

    const createBody = await apiUtil.getJson(createResponse);
    expect(createBody.responseCode).toBe(201);

    await allure.step('Send POST request to verify login with valid credentials', async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN, {
        data: new URLSearchParams({
          email: testUser.email,
          password: testUser.password
        })
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Email', testUser.email);
      });

      await allure.step('Verify success message', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User exists!');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });

    // Cleanup - Delete the test account
    await apiUtil.delete(AUTOMATION_EXERCISE_ENDPOINTS.DELETE_ACCOUNT, {
      data: new URLSearchParams({
        email: testUser.email,
        password: testUser.password
      })
    });
  });

  // ==========================================
  // API 8: POST To Verify Login without email parameter
  // ==========================================
  test('API-008: POST To Verify Login without email parameter (Negative)', async () => {
    allure.story('Authentication API');
    allure.severity('normal');
    allure.description('Verify login fails without email parameter');

    await allure.step('Send POST request without email parameter', async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN, {
        data: new URLSearchParams({ password: 'Test@123' })
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 400', async () => {
        expect(responseBody.responseCode).toBe(400);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message for missing parameter', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(400);
        expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 9: DELETE To Verify Login
  // ==========================================
  test('API-009: DELETE To Verify Login (Negative)', async () => {
    allure.story('Authentication API');
    allure.severity('normal');
    allure.description('Verify DELETE method is not supported for login verification');

    await allure.step('Send DELETE request to /api/verifyLogin', async () => {
      const response = await apiUtil.delete(AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN);

      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 405', async () => {
        expect(responseBody.responseCode).toBe(405);
        allure.parameter('Response Code', responseBody.responseCode);
      });

      await allure.step('Verify error message for unsupported method', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(405);
        expect(responseBody.message).toBe('This request method is not supported.');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 10: POST To Verify Login with invalid details
  // ==========================================
  test('API-010: POST To Verify Login with invalid details (Negative)', async () => {
    allure.story('Authentication API');
    allure.severity('normal');
    allure.description('Verify login fails with invalid credentials');

    await allure.step('Send POST request with invalid credentials', async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.VERIFY_LOGIN, {
        data: new URLSearchParams({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        })
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 404', async () => {
        expect(responseBody.responseCode).toBe(404);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Email', 'invalid@example.com');
      });

      await allure.step('Verify error message for user not found', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(404);
        expect(responseBody.message).toBe('User not found!');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 11: POST To Create/Register User Account
  // ==========================================
  test('API-011: POST To Create/Register User Account', { tag: '@critical' }, async () => {
    allure.story('User Management API');
    allure.severity('critical');
    allure.description('Verify user account creation with all required parameters');

    const newUser = {
      ...testUser,
      email: `createuser${timestamp}@example.com`
    };

    await allure.step('Send POST request to create user account', async () => {
      const response = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.CREATE_ACCOUNT, {
        data: new URLSearchParams(newUser)
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 201', async () => {
        expect(responseBody.responseCode).toBe(201);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Email', newUser.email);
      });

      await allure.step('Verify success message', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(201);
        expect(responseBody.message).toBe('User created!');

        allure.attachment('Request Body', JSON.stringify(newUser, null, 2), 'application/json');
        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });

    // Cleanup
    await apiUtil.delete(AUTOMATION_EXERCISE_ENDPOINTS.DELETE_ACCOUNT, {
      data: new URLSearchParams({
        email: newUser.email,
        password: newUser.password
      })
    });
  });

  // ==========================================
  // API 12: DELETE METHOD To Delete User Account
  // ==========================================
  test('API-012: DELETE To Delete User Account', { tag: '@critical' }, async () => {
    allure.story('User Management API');
    allure.severity('critical');
    allure.description('Verify user account deletion with email and password');

    const deleteUser = {
      ...testUser,
      email: `deleteuser${timestamp}@example.com`
    };

    // First create an account
    await allure.step('Create user account first', async () => {
      const createResponse = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.CREATE_ACCOUNT, {
        data: new URLSearchParams(deleteUser)
      });
      const createBody = await apiUtil.getJson(createResponse);
      expect(createBody.responseCode).toBe(201);
    });

    await allure.step('Send DELETE request to delete user account', async () => {
      const response = await apiUtil.delete(AUTOMATION_EXERCISE_ENDPOINTS.DELETE_ACCOUNT, {
        data: new URLSearchParams({
          email: deleteUser.email,
          password: deleteUser.password
        })
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Email', deleteUser.email);
      });

      await allure.step('Verify success message', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('Account deleted!');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });
  });

  // ==========================================
  // API 13: PUT METHOD To Update User Account
  // ==========================================
  test('API-013: PUT To Update User Account', { tag: '@critical' }, async () => {
    allure.story('User Management API');
    allure.severity('critical');
    allure.description('Verify user account update with all parameters');

    const updateUser = {
      ...testUser,
      email: `updateuser${timestamp}@example.com`
    };

    // First create an account
    await allure.step('Create user account first', async () => {
      const createResponse = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.CREATE_ACCOUNT, {
        data: new URLSearchParams(updateUser)
      });
      const createBody = await apiUtil.getJson(createResponse);
      expect(createBody.responseCode).toBe(201);
    });

    await allure.step('Send PUT request to update user account', async () => {
      const updatedData = {
        ...updateUser,
        firstname: 'Updated',
        lastname: 'User',
        company: 'Updated Company'
      };

      const response = await apiUtil.put(AUTOMATION_EXERCISE_ENDPOINTS.UPDATE_ACCOUNT, {
        data: new URLSearchParams(updatedData)
      });
      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Email', updateUser.email);
      });

      await allure.step('Verify success message', async () => {

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User updated!');

        allure.attachment('Updated Data', JSON.stringify(updatedData, null, 2), 'application/json');
        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });

    // Cleanup
    await apiUtil.delete(AUTOMATION_EXERCISE_ENDPOINTS.DELETE_ACCOUNT, {
      data: new URLSearchParams({
        email: updateUser.email,
        password: updateUser.password
      })
    });
  });

  // ==========================================
  // API 14: GET user account detail by email
  // ==========================================
  test('API-014: GET User Account Detail By Email', { tag: '@critical' }, async () => {
    allure.story('User Management API');
    allure.severity('critical');
    allure.description('Verify getting user account details by email');

    const getUserEmail = `getuser${timestamp}@example.com`;
    const getUserData = {
      ...testUser,
      email: getUserEmail
    };

    // First create an account
    await allure.step('Create user account first', async () => {
      const createResponse = await apiUtil.post(AUTOMATION_EXERCISE_ENDPOINTS.CREATE_ACCOUNT, {
        data: new URLSearchParams(getUserData)
      });
      const createBody = await apiUtil.getJson(createResponse);
      expect(createBody.responseCode).toBe(201);
    });

    await allure.step('Send GET request to retrieve user details by email', async () => {
      const response = await apiUtil.get(`${AUTOMATION_EXERCISE_ENDPOINTS.GET_USER_DETAIL_BY_EMAIL}?email=${getUserEmail}`);

      const responseBody = await apiUtil.getJson(response);

      await allure.step('Verify response code is 200', async () => {
        expect(responseBody.responseCode).toBe(200);
        allure.parameter('Response Code', responseBody.responseCode);
        allure.parameter('Email', getUserEmail);
      });

      await allure.step('Verify response contains user details', async () => {
        const responseBody = await apiUtil.getJson(response);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toHaveProperty('email');
        expect(responseBody.user.email).toBe(getUserEmail);
        expect(responseBody.user).toHaveProperty('name');
        expect(responseBody.user).toHaveProperty('first_name');
        expect(responseBody.user).toHaveProperty('last_name');

        allure.attachment('Response Body', JSON.stringify(responseBody, null, 2), 'application/json');
      });
    });

    // Cleanup
    await apiUtil.delete(AUTOMATION_EXERCISE_ENDPOINTS.DELETE_ACCOUNT, {
      data: new URLSearchParams({
        email: getUserEmail,
        password: getUserData.password
      })
    });
  });
});
