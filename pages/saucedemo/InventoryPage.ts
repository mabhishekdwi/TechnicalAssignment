import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage.js';

/**
 * SauceDemo Inventory / Products Page
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly inventoryItems: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly sortDropdown: Locator;
  private readonly burgerMenu: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle      = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge      = page.locator('.shopping_cart_badge');
    this.cartLink       = page.locator('.shopping_cart_link');
    this.sortDropdown   = page.locator('[data-test="product_sort_container"]');
    this.burgerMenu     = page.locator('#react-burger-menu-btn');
    this.logoutLink     = page.locator('#logout_sidebar_link');
  }

  async isInventoryPageVisible(): Promise<boolean> {
    return this.pageTitle.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getFirstProductName(): Promise<string> {
    return (await this.inventoryItems.first().locator('.inventory_item_name').textContent()) ?? '';
  }

  async getFirstProductPrice(): Promise<string> {
    return (await this.inventoryItems.first().locator('.inventory_item_price').textContent()) ?? '';
  }

  /**
   * Add the very first product in the list to the cart.
   */
  async addFirstProductToCart(): Promise<void> {
    const addBtn = this.inventoryItems.first().locator('button[data-test^="add-to-cart"]');
    await addBtn.click();
  }

  /**
   * Add a product by its exact display name.
   * @param productName e.g. "Sauce Labs Backpack"
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: productName });
    await item.locator('button[data-test^="add-to-cart"]').click();
  }

  /**
   * Returns the number shown on the cart badge (0 if badge is not visible).
   */
  async getCartItemCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.textContent();
      return parseInt(text ?? '0', 10);
    }
    return 0;
  }

  async clickCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('load');
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async logout(): Promise<void> {
    await this.burgerMenu.click();
    await this.logoutLink.click();
    await this.page.waitForLoadState('load');
  }
}
