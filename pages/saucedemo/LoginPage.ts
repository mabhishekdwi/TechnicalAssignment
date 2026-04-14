import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage.js';

/**
 * SauceDemo Login Page
 * URL: https://www.saucedemo.com/
 *
 * Available test users:
 *   standard_user      / secret_sauce
 *   locked_out_user    / secret_sauce
 *   problem_user       / secret_sauce
 *   performance_glitch_user / secret_sauce
 *   error_user         / secret_sauce
 *   visual_user        / secret_sauce
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorContainer: Locator;
  private readonly errorMessage: Locator;
  private readonly errorCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput    = page.locator('[data-test="username"]');
    this.passwordInput    = page.locator('[data-test="password"]');
    this.loginButton      = page.locator('[data-test="login-button"]');
    this.errorContainer   = page.locator('[data-test="error"]');
    this.errorMessage     = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
  }

  async navigate(): Promise<void> {
    await this.goto('/');
    await this.page.waitForLoadState('load');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorContainer.isVisible();
  }

  async isLoginPageVisible(): Promise<boolean> {
    return this.loginButton.isVisible();
  }

  async closeErrorMessage(): Promise<void> {
    await this.errorCloseButton.click();
  }
}
