import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage.js';
import { CartPage } from '../../pages/saucedemo/CartPage.js';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage.js';

const VALID_USER = { username: 'standard_user', password: 'secret_sauce' };

test.describe('Shopping Cart & Checkout', { tag: ['@checkout', '@regression'] }, () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    allure.epic('SauceDemo');
    allure.feature('Checkout');
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage      = new CartPage(page);
    checkoutPage  = new CheckoutPage(page);

    // Login before every checkout test
    await loginPage.navigate();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(page).toHaveURL(/inventory/);
  });

  // ── TC-C-001 ──────────────────────────────────────────────────────────────────
  test(
    'TC-C-001: Complete successful checkout flow',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.story('Successful Checkout');
      allure.severity('critical');

      await allure.step('Add product to cart', async () => {
        await inventoryPage.addFirstProductToCart();
        expect(await inventoryPage.getCartItemCount()).toBe(1);
      });

      await allure.step('Open cart and verify item', async () => {
        await inventoryPage.clickCart();
        expect(await cartPage.isCartPageVisible()).toBeTruthy();
        expect(await cartPage.getCartItemCount()).toBe(1);
      });

      await allure.step('Proceed to checkout', async () => {
        await cartPage.clickCheckout();
      });

      await allure.step('Fill in valid shipping information', async () => {
        await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
        await checkoutPage.clickContinue();
        // No error should appear after valid info
        expect(await checkoutPage.isErrorVisible()).toBeFalsy();
      });

      await allure.step('Verify order summary and total', async () => {
        expect(await checkoutPage.getSummaryItemCount()).toBeGreaterThan(0);
        const total = await checkoutPage.getOrderTotal();
        expect(total).toContain('Total:');
        allure.attachment('Order Total', total, 'text/plain');
      });

      await allure.step('Complete the order', async () => {
        await checkoutPage.clickFinish();
      });

      await allure.step('Verify order confirmation screen', async () => {
        expect(await checkoutPage.isOrderCompleteVisible()).toBeTruthy();
        expect(await checkoutPage.getCompleteHeaderText()).toContain('Thank you for your order');
      });
    }
  );

  // ── TC-C-002 ──────────────────────────────────────────────────────────────────
  test(
    'TC-C-002: Checkout form validation — all fields empty (negative)',
    { tag: ['@negative', '@smoke'] },
    async () => {
      allure.story('Checkout Form Validation - Empty');
      allure.severity('normal');

      await allure.step('Add product and navigate to checkout step 1', async () => {
        await inventoryPage.addFirstProductToCart();
        await inventoryPage.clickCart();
        await cartPage.clickCheckout();
      });

      await allure.step('Submit form without any data', async () => {
        await checkoutPage.clickContinue();
      });

      await allure.step('Verify First Name required error', async () => {
        expect(await checkoutPage.isErrorVisible()).toBeTruthy();
        const msg = await checkoutPage.getErrorMessage();
        expect(msg).toContain('First Name is required');
        allure.attachment('Validation Error', msg, 'text/plain');
      });
    }
  );

  // ── TC-C-003 ──────────────────────────────────────────────────────────────────
  test(
    'TC-C-003: Checkout form validation — missing last name (negative)',
    { tag: ['@negative'] },
    async () => {
      allure.story('Checkout Form Validation - Missing Last Name');
      allure.severity('normal');

      await allure.step('Add product and navigate to checkout step 1', async () => {
        await inventoryPage.addFirstProductToCart();
        await inventoryPage.clickCart();
        await cartPage.clickCheckout();
      });

      await allure.step('Fill first name only and submit', async () => {
        await checkoutPage.fillCheckoutInfo('John', '', '');
        await checkoutPage.clickContinue();
      });

      await allure.step('Verify Last Name required error', async () => {
        expect(await checkoutPage.isErrorVisible()).toBeTruthy();
        const msg = await checkoutPage.getErrorMessage();
        expect(msg).toContain('Last Name is required');
        allure.attachment('Validation Error', msg, 'text/plain');
      });
    }
  );

  // ── TC-C-004 ──────────────────────────────────────────────────────────────────
  test(
    'TC-C-004: Checkout form validation — missing postal code (negative)',
    { tag: ['@negative'] },
    async () => {
      allure.story('Checkout Form Validation - Missing Postal Code');
      allure.severity('normal');

      await allure.step('Add product and navigate to checkout step 1', async () => {
        await inventoryPage.addFirstProductToCart();
        await inventoryPage.clickCart();
        await cartPage.clickCheckout();
      });

      await allure.step('Fill first and last name but omit postal code', async () => {
        await checkoutPage.fillCheckoutInfo('John', 'Doe', '');
        await checkoutPage.clickContinue();
      });

      await allure.step('Verify Postal Code required error', async () => {
        expect(await checkoutPage.isErrorVisible()).toBeTruthy();
        const msg = await checkoutPage.getErrorMessage();
        expect(msg).toContain('Postal Code is required');
        allure.attachment('Validation Error', msg, 'text/plain');
      });
    }
  );

  // ── TC-C-005 ──────────────────────────────────────────────────────────────────
  test(
    'TC-C-005: Continue shopping from cart returns to product page',
    { tag: ['@positive'] },
    async () => {
      allure.story('Continue Shopping Navigation');
      allure.severity('minor');

      await allure.step('Add item and go to cart', async () => {
        await inventoryPage.addFirstProductToCart();
        await inventoryPage.clickCart();
        expect(await cartPage.isCartPageVisible()).toBeTruthy();
      });

      await allure.step('Click Continue Shopping', async () => {
        await cartPage.clickContinueShopping();
      });

      await allure.step('Verify user is back on inventory page with item still in cart', async () => {
        await expect(inventoryPage.page).toHaveURL(/inventory/);
        expect(await inventoryPage.isInventoryPageVisible()).toBeTruthy();
        // Badge should still show 1
        expect(await inventoryPage.getCartItemCount()).toBe(1);
      });
    }
  );
});
