import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage.js';

// ── Credentials ───────────────────────────────────────────────────────────────
const VALID_USER     = { username: 'standard_user',   password: 'secret_sauce' };
const LOCKED_USER    = { username: 'locked_out_user', password: 'secret_sauce' };
const INVALID_USER   = { username: 'standard_user',   password: 'wrong_password' };
const EMPTY_USER     = { username: '',                 password: '' };

// ── Suite ─────────────────────────────────────────────────────────────────────
test.describe('Login Module', { tag: ['@login', '@regression'] }, () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    allure.epic('SauceDemo');
    allure.feature('Login');
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
  });

  // ── TC-L-001 ─────────────────────────────────────────────────────────────────
  test(
    'TC-L-001: Successful login with valid credentials',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.story('Successful Login');
      allure.severity('critical');

      await allure.step('Verify login page is loaded', async () => {
        expect(await loginPage.isLoginPageVisible()).toBeTruthy();
      });

      await allure.step('Enter valid credentials and submit', async () => {
        await loginPage.login(VALID_USER.username, VALID_USER.password);
        allure.parameter('Username', VALID_USER.username);
      });

      await allure.step('Verify redirect to Inventory page', async () => {
        await expect(inventoryPage.page).toHaveURL(/inventory/);
        expect(await inventoryPage.isInventoryPageVisible()).toBeTruthy();
        expect(await inventoryPage.getPageTitle()).toBe('Products');
      });
    }
  );

  // ── TC-L-002 ─────────────────────────────────────────────────────────────────
  test(
    'TC-L-002: Login failure with invalid password',
    { tag: ['@negative', '@smoke'] },
    async () => {
      allure.story('Failed Login - Wrong Password');
      allure.severity('normal');

      await allure.step('Enter valid username with wrong password', async () => {
        await loginPage.login(INVALID_USER.username, INVALID_USER.password);
        allure.parameter('Username', INVALID_USER.username);
      });

      await allure.step('Verify error message is displayed', async () => {
        expect(await loginPage.isErrorVisible()).toBeTruthy();
        const msg = await loginPage.getErrorMessage();
        expect(msg).toContain('Username and password do not match');
        allure.attachment('Error Message', msg, 'text/plain');
      });

      await allure.step('Verify user remains on login page', async () => {
        expect(await loginPage.isLoginPageVisible()).toBeTruthy();
      });
    }
  );

  // ── TC-L-003 ─────────────────────────────────────────────────────────────────
  test(
    'TC-L-003: Login with a locked-out user account',
    { tag: ['@negative'] },
    async () => {
      allure.story('Locked User Login');
      allure.severity('normal');

      await allure.step('Attempt login with locked-out user', async () => {
        await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);
        allure.parameter('Username', LOCKED_USER.username);
      });

      await allure.step('Verify locked-out error message', async () => {
        expect(await loginPage.isErrorVisible()).toBeTruthy();
        const msg = await loginPage.getErrorMessage();
        expect(msg).toContain('Sorry, this user has been locked out');
        allure.attachment('Error Message', msg, 'text/plain');
      });
    }
  );

  // ── TC-L-004 ─────────────────────────────────────────────────────────────────
  test(
    'TC-L-004: Login with empty username and password',
    { tag: ['@negative'] },
    async () => {
      allure.story('Empty Credentials Validation');
      allure.severity('minor');

      await allure.step('Submit login form with empty fields', async () => {
        await loginPage.login(EMPTY_USER.username, EMPTY_USER.password);
      });

      await allure.step('Verify required-field validation error', async () => {
        expect(await loginPage.isErrorVisible()).toBeTruthy();
        const msg = await loginPage.getErrorMessage();
        expect(msg).toContain('Username is required');
        allure.attachment('Error Message', msg, 'text/plain');
      });
    }
  );
});
