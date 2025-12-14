import { Page, Locator } from '@playwright/test';
import BasePage from './BasePage.js';

export class CheckoutPage extends BasePage {
  // Locators
  private readonly deliveryAddressSection: Locator;
  private readonly billingAddressSection: Locator;
  private readonly orderReviewSection: Locator;
  private readonly commentTextArea: Locator;
  private readonly placeOrderButton: Locator;

  // Payment Page Locators
  private readonly nameOnCardInput: Locator;
  private readonly cardNumberInput: Locator;
  private readonly cvcInput: Locator;
  private readonly expiryMonthInput: Locator;
  private readonly expiryYearInput: Locator;
  private readonly payAndConfirmButton: Locator;

  // Success/Error Messages
  private readonly orderPlacedMessage: Locator;
  private readonly downloadInvoiceButton: Locator;
  private readonly continueButton: Locator;
  private readonly totalAmountElement: Locator;

  constructor(page: Page) {
    super(page);

    // Checkout Page
    this.deliveryAddressSection = page.locator('#address_delivery');
    this.billingAddressSection = page.locator('#address_invoice');
    this.orderReviewSection = page.locator('#cart_info');
    this.commentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('a[href="/payment"]');

    // Payment Page
    this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('input[data-qa="card-number"]');
    this.cvcInput = page.locator('input[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('button[data-qa="pay-button"]');

    // Success Page
    this.orderPlacedMessage = page.locator('p:has-text("Congratulations! Your order has been confirmed!")');
    this.downloadInvoiceButton = page.locator('a[href="/download_invoice"]');
    this.continueButton = page.locator('a[data-qa="continue-button"]');
    this.totalAmountElement = page.locator('tr:has-text("Total Amount") td:last-child');
  }

  /**
   * Navigate to Checkout Page
   */
  async navigateToCheckoutPage(): Promise<void> {
    await this.goto('/checkout');
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify delivery address is displayed
   */
  async isDeliveryAddressDisplayed(): Promise<boolean> {
    return await this.deliveryAddressSection.isVisible();
  }

  /**
   * Verify billing address is displayed
   */
  async isBillingAddressDisplayed(): Promise<boolean> {
    return await this.billingAddressSection.isVisible();
  }

  /**
   * Get delivery address text
   */
  async getDeliveryAddress(): Promise<string> {
    return await this.deliveryAddressSection.textContent() || '';
  }

  /**
   * Get billing address text
   */
  async getBillingAddress(): Promise<string> {
    return await this.billingAddressSection.textContent() || '';
  }

  /**
   * Verify delivery address field
   */
  async verifyDeliveryAddressField(fieldText: string): Promise<boolean> {
    const address = await this.getDeliveryAddress();
    return address.includes(fieldText);
  }

  /**
   * Verify billing address field
   */
  async verifyBillingAddressField(fieldText: string): Promise<boolean> {
    const address = await this.getBillingAddress();
    return address.includes(fieldText);
  }

  /**
   * Verify order review section is displayed
   */
  async isOrderReviewDisplayed(): Promise<boolean> {
    return await this.orderReviewSection.isVisible();
  }

  /**
   * Add comment/message about order
   */
  async addOrderComment(comment: string): Promise<void> {
    await this.commentTextArea.fill(comment);
  }

  /**
   * Click Place Order button
   */
  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Fill payment details
   */
  async fillPaymentDetails(
    nameOnCard: string,
    cardNumber: string,
    cvc: string,
    expiryMonth: string,
    expiryYear: string
  ): Promise<void> {
    await this.nameOnCardInput.fill(nameOnCard);
    await this.cardNumberInput.fill(cardNumber);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(expiryMonth);
    await this.expiryYearInput.fill(expiryYear);
  }

  /**
   * Click Pay and Confirm Order button
   */
  async clickPayAndConfirm(): Promise<void> {
    await this.payAndConfirmButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Complete payment
   */
  async completePayment(
    nameOnCard: string,
    cardNumber: string,
    cvc: string,
    expiryMonth: string,
    expiryYear: string
  ): Promise<void> {
    await this.fillPaymentDetails(nameOnCard, cardNumber, cvc, expiryMonth, expiryYear);
    await this.clickPayAndConfirm();
  }

  /**
   * Verify order placed successfully
   */
  async isOrderPlacedSuccessfully(): Promise<boolean> {
    return await this.orderPlacedMessage.isVisible();
  }

  /**
   * Get order placed message
   */
  async getOrderPlacedMessage(): Promise<string> {
    return await this.orderPlacedMessage.textContent() || '';
  }

  /**
   * Click Download Invoice button
   */
  async clickDownloadInvoice(): Promise<void> {
    await this.downloadInvoiceButton.click();
  }

  /**
   * Click Continue button after order placed
   */
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Verify download invoice button is visible
   */
  async isDownloadInvoiceButtonVisible(): Promise<boolean> {
    return await this.downloadInvoiceButton.isVisible();
  }

  /**
   * Get product from order review
   */
  async getProductFromOrderReview(productIndex: number): Promise<{
    name: string;
    price: string;
    quantity: string;
    total: string;
  }> {
    const product = this.page.locator(`#product-${productIndex + 1}`);
    const name = await product.locator('.cart_description h4').textContent() || '';
    const price = await product.locator('.cart_price p').textContent() || '';
    const quantity = await product.locator('.cart_quantity button').textContent() || '';
    const total = await product.locator('.cart_total_price').textContent() || '';

    return { name, price, quantity, total };
  }

  /**
   * Get total amount
   */
  async getTotalAmount(): Promise<string> {
    return await this.totalAmountElement.textContent() || '';
  }

  /**
   * Verify total amount
   */
  async verifyTotalAmount(expectedAmount: string): Promise<boolean> {
    const actualAmount = await this.getTotalAmount();
    return actualAmount.includes(expectedAmount);
  }
}
