import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage.js';
import { LoginSignupPage } from '../pages/LoginSignupPage.js';

test.describe('User Login Flow', { tag: ['@user-management', '@regression'] }, () => {
  let homePage: HomePage;
  let loginSignupPage: LoginSignupPage;

  // Test credentials (use valid test account or create one first)
  const validUser = {
    email: 'testuser@example.com',
    password: 'Test@123'
  };

  const invalidUser = {
    email: 'invalid@example.com',
    password: 'WrongPass123'
  };
  const inCorrectUser = {
    email: 'testabhishek@yopmailcom',
    password: 'Qwerty@12'
  };

  test.beforeEach(async ({ page }) => {
    allure.epic('User Management');
    allure.feature('User Login');

    homePage = new HomePage(page);
    loginSignupPage = new LoginSignupPage(page);
  });

  // ---------------- TC03: Login User with incorrect email/password ----------------
    test('TC003: Login User with incorrect email and password', { tag: ['@critical', '@sanity', '@smoke'] }, async () => {
    allure.story('Successful Login');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Click on Signup / Login link', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Verify Login to your account is visible', async () => {
      expect(await loginSignupPage.isLoginHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter correct email and password', async () => {
      await loginSignupPage.login(inCorrectUser.email, inCorrectUser.password);
      allure.parameter('Email', inCorrectUser.email);
    });

    await allure.step('Verify Logged in as username is visible', async () => {
      // This will verify based on actual response
      // const isLoggedIn = await homePage.isUserLoggedIn('username');
      // expect(isLoggedIn).toBeTruthy();
      const isError = await loginSignupPage.verifyInvalidLoginError()
      if (isError) {
        const errorMessage = await loginSignupPage.getErrorMessage();
        allure.attachment('Error Message', errorMessage, 'text/plain');
      }
    });

  
  });
   test('TC004: Logout User', async () => {
    allure.story('User Logout');
    allure.severity('normal');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Signup / Login link', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Login with valid credentials', async () => {
      await loginSignupPage.login(validUser.email, validUser.password);
    });

    // Skip if login failed
    await allure.step('Verify user is logged in', async () => {
      // const isLoggedIn = await homePage.isUserLoggedIn('username');
      // if (isLoggedIn) {
      //   allure.parameter('Login Status', 'Success');
      // }
    });

    await allure.step('Click Logout button', async () => {
      // await homePage.clickLogout();
    });

    await allure.step('Verify user is navigated to login page', async () => {
      // expect(await loginSignupPage.isLoginHeadingVisible()).toBeTruthy();
    });
  });

  test('TC002: Login User with correct email and password', { tag: ['@critical', '@sanity', '@smoke'] }, async () => {
    allure.story('Successful Login');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
    });

    await allure.step('Click on Signup / Login link', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Verify Login to your account is visible', async () => {
      expect(await loginSignupPage.isLoginHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter correct email and password', async () => {
      await loginSignupPage.login(validUser.email, validUser.password);
      allure.parameter('Email', validUser.email);
    });

    await allure.step('Verify Logged in as username is visible', async () => {
      // This will verify based on actual response
      // const isLoggedIn = await homePage.isUserLoggedIn('username');
      // expect(isLoggedIn).toBeTruthy();
    });

    // Cleanup
    await allure.step('Logout user', async () => {
      // Only logout if successfully logged in
      // await homePage.clickLogout();
    });
  });

  test('TC003.1: Login User with incorrect email and password', async () => {
    allure.story('Failed Login');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Signup / Login link', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Verify Login to your account is visible', async () => {
      expect(await loginSignupPage.isLoginHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter incorrect email and password', async () => {
      await loginSignupPage.login(invalidUser.email, invalidUser.password);
      allure.parameter('Email', invalidUser.email);
    });

    await allure.step('Verify error Your email or password is incorrect! is visible', async () => {
      const isErrorVisible = await loginSignupPage.isErrorMessageVisible();
      expect(isErrorVisible).toBeTruthy();

      const errorMessage = await loginSignupPage.getErrorMessage();
      allure.attachment('Error Message', errorMessage, 'text/plain');
      expect(errorMessage).toContain('Your email or password is incorrect');
    });
  });

 
  test('TC007: Verify Login form validation', async () => {
    allure.story('Form Validation');
    allure.severity('normal');

    await allure.step('Navigate to login page', async () => {
      await loginSignupPage.navigateToLoginPage();
    });

    await allure.step('Verify login form is visible', async () => {
      expect(await loginSignupPage.isLoginFormVisible()).toBeTruthy();
    });

    await allure.step('Verify signup form is visible', async () => {
      expect(await loginSignupPage.isSignupFormVisible()).toBeTruthy();
    });

    await allure.step('Test with empty fields', async () => {
      await loginSignupPage.clickLoginButton();
      // Verify browser validation or error message
    });

    await allure.step('Test with only email', async () => {
      await loginSignupPage.fillLoginEmail('test@example.com');
      await loginSignupPage.clickLoginButton();
      // Verify validation
    });

    await allure.step('Test with only password', async () => {
      await loginSignupPage.clearAllFields();
      await loginSignupPage.fillLoginPassword('password123');
      await loginSignupPage.clickLoginButton();
      // Verify validation
    });
  });
});
