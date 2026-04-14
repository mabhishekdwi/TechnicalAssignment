import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage.js';

/**
 * SauceDemo Checkout Pages (Step 1, Step 2 & Complete)
 *
 * Step 1: /checkout-step-one.html  — shipping information form
 * Step 2: /checkout-step-two.html  — order summary
 * Complete: /checkout-complete.html — success confirmation
 */
export class CheckoutPage extends BasePage {
  // ── Step 1 ──────────────────────────────────────────────────────────────────
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  // ── Step 2 ──────────────────────────────────────────────────────────────────
  private readonly summaryItems: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;

  // ── Complete ─────────────────────────────────────────────────────────────────
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Step 1
    this.firstNameInput  = page.locator('[data-test="firstName"]');
    this.lastNameInput   = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton  = page.locator('[data-test="continue"]');
    this.cancelButton    = page.locator('[data-test="cancel"]');
    this.errorMessage    = page.locator('[data-test="error"]');

    // Step 2
    this.summaryItems    = page.locator('.cart_item');
    this.subtotalLabel   = page.locator('.summary_subtotal_label');
    this.taxLabel        = page.locator('.summary_tax_label');
    this.totalLabel      = page.locator('.summary_total_label');
    this.finishButton    = page.locator('[data-test="finish"]');

    // Complete
    this.completeHeader  = page.locator('.complete-header');
    this.completeText    = page.locator('.complete-text');
    this.backHomeButton  = page.locator('[data-test="back-to-products"]');
  }

  // ── Step 1 actions ──────────────────────────────────────────────────────────
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForLoadState('load');
  }

  async isErrorVisible(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  // ── Step 2 actions ──────────────────────────────────────────────────────────
  async getSummaryItemCount(): Promise<number> {
    return this.summaryItems.count();
  }

  async getSubtotal(): Promise<string> {
    return (await this.subtotalLabel.textContent()) ?? '';
  }

  async getTax(): Promise<string> {
    return (await this.taxLabel.textContent()) ?? '';
  }

  async getOrderTotal(): Promise<string> {
    return (await this.totalLabel.textContent()) ?? '';
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForLoadState('load');
  }

  // ── Complete actions ─────────────────────────────────────────────────────────
  async isOrderCompleteVisible(): Promise<boolean> {
    return this.completeHeader.isVisible();
  }

  async getCompleteHeaderText(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }

  async getCompleteText(): Promise<string> {
    return (await this.completeText.textContent()) ?? '';
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
    await this.page.waitForLoadState('load');
  }
}
