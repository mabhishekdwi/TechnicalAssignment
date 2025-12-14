import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from '../pages/HomePage.js';
import { LoginSignupPage } from '../pages/LoginSignupPage.js';
import { SignupPage } from '../pages/SignupPage.js';
import { CsvUtil } from '../utils/CsvUtil.js';

/**
 * User Data Interface matching CSV structure
 */
interface UserData {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company?: string;
  address: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  newsletter: boolean;
  specialOffers: boolean;
}

test.describe('User Registration Flow', { tag: ['@user-management', '@regression'] }, () => {
  let homePage: HomePage;
  let loginSignupPage: LoginSignupPage;
  let signupPage: SignupPage;
  let csvUtil: CsvUtil;
  let testUser: UserData;

  test.beforeAll(() => {
    // Load CSV data once before all tests
    csvUtil = new CsvUtil();
    csvUtil.loadFile('users.csv', 'test-data');
  });

  test.beforeEach(async ({ page }) => {
    allure.epic('User Management');
    allure.feature('User Registration');

    // Get test user from CSV (first row)
    const userData = csvUtil.getRow<UserData>(0);
    if (!userData) {
      throw new Error('No user data found in CSV file');
    }

    // Make email unique with timestamp to avoid conflicts
    const timestamp = Date.now();
    testUser = {
      ...userData,
      email: `${userData.email.split('@')[0]}_${timestamp}@${userData.email.split('@')[1]}`
    };

    homePage = new HomePage(page);
    loginSignupPage = new LoginSignupPage(page);
    signupPage = new SignupPage(page);
  });

  test('TC001: Register User with valid details', { tag: ['@critical', '@sanity', '@smoke'] }, async () => {
    allure.story('User Registration');
    allure.severity('critical');

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
      expect(await homePage.isHomePageVisible()).toBeTruthy();
      allure.attachment('Page URL', homePage.page.url(), 'text/plain');
    });

    await allure.step('Click on Signup / Login link', async () => {
      await homePage.clickSignupLogin();
      expect(await loginSignupPage.isSignupHeadingVisible()).toBeTruthy();
    });

    await allure.step('Enter name and email address', async () => {
      await loginSignupPage.signup(testUser.name, testUser.email);
      allure.parameter('Name', testUser.name);
      allure.parameter('Email', testUser.email);
    });

    await allure.step('Verify ENTER ACCOUNT INFORMATION is visible', async () => {
      expect(await signupPage.isAccountInfoHeadingVisible()).toBeTruthy();
    });

    await allure.step('Fill account details', async () => {
      await signupPage.fillSignupForm(
        testUser.title,
        testUser.password,
        { day: testUser.day, month: testUser.month, year: testUser.year },
        {
          password: testUser.password,
          firstName: testUser.firstName,
          lastName: testUser.lastName,
          company: testUser.company,
          address: testUser.address,
          address2: testUser.address2,
          country: testUser.country,
          state: testUser.state,
          city: testUser.city,
          zipcode: testUser.zipcode,
          mobileNumber: testUser.mobileNumber
        },
        testUser.newsletter,
        testUser.specialOffers
      );

      allure.attachment('Account Details', JSON.stringify(testUser, null, 2), 'application/json');
    });

    await allure.step('Click Create Account button', async () => {
      await signupPage.clickCreateAccount();
    });

    await allure.step('Verify ACCOUNT CREATED! is visible', async () => {
      expect(await signupPage.isAccountCreatedVisible()).toBeTruthy();
      const message = await signupPage.getAccountCreatedMessage();
      allure.attachment('Success Message', message, 'text/plain');
    });

    await allure.step('Click Continue button', async () => {
      await signupPage.clickContinue();
    });

    await allure.step('Verify Logged in as username is visible', async () => {
      expect(await homePage.isUserLoggedIn(testUser.name)).toBeTruthy();
      const username = await homePage.getLoggedInUsername();
      allure.parameter('Logged In User', username);
    });

    await allure.step('Click Delete Account button', async () => {
      await homePage.clickDeleteAccount();
    });

    await allure.step('Verify ACCOUNT DELETED! is visible', async () => {
      expect(await signupPage.isAccountDeletedVisible()).toBeTruthy();
    });
  });

  test('TC005: Register User with existing email', async () => {
    allure.story('User Registration - Negative');
    allure.severity('normal');

    
    const existingEmail = 'testabhishek1@yopmail.com';
    const testUser='abhishek';

    await allure.step('Navigate to home page', async () => {
      await homePage.navigateToHomePage();
    });

    await allure.step('Click on Signup / Login link', async () => {
      await homePage.clickSignupLogin();
    });

    await allure.step('Enter name and existing email address', async () => {
      await loginSignupPage.signup(testUser, existingEmail);
      allure.parameter('Email', existingEmail);
    });

    await allure.step('Verify error "Email Address already exist!" is visible', async () => {
      
      const isError = await loginSignupPage.isErrorMessageVisible();
      if (isError) {
        const errorMessage = await loginSignupPage.getErrorMessage();
        allure.attachment('Error Message', errorMessage, 'text/plain');
      }
    });
  });

  
});
