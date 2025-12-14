import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class ProductsPage extends BasePage {
  // Locators
  private readonly allProductsHeading: Locator;
  private readonly productsList: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;
  private readonly searchedProductsHeading: Locator;
  private readonly brandsList: Locator;
  private readonly categoryList: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly viewCartModalLink: Locator;

  constructor(page: Page) {
    super(page);

    this.allProductsHeading = page.locator('.features_items h2.title');
    this.productsList = page.locator('.features_items .product-image-wrapper');
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.locator('h2.title:has-text("Searched Products")');
    this.brandsList = page.locator('.brands-name');
    this.categoryList = page.locator('.left-sidebar .panel-group');
    this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
    this.viewCartModalLink = page.locator('a:has-text("View Cart")');
  }

  /**
   * Navigate to Products Page
   */
  async navigateToProductsPage(): Promise<void> {
    await this.goto('/products');
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify ALL PRODUCTS heading is visible
   */
  async isAllProductsHeadingVisible(): Promise<boolean> {
    return await this.allProductsHeading.isVisible();
  }

  /**
   * Get products count
   */
  async getProductsCount(): Promise<number> {
    return await this.productsList.count();
  }

  /**
   * Click on View Product for the first product
   */
  async clickViewProduct(productIndex: number = 0): Promise<void> {
    const viewProductBtn = this.productsList.nth(productIndex).locator('a:has-text("View Product")');
    await viewProductBtn.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Search for a product
   */
  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify SEARCHED PRODUCTS heading is visible
   */
  async isSearchedProductsHeadingVisible(): Promise<boolean> {
    return await this.searchedProductsHeading.isVisible();
  }

  /**
   * Verify all searched products are visible
   */
  async areSearchedProductsVisible(): Promise<boolean> {
    const count = await this.getProductsCount();
    return count > 0;
  }

  /**
   * Get product name by index
   */
  async getProductName(productIndex: number): Promise<string> {
    const product = this.productsList.nth(productIndex);
    const productName = product.locator('.productinfo p');
    return await productName.textContent() || '';
  }

  /**
   * Get product price by index
   */
  async getProductPrice(productIndex: number): Promise<string> {
    const product = this.productsList.nth(productIndex);
    const productPrice = product.locator('.productinfo h2');
    return await productPrice.textContent() || '';
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(productIndex: number): Promise<void> {
    const product = this.productsList.nth(productIndex);
    await product.hover();
    const addToCartBtn = product.locator('.add-to-cart').first();
    await addToCartBtn.click();
  }

  /**
   * Add multiple products to cart
   */
  async addMultipleProductsToCart(productIndices: number[]): Promise<void> {
    for (const index of productIndices) {
      await this.addProductToCart(index);
      await this.continueShoppingButton.click();
      await this.wait(500); // Small wait between products
    }
  }

  /**
   * Click Continue Shopping after adding to cart
   */
  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  /**
   * Click View Cart in modal
   */
  async clickViewCartInModal(): Promise<void> {
    await this.viewCartModalLink.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Click on a brand
   */
  async clickBrand(brandName: string): Promise<void> {
    const brand = this.page.locator(`.brands-name a:has-text("${brandName}")`);
    await brand.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify brand products heading
   */
  async verifyBrandProductsHeading(brandName: string): Promise<boolean> {
    const heading = this.page.locator(`h2.title:has-text("${brandName}")`);
    return await heading.isVisible();
  }

  /**
   * Click on a category
   */
  async clickCategory(categoryName: string): Promise<void> {
    const category = this.page.locator(`.panel-heading a:has-text("${categoryName}")`);
    await category.click();
  }

  /**
   * Click on a sub-category
   */
  async clickSubCategory(subCategoryName: string): Promise<void> {
    const subCategory = this.page.locator(`a:has-text("${subCategoryName}")`).first();
    await subCategory.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify category products heading
   */
  async verifyCategoryProductsHeading(categoryName: string): Promise<boolean> {
    const heading = this.page.locator(`h2.title:has-text("${categoryName}")`);
    return await heading.isVisible();
  }

  /**
   * Get all visible product names
   */
  async getAllProductNames(): Promise<string[]> {
    const count = await this.getProductsCount();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await this.getProductName(i);
      names.push(name);
    }

    return names;
  }

  /**
   * Verify product contains text
   */
  async verifyProductContainsText(text: string): Promise<boolean> {
    const products = await this.getAllProductNames();
    return products.some(product => product.toLowerCase().includes(text.toLowerCase()));
  }

  /**
   * Scroll to products list
   */
  async scrollToProductsList(): Promise<void> {
    await this.productsList.first().scrollIntoViewIfNeeded();
  }

  /**
   * Verify brands list is visible
   */
  async isBrandsListVisible(): Promise<boolean> {
    return await this.brandsList.isVisible();
  }

  /**
   * Verify category list is visible
   */
  async isCategoryListVisible(): Promise<boolean> {
    return await this.categoryList.isVisible();
  }
}
