import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class ContactUsPage extends BasePage {
  // Locators
  private readonly getInTouchHeading: Locator;
  private readonly nameInput: Locator;
  private readonly emailInput: Locator;
  private readonly subjectInput: Locator;
  private readonly messageTextArea: Locator;
  private readonly uploadFileInput: Locator;
  private readonly submitButton: Locator;
  private readonly successMessage: Locator;
  private readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.getInTouchHeading = page.locator('h2:has-text("Get In Touch")');
    this.nameInput = page.locator('input[data-qa="name"]');
    this.emailInput = page.locator('input[data-qa="email"]');
    this.subjectInput = page.locator('input[data-qa="subject"]');
    this.messageTextArea = page.locator('textarea[data-qa="message"]');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator('.status.alert-success');
    this.homeButton = page.locator('a.btn-success:has-text("Home")');
  }

  /**
   * Navigate to Contact Us Page
   */
  async navigateToContactUsPage(): Promise<void> {
    await this.goto('/contact_us');
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify GET IN TOUCH heading is visible
   */
  async isGetInTouchHeadingVisible(): Promise<boolean> {
    return await this.getInTouchHeading.isVisible();
  }

  /**
   * Fill name field
   */
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill subject field
   */
  async fillSubject(subject: string): Promise<void> {
    await this.subjectInput.fill(subject);
  }

  /**
   * Fill message field
   */
  async fillMessage(message: string): Promise<void> {
    await this.messageTextArea.fill(message);
  }

  /**
   * Upload file
   */
  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath);
  }

  /**
   * Click Submit button
   */
  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Handle alert dialog (if any)
   */
  async acceptAlert(): Promise<void> {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  /**
   * Fill complete contact form
   */
  async fillContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
    filePath?: string
  ): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillSubject(subject);
    await this.fillMessage(message);

    if (filePath) {
      await this.uploadFile(filePath);
    }
  }

  /**
   * Submit contact form
   */
  async submitContactForm(
    name: string,
    email: string,
    subject: string,
    message: string,
    filePath?: string
  ): Promise<void> {
    await this.fillContactForm(name, email, subject, message, filePath);

    // Set up alert handler before clicking submit
    this.page.once('dialog', async dialog => {
      await dialog.accept();
    });

    await this.clickSubmit();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }

  /**
   * Verify success message contains text
   */
  async verifySuccessMessage(expectedText: string): Promise<boolean> {
    const message = await this.getSuccessMessage();
    return message.includes(expectedText);
  }

  /**
   * Click Home button
   */
  async clickHomeButton(): Promise<void> {
    await this.homeButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify home button is visible
   */
  async isHomeButtonVisible(): Promise<boolean> {
    return await this.homeButton.isVisible();
  }

  /**
   * Clear all form fields
   */
  async clearAllFields(): Promise<void> {
    await this.nameInput.clear();
    await this.emailInput.clear();
    await this.subjectInput.clear();
    await this.messageTextArea.clear();
  }
}
