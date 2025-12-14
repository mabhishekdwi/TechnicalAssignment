import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class CartPage extends BasePage {
  // Locators
  private readonly cartInfoTable: Locator;
  private readonly cartProducts: Locator;
  private readonly proceedToCheckoutButton: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly subscriptionInput: Locator;
  private readonly subscriptionButton: Locator;
  private readonly subscriptionSuccessAlert: Locator;
  private readonly subscriptionHeading: Locator;
  private readonly registerLoginModalLink: Locator;
  private readonly checkoutModal: Locator;

  constructor(page: Page) {
    super(page);

    this.cartInfoTable = page.locator('#cart_info');
    this.cartProducts = page.locator('.cart_description');
    this.proceedToCheckoutButton = page.locator('a.btn-default.check_out');
    this.emptyCartMessage = page.locator('p.text-center:has-text("Cart is empty")');
    this.subscriptionInput = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
    this.subscriptionSuccessAlert = page.locator('.alert-success');
    this.subscriptionHeading = page.locator('.single-widget h2:has-text("Subscription")');
    this.registerLoginModalLink = page.locator('.modal-body a[href="/login"]');
    this.checkoutModal = page.locator('.modal-content');
  }

  /**
   * Navigate to Cart Page
   */
  async navigateToCartPage(): Promise<void> {
    await this.goto('/view_cart');
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify cart page is displayed
   */
  async isCartPageDisplayed(): Promise<boolean> {
    return await this.cartInfoTable.isVisible();
  }

  /**
   * Get number of products in cart
   */
  async getCartProductsCount(): Promise<number> {
    return await this.cartProducts.count();
  }

  /**
   * Get product name by index
   */
  async getProductName(productIndex: number): Promise<string> {
    const product = this.page.locator(`#product-${productIndex + 1} .cart_description h4 a`);
    return await product.textContent() || '';
  }

  /**
   * Get product price by index
   */
  async getProductPrice(productIndex: number): Promise<string> {
    const price = this.page.locator(`#product-${productIndex + 1} .cart_price p`);
    return await price.textContent() || '';
  }

  /**
   * Get product quantity by index
   */
  async getProductQuantity(productIndex: number): Promise<number> {
    const qty = this.page.locator(`#product-${productIndex + 1} .cart_quantity button`);
    const qtyText = await qty.textContent() || '1';
    return parseInt(qtyText);
  }

  /**
   * Get product total price by index
   */
  async getProductTotalPrice(productIndex: number): Promise<string> {
    const total = this.page.locator(`#product-${productIndex + 1} .cart_total_price`);
    return await total.textContent() || '';
  }

  /**
   * Remove product from cart by index
   */
  async removeProduct(productIndex: number): Promise<void> {
    const deleteBtn = this.page.locator(`#product-${productIndex + 1} .cart_quantity_delete`);
    await deleteBtn.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify product is in cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const product = this.page.locator(`.cart_description h4:has-text("${productName}")`);
    return await product.isVisible();
  }

  /**
   * Click Proceed To Checkout button
   */
  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click Register/Login link (when checkout without login)
   */
  async clickRegisterLogin(): Promise<void> {
    await this.registerLoginModalLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  /**
   * Verify subscription heading is visible
   */
  async isSubscriptionHeadingVisible(): Promise<boolean> {
    return await this.subscriptionHeading.isVisible();
  }

  /**
   * Subscribe to newsletter from cart page
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionInput.scrollIntoViewIfNeeded();
    await this.subscriptionInput.fill(email);
    await this.subscriptionButton.click();
  }

  /**
   * Verify subscription success
   */
  async isSubscriptionSuccessful(): Promise<boolean> {
    return await this.subscriptionSuccessAlert.isVisible();
  }

  /**
   * Get all cart products info
   */
  async getAllCartProducts(): Promise<Array<{
    name: string;
    price: string;
    quantity: number;
    total: string;
  }>> {
    const count = await this.getCartProductsCount();
    const products = [];

    for (let i = 0; i < count; i++) {
      products.push({
        name: await this.getProductName(i),
        price: await this.getProductPrice(i),
        quantity: await this.getProductQuantity(i),
        total: await this.getProductTotalPrice(i)
      });
    }

    return products;
  }

  /**
   * Verify product quantity in cart
   */
  async verifyProductQuantity(productIndex: number, expectedQuantity: number): Promise<boolean> {
    const actualQuantity = await this.getProductQuantity(productIndex);
    return actualQuantity === expectedQuantity;
  }

  /**
   * Clear all products from cart
   */
  async clearCart(): Promise<void> {
    const count = await this.getCartProductsCount();

    for (let i = count - 1; i >= 0; i--) {
      await this.removeProduct(i);
      await this.wait(500); // Small wait between removals
    }
  }

  /**
   * Verify checkout modal is displayed (for non-logged-in users)
   */
  async isCheckoutModalDisplayed(): Promise<boolean> {
    return await this.checkoutModal.isVisible();
  }
}
