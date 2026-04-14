import { Page } from '@playwright/test';

/**
 * Wait until the cart badge shows the expected count.
 * Useful after adding or removing items from the cart.
 */
export async function waitForCartCount(page: Page, expectedCount: number): Promise<void> {
  const badge = page.locator('[data-test="shopping-cart-badge"]');
  if (expectedCount === 0) {
    await badge.waitFor({ state: 'hidden' });
  } else {
    await badge.waitFor({ state: 'visible' });
    await page.waitForFunction(
      (count) => {
        const el = document.querySelector('[data-test="shopping-cart-badge"]');
        return el?.textContent?.trim() === String(count);
      },
      expectedCount,
      { timeout: 5000 }
    );
  }
}

/**
 * Dismiss the SauceDemo burger-menu if it is currently open.
 */
export async function closeSideMenu(page: Page): Promise<void> {
  const closeBtn = page.locator('[data-test="close-menu"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await closeBtn.waitFor({ state: 'hidden' });
  }
}

/**
 * Extract the numeric price value from a price string such as "$10.99".
 */
export function parsePriceString(priceText: string): number {
  return parseFloat(priceText.replace('$', '').trim());
}

/**
 * Generate a random integer in [min, max] (inclusive).
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
