/**
 * API Endpoints Configuration
 * Centralized location for all API endpoints
 */

export const API_BASE_URLS = {
  DEV: 'https://dev-api.example.com',
  QA: 'https://qa-api.example.com',
  STAGING: 'https://staging-api.example.com',
  PROD: 'https://api.example.com',
  AUTOMATION_EXERCISE: 'https://automationexercise.com'
};

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email'
};

export const USER_ENDPOINTS = {
  GET_USER: '/users/:id',
  GET_ALL_USERS: '/users',
  CREATE_USER: '/users',
  UPDATE_USER: '/users/:id',
  DELETE_USER: '/users/:id',
  GET_USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  CHANGE_PASSWORD: '/users/change-password'
};

export const PRODUCT_ENDPOINTS = {
  GET_PRODUCT: '/products/:id',
  GET_ALL_PRODUCTS: '/products',
  SEARCH_PRODUCTS: '/products/search',
  CREATE_PRODUCT: '/products',
  UPDATE_PRODUCT: '/products/:id',
  DELETE_PRODUCT: '/products/:id',
  GET_CATEGORIES: '/products/categories',
  GET_BY_CATEGORY: '/products/category/:categoryId'
};

export const ORDER_ENDPOINTS = {
  CREATE_ORDER: '/orders',
  GET_ORDER: '/orders/:id',
  GET_ALL_ORDERS: '/orders',
  UPDATE_ORDER: '/orders/:id',
  CANCEL_ORDER: '/orders/:id/cancel',
  GET_USER_ORDERS: '/orders/user/:userId',
  GET_ORDER_STATUS: '/orders/:id/status'
};

export const CART_ENDPOINTS = {
  GET_CART: '/cart',
  ADD_TO_CART: '/cart/items',
  UPDATE_CART_ITEM: '/cart/items/:id',
  REMOVE_FROM_CART: '/cart/items/:id',
  CLEAR_CART: '/cart/clear',
  GET_CART_TOTAL: '/cart/total'
};

// Automation Exercise API Endpoints
export const AUTOMATION_EXERCISE_ENDPOINTS = {
  GET_ALL_PRODUCTS: '/api/productsList',
  GET_ALL_BRANDS: '/api/brandsList',
  SEARCH_PRODUCT: '/api/searchProduct',
  VERIFY_LOGIN: '/api/verifyLogin',
  CREATE_ACCOUNT: '/api/createAccount',
  DELETE_ACCOUNT: '/api/deleteAccount',
  UPDATE_ACCOUNT: '/api/updateAccount',
  GET_USER_DETAIL_BY_EMAIL: '/api/getUserDetailByEmail'
};

/**
 * Helper function to replace path parameters
 * @param endpoint - Endpoint with parameters (e.g., '/users/:id')
 * @param params - Object with parameter values (e.g., { id: '123' })
 * @returns Endpoint with replaced parameters (e.g., '/users/123')
 */
export function buildEndpoint(endpoint: string, params: Record<string, string | number>): string {
  let builtEndpoint = endpoint;

  for (const [key, value] of Object.entries(params)) {
    builtEndpoint = builtEndpoint.replace(`:${key}`, String(value));
  }

  return builtEndpoint;
}

/**
 * Get base URL based on environment
 * @param env - Environment name (DEV, QA, STAGING, PROD)
 * @returns Base URL for the environment
 */
export function getBaseURL(env: keyof typeof API_BASE_URLS = 'DEV'): string {
  return API_BASE_URLS[env];
}

/**
 * Example usage:
 *
 * const userEndpoint = buildEndpoint(USER_ENDPOINTS.GET_USER, { id: '123' });
 * // Returns: '/users/123'
 *
 * const baseURL = getBaseURL('QA');
 * // Returns: 'https://qa-api.example.com'
 */
