import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Page } from '@playwright/test';
import type { TestData } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadTestData(): TestData {
  const file = join(__dirname, '..', 'data', 'test-data.json');
  return JSON.parse(readFileSync(file, 'utf8')) as TestData;
}

export async function waitForResponse(
  page: Page,
  selector: string = '.message-title',
  timeout: number = 10000
): Promise<string> {
  await page.waitForSelector(selector, { timeout });
  const el = page.locator(selector).last();
  return (await el.innerText()).trim();
}
