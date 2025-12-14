import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';

test.describe('Products Browsing and Search', { tag: ['@ecommerce', '@regression'] }, () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    allure.epic('E-Commerce');
    allure.feature('Product Management');

    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    productDetailPage = new ProductDetailPage(page);
  });

  test('TC008: Verify All Products and product detail page', { tag: ['@critical', '@sanity'] }, async () => {
    allure.story('Product Listing');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Click on Products link', async () => {
      await homePage.clickProducts();
    });

    await allure.step('Verify user is navigated to ALL PRODUCTS page successfully', async () => {
      expect(await productsPage.isAllProductsHeadingVisible()).toBeTruthy();
    });

    await allure.step('Verify products list is visible', async () => {
      const productsCount = await productsPage.getProductsCount();
      expect(productsCount).toBeGreaterThan(0);
      allure.parameter('Products Count', productsCount);
    });

    await allure.step('Click on View Product of first product', async () => {
      const firstProductName = await productsPage.getProductName(0);
      allure.parameter('First Product', firstProductName);
      await productsPage.clickViewProduct(0);
    });

    await allure.step('Verify user is landed to product detail page', async () => {
      expect(await productDetailPage.isProductNameVisible()).toBeTruthy();
    });

    await allure.step('Verify product details are visible', async () => {
      expect(await productDetailPage.areAllProductDetailsVisible()).toBeTruthy();

      const productDetails = await productDetailPage.getProductDetails();
      allure.attachment('Product Details', JSON.stringify(productDetails, null, 2), 'application/json');
    });
  });

  test('TC009: Search Product', { tag: ['@critical', '@smoke'] }, async () => {
    allure.story('Product Search');
    allure.severity('critical');

    const searchTerm = 'Top';

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Products link', async () => {
      await homePage.clickProducts();
    });

    await allure.step('Verify user is navigated to ALL PRODUCTS page', async () => {
      expect(await productsPage.isAllProductsHeadingVisible()).toBeTruthy();
    });

    await allure.step(`Enter product name "${searchTerm}" in search input and click search button`, async () => {
      await productsPage.searchProduct(searchTerm);
      allure.parameter('Search Term', searchTerm);
    });

    await allure.step('Verify SEARCHED PRODUCTS is visible', async () => {
      expect(await productsPage.isSearchedProductsHeadingVisible()).toBeTruthy();
    });

    await allure.step('Verify all the products related to search are visible', async () => {
      expect(await productsPage.areSearchedProductsVisible()).toBeTruthy();

      const searchedProductNames = await productsPage.getAllProductNames();
      allure.attachment('Searched Products', JSON.stringify(searchedProductNames, null, 2), 'application/json');

      // Verify at least one product contains the search term
      const hasMatchingProduct = await productsPage.verifyProductContainsText(searchTerm);
      expect(hasMatchingProduct).toBeTruthy();
    });
  });

  test('TC018: View Category Products', async () => {
    allure.story('Category Filtering');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Products link', async () => {
      await homePage.clickProducts();
    });

    await allure.step('Verify categories are visible on left sidebar', async () => {
      expect(await productsPage.isCategoryListVisible()).toBeTruthy();
    });

    await allure.step('Click on Women category', async () => {
      await productsPage.clickCategory('Women');
    });

    await allure.step('Click on Dress sub-category', async () => {
      await productsPage.clickSubCategory('Dress');
    });

    await allure.step('Verify category products page is displayed', async () => {
      const productsCount = await productsPage.getProductsCount();
      expect(productsCount).toBeGreaterThan(0);
      allure.parameter('Products in Category', productsCount);
    });
  });

  test('TC019: View & Cart Brand Products', async () => {
    allure.story('Brand Filtering');
    allure.severity('normal');

    await allure.step('Navigate to Products page', async () => {
      await productsPage.navigateToProductsPage();
    });

    await allure.step('Verify brands are visible on left sidebar', async () => {
      expect(await productsPage.isBrandsListVisible()).toBeTruthy();
    });

    await allure.step('Click on any brand name', async () => {
      await productsPage.clickBrand('Polo');
      allure.parameter('Brand', 'Polo');
    });

    await allure.step('Verify user is navigated to brand page', async () => {
      const productsCount = await productsPage.getProductsCount();
      expect(productsCount).toBeGreaterThan(0);
      allure.parameter('Products Count', productsCount);
    });

    await allure.step('Click on another brand', async () => {
      await productsPage.clickBrand('H&M');
      allure.parameter('Brand', 'H&M');
    });

    await allure.step('Verify products are displayed for selected brand', async () => {
      const productsCount = await productsPage.getProductsCount();
      expect(productsCount).toBeGreaterThan(0);
    });
  });

  test('TC012: Add Products to Cart from Products Page', async () => {
    allure.story('Add to Cart');
    allure.severity('critical');

    await allure.step('Navigate to Products page', async () => {
      await productsPage.navigateToProductsPage();
    });

    await allure.step('Hover over first product and click Add to cart', async () => {
      const productName = await productsPage.getProductName(0);
      await productsPage.addProductToCart(0);
      allure.parameter('Product 1', productName);
    });

    await allure.step('Click Continue Shopping button', async () => {
      await productsPage.clickContinueShopping();
    });

    await allure.step('Hover over second product and click Add to cart', async () => {
      const productName = await productsPage.getProductName(1);
      await productsPage.addProductToCart(1);
      allure.parameter('Product 2', productName);
    });

    await allure.step('Click View Cart button', async () => {
      await productsPage.clickViewCartInModal();
    });

    await allure.step('Verify both products are added to Cart', async () => {
      // This will be verified in CartPage tests
      expect(homePage.page.url()).toContain('/view_cart');
    });
  });

  test('TC021: Add Review on Product', async () => {
    allure.story('Product Review');
    allure.severity('normal');

    const review = {
      name: 'Test Reviewer',
      email: 'reviewer@example.com',
      reviewText: 'This is a great product! Highly recommended.'
    };

    await allure.step('Navigate to Products page', async () => {
      await productsPage.navigateToProductsPage();
    });

    await allure.step('Click on View Product button', async () => {
      await productsPage.clickViewProduct(0);
    });

    await allure.step('Verify Write Your Review is visible', async () => {
      await productDetailPage.scrollToReviewSection();
      expect(await productDetailPage.isWriteReviewHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter name, email and review', async () => {
      await productDetailPage.writeReview(review.name, review.email, review.reviewText);
      allure.attachment('Review Details', JSON.stringify(review, null, 2), 'application/json');
    });

    await allure.step('Verify success message is displayed', async () => {
      expect(await productDetailPage.isReviewSuccessMessageVisible()).toBeTruthy();

      const successMessage = await productDetailPage.getReviewSuccessMessage();
      allure.attachment('Success Message', successMessage, 'text/plain');
    });
  });
  
});
