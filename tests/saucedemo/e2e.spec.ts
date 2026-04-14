import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage.js';
import { CartPage } from '../../pages/saucedemo/CartPage.js';
import { CheckoutPage } from '../../pages/saucedemo/CheckoutPage.js';

/**
 * End-to-End Test: Login → Browse Products → Add to Cart → Checkout → Confirm Order
 *
 * This test covers the complete happy-path purchase flow in a single scenario,
 * validating every step a real user would go through.
 */
test.describe('E2E: Complete Purchase Flow', { tag: ['@e2e', '@critical', '@smoke'] }, () => {

  test('E2E-001: Login → Add to Cart → Checkout → Order Confirmed', async ({ page }) => {
    allure.epic('SauceDemo');
    allure.feature('End-to-End Purchase');
    allure.story('Complete Purchase Flow');
    allure.severity('critical');

    const loginPage     = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage      = new CartPage(page);
    const checkoutPage  = new CheckoutPage(page);

    // ── Step 1: Navigate and Login ───────────────────────────────────────────
    await allure.step('1. Navigate to SauceDemo and login with valid credentials', async () => {
      await loginPage.navigate();
      expect(await loginPage.isLoginPageVisible()).toBeTruthy();

      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL(/inventory/);
      expect(await inventoryPage.isInventoryPageVisible()).toBeTruthy();
      expect(await inventoryPage.getPageTitle()).toBe('Products');

      allure.parameter('User', 'standard_user');
    });

    // ── Step 2: Browse Products ──────────────────────────────────────────────
    await allure.step('2. Verify product catalog is loaded', async () => {
      const count = await inventoryPage.getProductCount();
      expect(count).toBeGreaterThanOrEqual(6);
      allure.attachment('Product Count', String(count), 'text/plain');
    });

    // ── Step 3: Add Product to Cart ──────────────────────────────────────────
    await allure.step('3. Add a product to the cart', async () => {
      const productName = await inventoryPage.getFirstProductName();
      const productPrice = await inventoryPage.getFirstProductPrice();
      await inventoryPage.addFirstProductToCart();

      expect(await inventoryPage.getCartItemCount()).toBe(1);

      allure.parameter('Product Selected', productName);
      allure.parameter('Product Price', productPrice);
      allure.attachment('Selected Product', `${productName} — ${productPrice}`, 'text/plain');
    });

    // ── Step 4: Review Cart ──────────────────────────────────────────────────
    await allure.step('4. Navigate to cart and confirm item is present', async () => {
      await inventoryPage.clickCart();
      await expect(page).toHaveURL(/cart/);

      expect(await cartPage.isCartPageVisible()).toBeTruthy();
      expect(await cartPage.getCartItemCount()).toBe(1);

      const itemNames = await cartPage.getCartItemNames();
      allure.attachment('Cart Items', itemNames.join('\n'), 'text/plain');
    });

    // ── Step 5: Proceed to Checkout ──────────────────────────────────────────
    await allure.step('5. Proceed to checkout', async () => {
      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    // ── Step 6: Fill Shipping Info ───────────────────────────────────────────
    await allure.step('6. Fill in valid shipping information', async () => {
      await checkoutPage.fillCheckoutInfo('Jane', 'Doe', '90210');
      await checkoutPage.clickContinue();

      await expect(page).toHaveURL(/checkout-step-two/);
      expect(await checkoutPage.isErrorVisible()).toBeFalsy();
    });

    // ── Step 7: Review Order Summary ─────────────────────────────────────────
    await allure.step('7. Review order summary — items, subtotal, tax and total', async () => {
      expect(await checkoutPage.getSummaryItemCount()).toBeGreaterThan(0);

      const subtotal = await checkoutPage.getSubtotal();
      const tax      = await checkoutPage.getTax();
      const total    = await checkoutPage.getOrderTotal();

      expect(subtotal).toContain('Item total:');
      expect(tax).toContain('Tax:');
      expect(total).toContain('Total:');

      allure.attachment(
        'Order Summary',
        `Subtotal : ${subtotal}\nTax      : ${tax}\nTotal    : ${total}`,
        'text/plain'
      );
    });

    // ── Step 8: Complete Order ───────────────────────────────────────────────
    await allure.step('8. Click FINISH to place the order', async () => {
      await checkoutPage.clickFinish();
      await expect(page).toHaveURL(/checkout-complete/);
    });

    // ── Step 9: Verify Confirmation ──────────────────────────────────────────
    await allure.step('9. Verify order confirmation message is shown', async () => {
      expect(await checkoutPage.isOrderCompleteVisible()).toBeTruthy();

      const header = await checkoutPage.getCompleteHeaderText();
      const body   = await checkoutPage.getCompleteText();

      expect(header).toContain('Thank you for your order');
      expect(body).toContain('Your order has been dispatched');

      allure.attachment('Confirmation Header', header, 'text/plain');
    });

    // ── Step 10: Return to Products ──────────────────────────────────────────
    await allure.step('10. Navigate back to the products page', async () => {
      await checkoutPage.clickBackHome();
      await expect(page).toHaveURL(/inventory/);
      expect(await inventoryPage.isInventoryPageVisible()).toBeTruthy();
    });
  });
});
