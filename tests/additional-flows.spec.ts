import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage.js';
import { LoginSignupPage } from '../pages/LoginSignupPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import testData from '../test-data/userData.json' assert { type: 'json' };


/**
 * Additional Test Flows
 * Missing test cases from the complete test case list
 */
test.describe('Additional Test Flows', { tag: ['@additional', '@regression'] }, () => {
  let homePage: HomePage;
  let loginSignupPage: LoginSignupPage;
  let signupPage: SignupPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  const timestamp = Date.now();

  test.beforeEach(async ({ page }) => {
    allure.epic('Additional Flows');

    homePage = new HomePage(page);
    loginSignupPage = new LoginSignupPage(page);
    signupPage = new SignupPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
  });

  test('TC024: Verify Test Cases Page', { tag: '@sanity' }, async () => {
    allure.story('Navigation');
    allure.feature('Test Cases Page');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Click on Test Cases button', async () => {
      await homePage.clickTestCases();
    });

    await allure.step('Verify user is navigated to test cases page successfully', async () => {
      expect(homePage.page.url()).toContain('test_cases');
      allure.parameter('URL', homePage.page.url());
    });
  });

  test('TC025: Verify Subscription in home page', { tag: '@sanity' }, async () => {
    allure.story('Newsletter Subscription');
    allure.feature('Home Page Subscription');
    allure.severity('normal');

    const email = `${testData.subscription.emailPrefix}${timestamp}@example.com`;

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Scroll down to footer', async () => {
      await homePage.scrollToBottom();
    });

    await allure.step('Verify text SUBSCRIPTION', async () => {
      // Subscription section should be visible
      const footerContent = await homePage.page.textContent('footer');
      expect(footerContent).toContain('Subscription');
    });

    await allure.step('Enter email address in input and click arrow button', async () => {
      await homePage.subscribeToNewsletter(email);
      allure.parameter('Email', email);
    });

    await allure.step('Verify success message is displayed', async () => {
      expect(await homePage.isSubscriptionSuccessful()).toBeTruthy();

      const successMessage = await homePage.getSubscriptionSuccessMessage();
      allure.attachment('Success Message', successMessage, 'text/plain');
    });
  });

  test('TC026: Place Order: Register before Checkout', { tag: '@critical' }, async () => {
    allure.story('Checkout Flow');
    allure.feature('Place Order with Pre-registration');
    allure.severity('critical');

    const testUser = {
      ...testData.preRegisterUser,
      email: `${testData.preRegisterUser.emailPrefix}${timestamp}@example.com`
    };

    const paymentDetails = testData.paymentDetails;

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click Signup / Login button', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Fill all details and create account', async () => {
      await loginSignupPage.signup(testUser.name, testUser.email);

      await signupPage.fillSignupForm(
        testUser.title,
        testUser.password,
        testUser.dateOfBirth,
        testUser
      );

      await signupPage.clickCreateAccount();
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
    });

    await allure.step('Click Continue button', async () => {
      await signupPage.clickContinue();
    });

    await allure.step('Verify Logged in as username at top', async () => {
      expect(await homePage.isUserLoggedIn(testUser.name)).toBeTruthy();
    });

    await allure.step('Add products to cart', async () => {
      await homePage.addProductToCart(0);
      await homePage.clickViewCart();
    });

    await allure.step('Verify Cart page is displayed', async () => {
      expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
    });

    await allure.step('Click Proceed To Checkout', async () => {
      await cartPage.clickProceedToCheckout();
    });

    await allure.step('Verify Address Details and Review Your Order', async () => {
      expect(await checkoutPage.isDeliveryAddressDisplayed()).toBeTruthy();
      expect(await checkoutPage.isOrderReviewDisplayed()).toBeTruthy();

      // Verify address contains user details
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.firstName)).toBeTruthy();
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.address)).toBeTruthy();
    });

    await allure.step('Enter description in comment text area and click Place Order', async () => {
      await checkoutPage.addOrderComment(testData.orderComments.businessHours);
      await checkoutPage.clickPlaceOrder();
    });

    await allure.step('Enter payment details and click Pay and Confirm Order', async () => {
      await checkoutPage.completePayment(
        paymentDetails.nameOnCard,
        paymentDetails.cardNumber,
        paymentDetails.cvc,
        paymentDetails.expiryMonth,
        paymentDetails.expiryYear
      );
    });

    await allure.step('Verify success message Your order has been placed successfully!', async () => {
      expect(await checkoutPage.isOrderPlacedSuccessfully()).toBeTruthy();
    });

    await allure.step('Cleanup - Delete Account', async () => {
      await checkoutPage.clickContinue();
      await homePage.clickDeleteAccount();
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });
  });

  test('TC027: Search Products and Verify Cart After Login', { tag: '@critical' }, async () => {
    allure.story('Search and Cart');
    allure.feature('Search Products with Login');
    allure.severity('critical');

    const testUser = {
      ...testData.searchCartUser,
      email: `${testData.searchCartUser.emailPrefix}${timestamp}@example.com`
    };

    const searchTerm = testData.searchTerms.dress;

    await allure.step('Navigate to Products page', async () => {
      await productsPage.navigateToProductsPage();
      expect(await productsPage.isAllProductsHeadingVisible()).toBeTruthy();
    });

    await allure.step('Verify All Products page is visible', async () => {
      const productsCount = await productsPage.getProductsCount();
      expect(productsCount).toBeGreaterThan(0);
      allure.parameter('Total Products', productsCount);
    });

    await allure.step(`Search for products with "${searchTerm}"`, async () => {
      await productsPage.searchProduct(searchTerm);
      allure.parameter('Search Term', searchTerm);
    });

    await allure.step('Verify SEARCHED PRODUCTS is visible', async () => {
      expect(await productsPage.isSearchedProductsHeadingVisible()).toBeTruthy();
    });

    await allure.step('Verify all the products related to search are visible', async () => {
      expect(await productsPage.areSearchedProductsVisible()).toBeTruthy();

      const searchedProducts = await productsPage.getAllProductNames();
      allure.attachment('Searched Products', JSON.stringify(searchedProducts, null, 2), 'application/json');
    });

    await allure.step('Add those products to cart', async () => {
      if (await productsPage.getProductsCount() > 0) {
        await productsPage.addProductToCart(0);
        await productsPage.clickContinueShopping();
      }

      if (await productsPage.getProductsCount() > 1) {
        await productsPage.addProductToCart(1);
        await productsPage.clickViewCartInModal();
      }
    });

    await allure.step('Click Cart button and verify products are visible in cart', async () => {
      expect(await cartPage.isCartPageDisplayed()).toBeTruthy();

      const cartProductsCount = await cartPage.getCartProductsCount();
      expect(cartProductsCount).toBeGreaterThan(0);
      allure.parameter('Products in Cart', cartProductsCount);
    });

    await allure.step('Click Signup / Login button and register', async () => {
      await homePage.clickSignupLogin();
      await loginSignupPage.signup(testUser.name, testUser.email);

      await signupPage.selectTitle(testUser.title);
      await signupPage.fillPassword(testUser.password);
      await signupPage.selectDateOfBirth(testUser.dateOfBirth.day, testUser.dateOfBirth.month, testUser.dateOfBirth.year);
      await signupPage.fillFirstName(testUser.firstName);
      await signupPage.fillLastName(testUser.lastName);
      await signupPage.fillAddress1(testUser.address);
      await signupPage.selectCountry(testUser.country);
      await signupPage.fillState(testUser.state);
      await signupPage.fillCity(testUser.city);
      await signupPage.fillZipcode(testUser.zipcode);
      await signupPage.fillMobileNumber(testUser.mobileNumber);

      await signupPage.clickCreateAccount();
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });

    await allure.step('Again go to Cart page', async () => {
      await homePage.clickCart();
    });

    await allure.step('Verify products still visible in cart after login', async () => {
      expect(await cartPage.isCartPageDisplayed()).toBeTruthy();

      const cartProductsCount = await cartPage.getCartProductsCount();
      expect(cartProductsCount).toBeGreaterThan(0);
      allure.parameter('Products After Login', cartProductsCount);
    });

    await allure.step('Cleanup - Delete Account', async () => {
      await homePage.clickDeleteAccount();
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });
  });

  test('TC028: Verify Scroll Up using Arrow button and Scroll Down functionality', { tag: '@sanity' }, async () => {
    allure.story('Page Navigation');
    allure.feature('Scroll Up/Down with Arrow');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Verify FULL-FLEDGED PRACTICE WEBSITE FOR AUTOMATION ENGINEERS is visible', async () => {
      const pageContent = await homePage.page.textContent('body');
      expect(pageContent).toContain('Automation');
    });

    await allure.step('Scroll down page to bottom', async () => {
      await homePage.scrollToBottom();
      allure.parameter('Scrolled', 'To Bottom');
    });

    await allure.step('Verify SUBSCRIPTION is visible', async () => {
      const footerContent = await homePage.page.textContent('footer');
      expect(footerContent).toContain('Subscription');
    });

    await allure.step('Click on arrow at bottom right side to move upward', async () => {
      const scrollUpButton = homePage.page.locator('#scrollUp');

      if (await scrollUpButton.isVisible()) {
        await scrollUpButton.click();
        allure.parameter('Arrow Button', 'Clicked');
      } else {
        // If arrow not visible, scroll up manually
        await homePage.scrollToTop();
      }

      await homePage.wait(1000); // Wait for scroll animation
    });

    await allure.step('Verify page is scrolled up and text is visible on screen', async () => {
      const pageContent = await homePage.page.textContent('body');
      expect(pageContent).toContain('Automation');
    });
  });

  test('TC029: Verify Scroll Up without Arrow button and Scroll Down functionality', { tag: '@sanity' }, async () => {
    allure.story('Page Navigation');
    allure.feature('Scroll Up/Down without Arrow');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Verify FULL-FLEDGED PRACTICE WEBSITE FOR AUTOMATION ENGINEERS is visible', async () => {
      const pageContent = await homePage.page.textContent('body');
      expect(pageContent).toContain('Automation');
    });

    await allure.step('Scroll down page to bottom', async () => {
      await homePage.scrollToBottom();
      allure.parameter('Scrolled', 'To Bottom');
    });

    await allure.step('Verify SUBSCRIPTION is visible', async () => {
      const footerContent = await homePage.page.textContent('footer');
      expect(footerContent).toContain('Subscription');
    });

    await allure.step('Scroll up page to top', async () => {
      await homePage.scrollToTop();
      await homePage.wait(1000); // Wait for scroll animation
      allure.parameter('Scrolled', 'To Top');
    });

    await allure.step('Verify page is scrolled up and text is visible on screen', async () => {
      const pageContent = await homePage.page.textContent('body');
      expect(pageContent).toContain('Automation');
    });
  });
});
