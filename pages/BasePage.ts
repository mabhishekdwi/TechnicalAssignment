import { Page, Locator } from '@playwright/test';

class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(selector: string, options: object = {}): Promise<void> {
    await this.page.click(selector, options);
  }

  async enter(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  async pressEnter(selector: string): Promise<void> {
    await this.page.press(selector, 'Enter');
  }

  async isElementPresent(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout, state: 'attached' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout, state: 'visible' });
      return true;
    } catch (error) {
      return false;
    }
  }

  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout, state: 'visible' });
  }

  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }

  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  async getInputValue(selector: string): Promise<string> {
    return await this.page.inputValue(selector);
  }

  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  async getAllElements(selector: string): Promise<Locator[]> {
    return await this.page.locator(selector).all();
  }

  async focus(selector: string): Promise<void> {
    await this.page.focus(selector);
  }

  async tap(selector: string): Promise<void> {
    await this.page.tap(selector);
  }

  async evaluate<R = any>(fn: any, arg?: any): Promise<R> {
    return await this.page.evaluate(fn, arg);
  }

  async getComputedStyle(selector: string, property: string): Promise<string> {
    return await this.page.locator(selector).evaluate((el, prop) =>
      window.getComputedStyle(el as Element).getPropertyValue(prop), property
    );
  }

  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }
}

export default BasePage;
