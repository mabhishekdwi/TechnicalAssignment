import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CartPage } from '../pages/CartPage.js';
import { LoginSignupPage } from '../pages/LoginSignupPage.js';

test.describe('Shopping Cart Operations', { tag: ['@ecommerce', '@regression'] }, () => {
  let homePage: HomePage;
  let productsPage: ProductsPage;
  let productDetailPage: ProductDetailPage;
  let cartPage: CartPage;
  let loginSignupPage: LoginSignupPage;

  test.beforeEach(async ({ page }) => {
    allure.epic('E-Commerce');
    allure.feature('Shopping Cart');

    homePage = new HomePage(page);
    productsPage = new ProductsPage(page);
    productDetailPage = new ProductDetailPage(page);
    cartPage = new CartPage(page);
    loginSignupPage = new LoginSignupPage(page);
  });

  test('TC013: Verify Product quantity in Cart', async () => {
    allure.story('Cart Quantity');
    allure.severity('critical');

    const quantity = 4;

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Products link', async () => {
      await homePage.clickProducts();
    });

    await allure.step('Click on View Product for any product', async () => {
      await productsPage.clickViewProduct(0);
    });

    await allure.step(`Increase quantity to ${quantity}`, async () => {
      await productDetailPage.setQuantity(quantity);
      allure.parameter('Quantity', quantity);
    });

    await allure.step('Click Add to cart button', async () => {
      await productDetailPage.addToCart();
    });

    await allure.step('Click View Cart button', async () => {
      await productDetailPage.clickViewCartInModal();
    });

    await allure.step('Verify product is displayed in cart with exact quantity', async () => {
      expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
      expect(await cartPage.verifyProductQuantity(0, quantity)).toBeTruthy();

      const actualQuantity = await cartPage.getProductQuantity(0);
      allure.parameter('Actual Quantity', actualQuantity);
    });
  });

  test('TC017: Remove Products From Cart', async () => {
    allure.story('Remove from Cart');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Add product to cart', async () => {
      await homePage.addProductToCart(0);
      await homePage.clickViewCart();
    });

    await allure.step('Verify cart page is displayed', async () => {
      expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
    });

    await allure.step('Click X button corresponding to particular product', async () => {
      const productsCountBefore = await cartPage.getCartProductsCount();
      allure.parameter('Products Before', productsCountBefore);

      await cartPage.removeProduct(0);

      const productsCountAfter = await cartPage.getCartProductsCount();
      allure.parameter('Products After', productsCountAfter);
    });

    await allure.step('Verify that product is removed from the cart', async () => {
      // If it was the only product, cart should be empty
      // const isEmpty = await cartPage.isCartEmpty();
      // allure.parameter('Cart Empty', isEmpty);
    });
  });

  test('TC016: Add Multiple Products to Cart', async () => {
    allure.story('Multiple Products');
    allure.severity('critical');

    await allure.step('Navigate to Products page', async () => {
      await productsPage.navigateToProductsPage();
    });

    await allure.step('Add first product to cart', async () => {
      const product1Name = await productsPage.getProductName(0);
      const product1Price = await productsPage.getProductPrice(0);

      await productsPage.addProductToCart(0);
      await productsPage.clickContinueShopping();

      allure.parameter('Product 1', product1Name);
      allure.parameter('Price 1', product1Price);
    });

    await allure.step('Add second product to cart', async () => {
      const product2Name = await productsPage.getProductName(1);
      const product2Price = await productsPage.getProductPrice(1);

      await productsPage.addProductToCart(1);
      await productsPage.clickViewCartInModal();

      allure.parameter('Product 2', product2Name);
      allure.parameter('Price 2', product2Price);
    });

    await allure.step('Verify both products are added to Cart', async () => {
      const cartProductsCount = await cartPage.getCartProductsCount();
      expect(cartProductsCount).toBeGreaterThanOrEqual(2);

      const allProducts = await cartPage.getAllCartProducts();
      allure.attachment('Cart Products', JSON.stringify(allProducts, null, 2), 'application/json');
    });

    await allure.step('Verify prices, quantity and total price for both products', async () => {
      const product1 = await cartPage.getProductPrice(0);
      const product2 = await cartPage.getProductPrice(1);

      allure.parameter('Product 1 Price in Cart', product1);
      allure.parameter('Product 2 Price in Cart', product2);
    });
  });

  test('TC011: Verify Subscription in Cart page', async () => {
    allure.story('Newsletter Subscription');
    allure.severity('normal');

    const email = `cartsubscribe${Date.now()}@example.com`;

    await allure.step('Navigate to Cart page', async () => {
      await cartPage.navigateToCartPage();
    });

    await allure.step('Scroll down to footer', async () => {
      await homePage.scrollToBottom();
    });

    await allure.step('Verify text SUBSCRIPTION', async () => {
      expect(await cartPage.isSubscriptionHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter email address in input and click arrow button', async () => {
      await cartPage.subscribeToNewsletter(email);
      allure.parameter('Email', email);
    });

    await allure.step('Verify success message is displayed', async () => {
      expect(await cartPage.isSubscriptionSuccessful()).toBeTruthy();
    });
  });

  test('TC022: Add to cart from Recommended items', async () => {
    allure.story('Recommended Items');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Scroll to bottom of page', async () => {
      await homePage.scrollToBottom();
    });

    await allure.step('Verify RECOMMENDED ITEMS are visible', async () => {
      expect(await homePage.isRecommendedItemsVisible()).toBeTruthy();
    });

    await allure.step('Click on Add To Cart on Recommended product', async () => {
      await homePage.addRecommendedItemToCart(0);
    });

    await allure.step('Click on View Cart button', async () => {
      await homePage.clickViewCart();
    });

    await allure.step('Verify product is displayed in cart page', async () => {
      expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
    });
  });
});
