import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export interface SignupAccountInfo {
  password: string;
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
}

export class SignupPage extends BasePage {
  // Account Information Locators
  private readonly accountInfoHeading: Locator;
  private readonly titleMr: Locator;
  private readonly titleMrs: Locator;
  private readonly passwordInput: Locator;
  private readonly daySelect: Locator;
  private readonly monthSelect: Locator;
  private readonly yearSelect: Locator;
  private readonly newsletterCheckbox: Locator;
  private readonly specialOffersCheckbox: Locator;

  // Address Information Locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly companyInput: Locator;
  private readonly address1Input: Locator;
  private readonly address2Input: Locator;
  private readonly countrySelect: Locator;
  private readonly stateInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipcodeInput: Locator;
  private readonly mobileNumberInput: Locator;

  // Buttons
  private readonly createAccountButton: Locator;

  // Success/Error Messages
  private readonly accountCreatedHeading: Locator;
  private readonly continueButton: Locator;
  private readonly accountDeletedHeading: Locator;

  constructor(page: Page) {
    super(page);

    // Account Information
    this.accountInfoHeading = page.locator('h2:has-text("Enter Account Information")');
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.passwordInput = page.locator('#password');
    this.daySelect = page.locator('#days');
    this.monthSelect = page.locator('#months');
    this.yearSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');

    // Address Information
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');

    // Buttons
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    // Success Pages
    this.accountCreatedHeading = page.locator('h2[data-qa="account-created"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
    this.accountDeletedHeading = page.locator('h2[data-qa="account-deleted"]');
  }

  /**
   * Verify 'ENTER ACCOUNT INFORMATION' is visible
   */
  async isAccountInfoHeadingVisible(): Promise<boolean> {
    return await this.accountInfoHeading.isVisible();
  }

  /**
   * Select title (Mr. or Mrs.)
   */
  async selectTitle(title: 'Mr' | 'Mrs'): Promise<void> {
    if (title === 'Mr') {
      await this.titleMr.check();
    } else {
      await this.titleMrs.check();
    }
  }

  /**
   * Fill password
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Select date of birth
   */
  async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
    await this.daySelect.selectOption(day);
    await this.monthSelect.selectOption(month);
    await this.yearSelect.selectOption(year);
  }

  /**
   * Check newsletter checkbox
   */
  async checkNewsletter(): Promise<void> {
    await this.newsletterCheckbox.check();
  }

  /**
   * Check special offers checkbox
   */
  async checkSpecialOffers(): Promise<void> {
    await this.specialOffersCheckbox.check();
  }

  /**
   * Fill first name
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Fill last name
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fill company
   */
  async fillCompany(company: string): Promise<void> {
    await this.companyInput.fill(company);
  }

  /**
   * Fill address 1
   */
  async fillAddress1(address: string): Promise<void> {
    await this.address1Input.fill(address);
  }

  /**
   * Fill address 2
   */
  async fillAddress2(address: string): Promise<void> {
    await this.address2Input.fill(address);
  }

  /**
   * Select country
   */
  async selectCountry(country: string): Promise<void> {
    await this.countrySelect.selectOption(country);
  }

  /**
   * Fill state
   */
  async fillState(state: string): Promise<void> {
    await this.stateInput.fill(state);
  }

  /**
   * Fill city
   */
  async fillCity(city: string): Promise<void> {
    await this.cityInput.fill(city);
  }

  /**
   * Fill zipcode
   */
  async fillZipcode(zipcode: string): Promise<void> {
    await this.zipcodeInput.fill(zipcode);
  }

  /**
   * Fill mobile number
   */
  async fillMobileNumber(mobileNumber: string): Promise<void> {
    await this.mobileNumberInput.fill(mobileNumber);
  }

  /**
   * Click Create Account button
   */
  async clickCreateAccount(): Promise<void> {
    await this.createAccountButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Fill complete signup form
   */
  async fillSignupForm(
    title: 'Mr' | 'Mrs',
    password: string,
    dateOfBirth: { day: string; month: string; year: string },
    accountInfo: SignupAccountInfo,
    subscribeNewsletter: boolean = false,
    subscribeOffers: boolean = false
  ): Promise<void> {
    // Account Information
    await this.selectTitle(title);
    await this.fillPassword(password);
    await this.selectDateOfBirth(dateOfBirth.day, dateOfBirth.month, dateOfBirth.year);

    if (subscribeNewsletter) {
      await this.checkNewsletter();
    }

    if (subscribeOffers) {
      await this.checkSpecialOffers();
    }

    // Address Information
    await this.fillFirstName(accountInfo.firstName);
    await this.fillLastName(accountInfo.lastName);

    if (accountInfo.company) {
      await this.fillCompany(accountInfo.company);
    }

    await this.fillAddress1(accountInfo.address);

    if (accountInfo.address2) {
      await this.fillAddress2(accountInfo.address2);
    }

    await this.selectCountry(accountInfo.country);
    await this.fillState(accountInfo.state);
    await this.fillCity(accountInfo.city);
    await this.fillZipcode(accountInfo.zipcode);
    await this.fillMobileNumber(accountInfo.mobileNumber);
  }

  /**
   * Verify 'ACCOUNT CREATED!' is visible
   */
  async isAccountCreatedVisible(): Promise<boolean> {
    return await this.accountCreatedHeading.isVisible();
  }

  /**
   * Click Continue button after account creation
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify 'ACCOUNT DELETED!' is visible
   */
  async isAccountDeletedVisible(): Promise<boolean> {
    return await this.accountDeletedHeading.isVisible();
  }

  /**
   * Get account created message
   */
  async getAccountCreatedMessage(): Promise<string> {
    return await this.accountCreatedHeading.textContent() || '';
  }

  /**
   * Get account deleted message
   */
  async getAccountDeletedMessage(): Promise<string> {
    return await this.accountDeletedHeading.textContent() || '';
  }
}
