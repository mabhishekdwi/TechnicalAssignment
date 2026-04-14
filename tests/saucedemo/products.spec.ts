import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage.js';
import { CartPage } from '../../pages/saucedemo/CartPage.js';

const VALID_USER = { username: 'standard_user', password: 'secret_sauce' };

test.describe('Product Catalog', { tag: ['@products', '@regression'] }, () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    allure.epic('SauceDemo');
    allure.feature('Product Catalog');
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage      = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login(VALID_USER.username, VALID_USER.password);
    await expect(page).toHaveURL(/inventory/);
  });

  // ── TC-P-001 ──────────────────────────────────────────────────────────────────
  test(
    'TC-P-001: Successfully add a product to cart',
    { tag: ['@positive', '@smoke', '@critical'] },
    async () => {
      allure.story('Add Product to Cart');
      allure.severity('critical');

      await allure.step('Verify products page has items', async () => {
        const count = await inventoryPage.getProductCount();
        expect(count).toBeGreaterThan(0);
        allure.attachment('Product Count', String(count), 'text/plain');
      });

      await allure.step('Add the first product to the cart', async () => {
        const productName = await inventoryPage.getFirstProductName();
        await inventoryPage.addFirstProductToCart();
        allure.parameter('Product Added', productName);
      });

      await allure.step('Verify cart badge shows 1 item', async () => {
        expect(await inventoryPage.getCartItemCount()).toBe(1);
      });
    }
  );

  // ── TC-P-002 ──────────────────────────────────────────────────────────────────
  test(
    'TC-P-002: Product listing displays at least 6 items with valid names',
    { tag: ['@positive'] },
    async () => {
      allure.story('Product Listing');
      allure.severity('normal');

      await allure.step('Verify minimum 6 products are rendered', async () => {
        const count = await inventoryPage.getProductCount();
        expect(count).toBeGreaterThanOrEqual(6);
      });

      await allure.step('Verify all product names are non-empty', async () => {
        const names = await inventoryPage.getProductNames();
        names.forEach(name => expect(name.trim().length).toBeGreaterThan(0));
        allure.attachment('Product Names', names.join('\n'), 'text/plain');
      });
    }
  );

  // ── TC-P-003 ──────────────────────────────────────────────────────────────────
  test(
    'TC-P-003: Sort products by price low-to-high',
    { tag: ['@positive'] },
    async () => {
      allure.story('Product Sorting');
      allure.severity('normal');

      await allure.step('Apply low-to-high price sort', async () => {
        await inventoryPage.sortProducts('lohi');
      });

      await allure.step('Verify first product price is the lowest', async () => {
        // Collect all prices after sorting
        const priceTexts = await inventoryPage.page
          .locator('.inventory_item_price')
          .allTextContents();
        const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
        // First price must be ≤ all others
        prices.forEach(p => expect(prices[0]).toBeLessThanOrEqual(p));
      });
    }
  );

  // ── TC-P-004 ──────────────────────────────────────────────────────────────────
  test(
    'TC-P-004: Navigating to cart without adding items shows empty cart (negative)',
    { tag: ['@negative'] },
    async () => {
      allure.story('Empty Cart Behaviour');
      allure.severity('minor');

      await allure.step('Navigate to cart without adding any product', async () => {
        await inventoryPage.clickCart();
      });

      await allure.step('Verify cart is empty', async () => {
        expect(await cartPage.isCartPageVisible()).toBeTruthy();
        expect(await cartPage.getCartItemCount()).toBe(0);
      });
    }
  );

  // ── TC-P-005 ──────────────────────────────────────────────────────────────────
  test(
    'TC-P-005: Add a specific product by name to cart',
    { tag: ['@positive'] },
    async () => {
      allure.story('Add Named Product to Cart');
      allure.severity('normal');

      const TARGET_PRODUCT = 'Sauce Labs Backpack';

      await allure.step(`Add "${TARGET_PRODUCT}" to cart`, async () => {
        await inventoryPage.addProductToCartByName(TARGET_PRODUCT);
        allure.parameter('Product', TARGET_PRODUCT);
      });

      await allure.step('Navigate to cart and verify item is present', async () => {
        await inventoryPage.clickCart();
        const names = await cartPage.getCartItemNames();
        expect(names).toContain(TARGET_PRODUCT);
      });
    }
  );
});
