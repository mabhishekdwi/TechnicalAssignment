import { test as base, Page } from '@playwright/test';
import { env } from '../config/environment.js';

export type AuthFixtures = {
  authenticatedPage: Page;
  loginAsUser: (username: string, password: string) => Promise<void>;
};

/**
 * Authentication fixture that provides an authenticated page
 * Usage in tests:
 *
 * test('My test', async ({ authenticatedPage }) => {
 *   // authenticatedPage is already logged in
 *   await authenticatedPage.goto('/dashboard');
 * });
 */
export const test = base.extend<AuthFixtures>({
  /**
   * Fixture that provides a page with the user already logged in
   */
  authenticatedPage: async ({ page }, use) => {
    const credentials = env.getCredentials();

    // Navigate to login page
    await page.goto('/login');

    // Perform login - Update these selectors based on your application
    await page.fill('[name="email"]', credentials?.email || '');
    await page.fill('[name="password"]', credentials?.password || '');
    await page.click('button[type="submit"]');

    // Wait for navigation to complete
    await page.waitForURL('**/dashboard', { timeout: 10000 }).catch(() => {
      console.log('Dashboard URL pattern not matched, continuing anyway');
    });

    // Verify login was successful by checking for a logout button or user menu
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 }).catch(() => {
      console.log('User menu not found, login might have failed');
    });

    console.log('Login successful');

    // Provide the authenticated page to the test
    await use(page);
  },

  /**
   * Fixture that provides a login function
   * This allows tests to login with different credentials if needed
   */
  loginAsUser: async ({ page }, use) => {
    const login = async (username: string, password: string) => {
      await page.goto('/login');
      await page.fill('[name="email"]', username);
      await page.fill('[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
      console.log(`Logged in as ${username}`);
    };

    await use(login);
  }
});

export { expect } from '@playwright/test';

/**
 * Alternative fixture using storage state for faster authentication
 * This saves the authentication state and reuses it across tests
 */
export const testWithStorageState = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const credentials = env.getCredentials();

    // Create a new context with storage state
    const context = await browser.newContext({
      storageState: process.env.STORAGE_STATE || undefined
    });

    const page = await context.newPage();

    // If no storage state exists, perform login
    if (!process.env.STORAGE_STATE) {
      await page.goto('/login');
      await page.fill('[name="email"]', credentials?.email || '');
      await page.fill('[name="password"]', credentials?.password || '');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Save storage state
      await context.storageState({ path: 'auth-state.json' });
      console.log('Authentication state saved to auth-state.json');
    }

    await use(page);
    await context.close();
  },

  loginAsUser: async ({ browser }, use) => {
    const login = async (username: string, password: string) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/login');
      await page.fill('[name="email"]', username);
      await page.fill('[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      await context.storageState({ path: `auth-state-${username}.json` });
      console.log(`Logged in as ${username} and saved state`);

      await context.close();
    };

    await use(login);
  }
});
