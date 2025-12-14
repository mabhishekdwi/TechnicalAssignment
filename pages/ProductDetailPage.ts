import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class ProductDetailPage extends BasePage {
  // Locators
  private readonly productName: Locator;
  private readonly productCategory: Locator;
  private readonly productPrice: Locator;
  private readonly productAvailability: Locator;
  private readonly productCondition: Locator;
  private readonly productBrand: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly writeReviewHeading: Locator;
  private readonly reviewNameInput: Locator;
  private readonly reviewEmailInput: Locator;
  private readonly reviewTextArea: Locator;
  private readonly submitReviewButton: Locator;
  private readonly reviewSuccessAlert: Locator;
  private readonly viewCartModalLink: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);

    // Product Information
    this.productName = page.locator('.product-information h2');
    this.productCategory = page.locator('.product-information p:has-text("Category:")');
    this.productPrice = page.locator('.product-information span span');
    this.productAvailability = page.locator('.product-information p:has-text("Availability:")');
    this.productCondition = page.locator('.product-information p:has-text("Condition:")');
    this.productBrand = page.locator('.product-information p:has-text("Brand:")');

    // Cart Actions
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button.cart');

    // Review Section
    this.writeReviewHeading = page.locator('a[href="#reviews"]');
    this.reviewNameInput = page.locator('#name');
    this.reviewEmailInput = page.locator('#email');
    this.reviewTextArea = page.locator('#review');
    this.submitReviewButton = page.locator('#button-review');
    this.reviewSuccessAlert = page.locator('.alert-success').first();

    // Modal Locators
    this.viewCartModalLink = page.locator('a:has-text("View Cart")');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
  }

  /**
   * Verify product name is visible
   */
  async isProductNameVisible(): Promise<boolean> {
    return await this.productName.isVisible();
  }

  /**
   * Verify product price is visible
   */
  async isPriceVisible(): Promise<boolean> {
    return await this.productPrice.isVisible();
  }

  /**
   * Verify product availability is visible
   */
  async isAvailabilityVisible(): Promise<boolean> {
    return await this.productAvailability.isVisible();
  }

  /**
   * Get product name
   */
  async getProductName(): Promise<string> {
    return await this.productName.textContent() || '';
  }

  /**
   * Get product category
   */
  async getProductCategory(): Promise<string> {
    const text = await this.productCategory.textContent() || '';
    return text.replace('Category:', '').trim();
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.productPrice.textContent() || '';
  }

  /**
   * Get product availability
   */
  async getProductAvailability(): Promise<string> {
    const text = await this.productAvailability.textContent() || '';
    return text.replace('Availability:', '').trim();
  }

  /**
   * Get product condition
   */
  async getProductCondition(): Promise<string> {
    const text = await this.productCondition.textContent() || '';
    return text.replace('Condition:', '').trim();
  }

  /**
   * Get product brand
   */
  async getProductBrand(): Promise<string> {
    const text = await this.productBrand.textContent() || '';
    return text.replace('Brand:', '').trim();
  }

  /**
   * Verify all product details are visible
   */
  async areAllProductDetailsVisible(): Promise<boolean> {
    return await this.productName.isVisible() &&
           await this.productCategory.isVisible() &&
           await this.productPrice.isVisible() &&
           await this.productAvailability.isVisible() &&
           await this.productCondition.isVisible() &&
           await this.productBrand.isVisible();
  }

  /**
   * Set product quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.clear();
    await this.quantityInput.fill(quantity.toString());
  }

  /**
   * Get current quantity
   */
  async getQuantity(): Promise<number> {
    const value = await this.quantityInput.inputValue();
    return parseInt(value) || 1;
  }

  /**
   * Increase quantity
   */
  async increaseQuantity(amount: number = 1): Promise<void> {
    const currentQty = await this.getQuantity();
    await this.setQuantity(currentQty + amount);
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  /**
   * Add product to cart with specific quantity
   */
  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  /**
   * Click View Cart in modal
   */
  async clickViewCartInModal(): Promise<void> {
    await this.viewCartModalLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click Continue Shopping
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Verify Write Your Review heading is visible
   */
  async isWriteReviewHeadingVisible(): Promise<boolean> {
    return await this.writeReviewHeading.isVisible();
  }

  /**
   * Write a product review
   */
  async writeReview(name: string, email: string, review: string): Promise<void> {
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewTextArea.fill(review);
    await this.submitReviewButton.click();
  }

  /**
   * Verify review success message
   */
  async isReviewSuccessMessageVisible(): Promise<boolean> {
    return await this.reviewSuccessAlert.isVisible();
  }

  /**
   * Get review success message
   */
  async getReviewSuccessMessage(): Promise<string> {
    return await this.reviewSuccessAlert.textContent() || '';
  }

  /**
   * Scroll to review section
   */
  async scrollToReviewSection(): Promise<void> {
    await this.writeReviewHeading.scrollIntoViewIfNeeded();
  }

  /**
   * Get product details as object
   */
  async getProductDetails(): Promise<{
    name: string;
    category: string;
    price: string;
    availability: string;
    condition: string;
    brand: string;
  }> {
    return {
      name: await this.getProductName(),
      category: await this.getProductCategory(),
      price: await this.getProductPrice(),
      availability: await this.getProductAvailability(),
      condition: await this.getProductCondition(),
      brand: await this.getProductBrand()
    };
  }
}
