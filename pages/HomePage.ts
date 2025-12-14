import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class HomePage extends BasePage {
  // Locators
  private readonly signupLoginLink: Locator;
  private readonly productsLink: Locator;
  private readonly cartLink: Locator;
  private readonly logoutLink: Locator;
  private readonly deleteAccountLink: Locator;
  private readonly loggedInAsText: Locator;
  private readonly contactUsLink: Locator;
  private readonly testCasesLink: Locator;
  private readonly apiTestingLink: Locator;
  private readonly videoTutorialsLink: Locator;
  private readonly logoImage: Locator;
  private readonly subscriptionInput: Locator;
  private readonly subscriptionButton: Locator;
  private readonly subscriptionSuccessAlert: Locator;
  private readonly recommendedItemsSection: Locator;
  private readonly featuredItemsSection: Locator;
  private readonly recommendedItemProducts: Locator;
  private readonly featuredItemProducts: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly viewCartModalLink: Locator;
  private readonly searchProductInput: Locator;
  private readonly searchProductButton: Locator;

  constructor(page: Page) {
    super(page);

    // Header Navigation Locators
    this.signupLoginLink = page.getByText('Signup / Login', { exact: true });;
    this.productsLink = page.locator('a[href="/products"]');
    this.cartLink = page.getByText('Cart', { exact: true });;
    this.logoutLink = page.locator('a[href="/logout"]');
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.loggedInAsText = page.locator('li:has-text("Logged in as")');
    this.contactUsLink = page.locator('a[href="/contact_us"]');
    this.testCasesLink = page.locator('a[href="/test_cases"]').first();
    this.apiTestingLink = page.locator('a[href="/api_list"]');
    this.videoTutorialsLink = page.locator('a[href*="youtube"]');
    this.logoImage = page.locator('img[alt="Website for automation practice"]');

    // Footer Locators
    this.subscriptionInput = page.locator('#susbscribe_email');
    this.subscriptionButton = page.locator('#subscribe');
    this.subscriptionSuccessAlert = page.locator('.alert-success');

    // Page Sections
    this.recommendedItemsSection = page.locator('.recommended_items');
    this.featuredItemsSection = page.locator('.features_items');
    this.recommendedItemProducts = page.locator('.recommended_items .product-image-wrapper');
    this.featuredItemProducts = page.locator('.features_items .product-image-wrapper');

    // Modal Locators
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartModalLink = page.locator('a:has-text("View Cart")');

    // Search Locators
    this.searchProductInput = page.locator('#search_product');
    this.searchProductButton = page.locator('#submit_search');
  }

  /**
   * Navigate to Home Page
   */
  async navigateToHomePage(): Promise<void> {
    await this.goto('/');
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Signup/Login link
   */
  async clickSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Products link
   */
  async clickProducts(): Promise<void> {
    await this.productsLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Cart link
   */
  async clickCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Contact Us link
   */
  async clickContactUs(): Promise<void> {
    await this.contactUsLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Test Cases link
   */
  async clickTestCases(): Promise<void> {
    await this.testCasesLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on API Testing link
   */
  async clickAPITesting(): Promise<void> {
    await this.apiTestingLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Video Tutorials link
   */
  async clickVideoTutorials(): Promise<void> {
    await this.videoTutorialsLink.click();
  }

  /**
   * Click on Logout link
   */
  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on Delete Account link
   */
  async clickDeleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify user is logged in
   */
  async isUserLoggedIn(username: string): Promise<boolean> {
    return await this.loggedInAsText.filter({ hasText: username }).isVisible();
  }

  /**
   * Get logged in username
   */
  async getLoggedInUsername(): Promise<string> {
    const text = await this.loggedInAsText.textContent();
    return text?.replace('Logged in as', '').trim() || '';
  }

  /**
   * Verify homepage is visible
   */
  async isHomePageVisible(): Promise<boolean> {
    return await this.logoImage.isVisible();
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    await this.subscriptionInput.scrollIntoViewIfNeeded();
    await this.subscriptionInput.fill(email);
    await this.subscriptionButton.click();
  }

  /**
   * Verify subscription success message
   */
  async isSubscriptionSuccessful(): Promise<boolean> {
    return await this.subscriptionSuccessAlert.isVisible();
  }

  /**
   * Get subscription success message
   */
  async getSubscriptionSuccessMessage(): Promise<string> {
    return await this.subscriptionSuccessAlert.textContent() || '';
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Click on category
   */
  async clickCategory(categoryName: string): Promise<void> {
    const category = this.page.locator(`.panel-heading:has-text("${categoryName}")`);
    await category.click();
  }

  /**
   * Click on sub-category
   */
  async clickSubCategory(subCategoryName: string): Promise<void> {
    const subCategory = this.page.locator(`a:has-text("${subCategoryName}")`);
    await subCategory.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify featured items section is visible
   */
  async isFeaturedItemsVisible(): Promise<boolean> {
    return await this.featuredItemsSection.isVisible();
  }

  /**
   * Verify recommended items section is visible
   */
  async isRecommendedItemsVisible(): Promise<boolean> {
    return await this.recommendedItemsSection.isVisible();
  }

  /**
   * Add recommended item to cart (by index)
   */
  async addRecommendedItemToCart(itemIndex: number = 0): Promise<void> {
    const recommendedItem = this.recommendedItemProducts.nth(itemIndex);
    await recommendedItem.scrollIntoViewIfNeeded();
    const addToCartBtn = recommendedItem.locator('.add-to-cart').first();
    await addToCartBtn.click();
  }

  /**
   * Add product to cart from home page (by index)
   */
  async addProductToCart(productIndex: number): Promise<void> {
    const product = this.featuredItemProducts.nth(productIndex);
    await product.hover();
    const addToCartBtn = product.locator('.add-to-cart').first();
    await addToCartBtn.click();
  }

  /**
   * Click Continue Shopping after adding to cart
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click View Cart after adding to cart
   */
  async clickViewCart(): Promise<void> {
    await this.viewCartModalLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Search product (if search functionality is available on home page)
   */
  async searchProduct(productName: string): Promise<void> {
    if (await this.searchProductInput.isVisible()) {
      await this.searchProductInput.fill(productName);
      await this.searchProductButton.click();
      await this.page.waitForLoadState('load');
    }
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(): Promise<boolean> {
    const title = await this.page.title();
    return title.includes('Automation Exercise');
  }
}
