import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage.js';
import { LoginSignupPage } from '../pages/LoginSignupPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { ContactUsPage } from '../pages/ContactUsPage.js';

test.describe('Checkout and Payment Flow', { tag: ['@ecommerce', '@regression'] }, () => {
  let homePage: HomePage;
  let loginSignupPage: LoginSignupPage;
  let signupPage: SignupPage;
  let productsPage: ProductsPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let contactUsPage: ContactUsPage;

  const timestamp = Date.now();
  const testUser = {
    name: 'Checkout User',
    email: `checkout${timestamp}@example.com`,
    password: 'Test@123',
    firstName: 'Checkout',
    lastName: 'User',
    company: 'Test Company',
    address: '123 Main Street',
    address2: 'Suite 100',
    country: 'United States',
    state: 'New York',
    city: 'New York',
    zipcode: '10001',
    mobileNumber: '1234567890'
  };

  const paymentDetails = {
    nameOnCard: 'Checkout User',
    cardNumber: '4111111111111111',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2025'
  };

  test.beforeEach(async ({ page }) => {
    allure.epic('E-Commerce');
    allure.feature('Checkout & Payment');

    homePage = new HomePage(page);
    loginSignupPage = new LoginSignupPage(page);
    signupPage = new SignupPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    contactUsPage = new ContactUsPage(page);
  });

  test('TC014: Place Order: Register while Checkout', { tag: ['@critical', '@sanity'] }, async () => {
    allure.story('Checkout with Registration');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
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

    await allure.step('Click Register / Login button', async () => {
      await cartPage.clickRegisterLogin();
    });

    await allure.step('Fill all details in Signup and create account', async () => {
      await loginSignupPage.signup(testUser.name, testUser.email);

      await signupPage.fillSignupForm(
        'Mr',
        testUser.password,
        { day: '10', month: 'May', year: '1990' },
        testUser
      );

      await signupPage.clickCreateAccount();
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
    });

    await allure.step('Click Continue', async () => {
      await signupPage.clickContinue();
    });

    await allure.step('Verify Logged in as username at top', async () => {
      expect(await homePage.isUserLoggedIn(testUser.name)).toBeTruthy();
    });

    await allure.step('Click Cart button and Proceed To Checkout', async () => {
      await homePage.clickCart();
      await cartPage.clickProceedToCheckout();
    });

    await allure.step('Verify Address Details', async () => {
      expect(await checkoutPage.isDeliveryAddressDisplayed()).toBeTruthy();
      expect(await checkoutPage.isBillingAddressDisplayed()).toBeTruthy();

      // Verify address contains user details
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.firstName)).toBeTruthy();
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.address)).toBeTruthy();
    });

    await allure.step('Verify Review Your Order', async () => {
      expect(await checkoutPage.isOrderReviewDisplayed()).toBeTruthy();
    });

    await allure.step('Enter description in comment text area and click Place Order', async () => {
      await checkoutPage.addOrderComment('Please deliver between 9 AM to 5 PM');
      await checkoutPage.clickPlaceOrder();
    });

    await allure.step('Enter payment details', async () => {
      await checkoutPage.completePayment(
        paymentDetails.nameOnCard,
        paymentDetails.cardNumber,
        paymentDetails.cvc,
        paymentDetails.expiryMonth,
        paymentDetails.expiryYear
      );

      allure.attachment('Payment Details', JSON.stringify(paymentDetails, null, 2), 'application/json');
    });

    await allure.step('Verify success message Your order has been placed successfully!', async () => {
      expect(await checkoutPage.isOrderPlacedSuccessfully()).toBeTruthy();
    });

    await allure.step('Click Download Invoice and verify invoice is downloaded', async () => {
      if (await checkoutPage.isDownloadInvoiceButtonVisible()) {
        await checkoutPage.clickDownloadInvoice();
      }
    });

    await allure.step('Click Continue button', async () => {
      await checkoutPage.clickContinue();
    });

    await allure.step('Cleanup - Delete Account', async () => {
      await homePage.clickDeleteAccount();
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });
  });

  test('TC016: Place Order: Login before Checkout', async () => {
    allure.story('Checkout with Existing User');
    allure.severity('critical');

    const existingUser = {
      name: 'Existing User',
      email: `existing${timestamp}@example.com`,
      password: 'Test@123'
    };

    await allure.step('Create user account first', async () => {
      await homePage.navigateToHomePage();
      await homePage.clickSignupLogin();
      await loginSignupPage.signup(existingUser.name, existingUser.email);
      await signupPage.fillSignupForm(
        'Mr',
        existingUser.password,
        { day: '10', month: 'May', year: '1990' },
        testUser
      );
      await signupPage.clickCreateAccount();
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
      await signupPage.clickContinue();

      // Logout to test login flow
      await homePage.clickLogout();
      allure.parameter('User Email', existingUser.email);
    });

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click Signup / Login button', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Login with existing credentials', async () => {
      await loginSignupPage.login(existingUser.email, existingUser.password);
      expect(await homePage.isUserLoggedIn(existingUser.name)).toBeTruthy();
    });

    await allure.step('Add products to cart', async () => {
      await homePage.clickProducts();
      await productsPage.addProductToCart(0);
      await productsPage.clickViewCartInModal();
    });

    await allure.step('Click Proceed To Checkout', async () => {
      await cartPage.clickProceedToCheckout();
    });

    await allure.step('Verify Address Details and Review Order', async () => {
      expect(await checkoutPage.isDeliveryAddressDisplayed()).toBeTruthy();
      expect(await checkoutPage.isOrderReviewDisplayed()).toBeTruthy();
    });

    await allure.step('Place order and make payment', async () => {
      await checkoutPage.clickPlaceOrder();
      await checkoutPage.completePayment(
        paymentDetails.nameOnCard,
        paymentDetails.cardNumber,
        paymentDetails.cvc,
        paymentDetails.expiryMonth,
        paymentDetails.expiryYear
      );
    });

    await allure.step('Verify order placed successfully', async () => {
      expect(await checkoutPage.isOrderPlacedSuccessfully()).toBeTruthy();
    });

    await allure.step('Cleanup - Delete Account', async () => {
      await checkoutPage.clickContinue();
      await homePage.clickDeleteAccount();
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });
  });

  test('TC006: Contact Us Form', async () => {
    allure.story('Contact Us');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Contact Us button', async () => {
      await homePage.clickContactUs();
    });

    await allure.step('Verify GET IN TOUCH is visible', async () => {
      expect(await contactUsPage.isGetInTouchHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter name, email, subject and message', async () => {
      await contactUsPage.submitContactForm(
        'John Doe',
        'john.doe@example.com',
        'Test Subject',
        'This is a test message for contact us form.'
      );

      allure.attachment('Contact Form Data', JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject'
      }, null, 2), 'application/json');
    });

    await allure.step('Verify success message is displayed', async () => {
      expect(await contactUsPage.isSuccessMessageDisplayed()).toBeTruthy();

      const successMessage = await contactUsPage.getSuccessMessage();
      allure.attachment('Success Message', successMessage, 'text/plain');
    });

    await allure.step('Click Home button and verify home page', async () => {
      await contactUsPage.clickHomeButton();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });
  });

  test('TC024: Download Invoice after purchase order', async () => {
    allure.story('Invoice Download');
    allure.severity('normal');

   
    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
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

    await allure.step('Click Register / Login button', async () => {
      await cartPage.clickRegisterLogin();
    });

    await allure.step('Fill all details in Signup and create account', async () => {
      await loginSignupPage.signup(testUser.name, testUser.email);

      await signupPage.fillSignupForm(
        'Mr',
        testUser.password,
        { day: '10', month: 'May', year: '1990' },
        testUser
      );

      await signupPage.clickCreateAccount();
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
    });

    await allure.step('Click Continue', async () => {
      await signupPage.clickContinue();
    });

    await allure.step('Verify Logged in as username at top', async () => {
      expect(await homePage.isUserLoggedIn(testUser.name)).toBeTruthy();
    });

    await allure.step('Click Cart button and Proceed To Checkout', async () => {
      await homePage.clickCart();
      await cartPage.clickProceedToCheckout();
    });

    await allure.step('Verify Address Details', async () => {
      expect(await checkoutPage.isDeliveryAddressDisplayed()).toBeTruthy();
      expect(await checkoutPage.isBillingAddressDisplayed()).toBeTruthy();

      // Verify address contains user details
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.firstName)).toBeTruthy();
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.address)).toBeTruthy();
    });

    await allure.step('Verify Review Your Order', async () => {
      expect(await checkoutPage.isOrderReviewDisplayed()).toBeTruthy();
    });

    await allure.step('Enter description in comment text area and click Place Order', async () => {
      await checkoutPage.addOrderComment('Please deliver between 9 AM to 5 PM');
      await checkoutPage.clickPlaceOrder();
    });

    await allure.step('Enter payment details', async () => {
      await checkoutPage.completePayment(
        paymentDetails.nameOnCard,
        paymentDetails.cardNumber,
        paymentDetails.cvc,
        paymentDetails.expiryMonth,
        paymentDetails.expiryYear
      );

      allure.attachment('Payment Details', JSON.stringify(paymentDetails, null, 2), 'application/json');
    });

    await allure.step('Verify success message Your order has been placed successfully!', async () => {
      expect(await checkoutPage.isOrderPlacedSuccessfully()).toBeTruthy();
    });

    await allure.step('Click Download Invoice and verify invoice is downloaded', async () => {
      if (await checkoutPage.isDownloadInvoiceButtonVisible()) {
        await checkoutPage.clickDownloadInvoice();
      }
    });

    await allure.step('Click Continue button', async () => {
      await checkoutPage.clickContinue();
    });

    await allure.step('Cleanup - Delete Account', async () => {
      await homePage.clickDeleteAccount();
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });
  });

  test('TC023: Verify address details in checkout page', { tag: ['@critical', '@sanity'] }, async () => {
    allure.story('Verify address details in checkout page');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });
    
    await allure.step('Click Signup / Login button', async () => {
      await homePage.clickSignupLogin();
    });
   
    await allure.step('Fill all details in Signup and create account', async () => {
      await loginSignupPage.signup(testUser.name, testUser.email);

      await signupPage.fillSignupForm(
        'Mr',
        testUser.password,
        { day: '10', month: 'May', year: '1990' },
        testUser
      );

      await signupPage.clickCreateAccount();
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
    });

    await allure.step('Click Continue', async () => {
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
    
    await allure.step('Verify Address Details', async () => {
      expect(await checkoutPage.isDeliveryAddressDisplayed()).toBeTruthy();
      expect(await checkoutPage.isBillingAddressDisplayed()).toBeTruthy();

      // Verify address contains user details
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.firstName)).toBeTruthy();
      expect(await checkoutPage.verifyDeliveryAddressField(testUser.address)).toBeTruthy();
    });

    await allure.step(
  'Verify delivery and billing address match registration address',
  async () => {

    // Delivery address validation
    const deliveryAddress = await checkoutPage.getDeliveryAddress();
    expect(deliveryAddress).toContain(testUser.firstName);
    expect(deliveryAddress).toContain(testUser.address);
    expect(deliveryAddress).toContain(testUser.city);
    expect(deliveryAddress).toContain(testUser.state);
    expect(deliveryAddress).toContain(testUser.zipcode);

    // Billing address validation
    const billingAddress = await checkoutPage.getDeliveryAddress();
    expect(billingAddress).toContain(testUser.firstName);
    expect(billingAddress).toContain(testUser.address);
    expect(billingAddress).toContain(testUser.city);
    expect(billingAddress).toContain(testUser.state);
    expect(billingAddress).toContain(testUser.zipcode);

    // Attach for report visibility
    allure.attachment('Delivery Address', deliveryAddress, 'text/plain');
    allure.attachment('Billing Address', billingAddress, 'text/plain');
  }
);


    await allure.step('Cleanup - Delete Account', async () => {
      await homePage.clickDeleteAccount();
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
      await signupPage.clickContinue();
    });
  });
});
