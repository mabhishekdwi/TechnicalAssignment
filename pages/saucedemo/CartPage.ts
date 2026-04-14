import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage.js';

/**
 * SauceDemo Shopping Cart Page
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle              = page.locator('.title');
    this.cartItems              = page.locator('.cart_item');
    this.checkoutButton         = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async isCartPageVisible(): Promise<boolean> {
    return this.pageTitle.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('load');
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Remove an item from the cart by product name.
   */
  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: productName });
    await item.locator('button[data-test^="remove"]').click();
  }
}
