import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class LoginSignupPage extends BasePage {
  // Locators - Signup Section
  private readonly signupNameInput: Locator;
  private readonly signupEmailInput: Locator;
  private readonly signupButton: Locator;
  private readonly signupHeading: Locator;

  // Locators - Login Section
  private readonly loginEmailInput: Locator;
  private readonly loginPasswordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loginHeading: Locator;
  private readonly invalidLoginError: Locator;

  // Error/Success Messages
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Signup Section
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.signupHeading = page.locator('.signup-form h2');

    // Login Section
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginHeading = page.locator('.login-form h2');

    // Messages
    this.errorMessage = page.locator('p[style*="color: red"]');
    this.successMessage = page.locator('.alert-success');
    this.invalidLoginError = page.locator('p:has-text("Your email or password is incorrect!")');
  }

  /**
   * Navigate to Login/Signup Page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto('/login');
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify Login to your account is visible
   */
  async isLoginHeadingVisible(): Promise<boolean> {
    return await this.loginHeading.isVisible();
  }

  /**
   * Verify New User Signup! is visible
   */
  async isSignupHeadingVisible(): Promise<boolean> {
    return await this.signupHeading.isVisible();
  }

  /**
   * Enter login credentials and click login
   */
  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Enter signup details and click signup
   */
  async signup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Fill only signup name
   */
  async fillSignupName(name: string): Promise<void> {
    await this.signupNameInput.fill(name);
  }

  /**
   * Fill only signup email
   */
  async fillSignupEmail(email: string): Promise<void> {
    await this.signupEmailInput.fill(email);
  }

  /**
   * Click signup button
   */
  async clickSignupButton(): Promise<void> {
    await this.signupButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Fill only login email
   */
  async fillLoginEmail(email: string): Promise<void> {
    await this.loginEmailInput.fill(email);
  }

  /**
   * Fill only login password
   */
  async fillLoginPassword(password: string): Promise<void> {
    await this.loginPasswordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Verify specific error message
   */
  async verifyErrorMessage(expectedMessage: string): Promise<boolean> {
    const actualMessage = await this.getErrorMessage();
    return actualMessage.includes(expectedMessage);
  }

  /**
   * Verify success message is displayed
   */
  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  /**
   * Clear all input fields
   */
  async clearAllFields(): Promise<void> {
    await this.signupNameInput.clear();
    await this.signupEmailInput.clear();
    await this.loginEmailInput.clear();
    await this.loginPasswordInput.clear();
  }

  /**
   * Verify login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return await this.loginEmailInput.isVisible() &&
           await this.loginPasswordInput.isVisible() &&
           await this.loginButton.isVisible();
  }

  /**
   * Verify signup form is visible
   */
  async isSignupFormVisible(): Promise<boolean> {
    return await this.signupNameInput.isVisible() &&
           await this.signupEmailInput.isVisible() &&
           await this.signupButton.isVisible();
  }
  async verifyInvalidLoginError(): Promise<boolean> {
  return await this.invalidLoginError.isVisible();
}

}
