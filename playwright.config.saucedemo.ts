import { defineConfig, devices } from '@playwright/test';

/**
 * SauceDemo Web UI Test Configuration
 * Target: https://www.saucedemo.com/
 */
export default defineConfig({
  testDir: './tests/saucedemo',
  timeout: 60 * 1000,
  expect: { timeout: 10000 },
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/saucedemo-report', open: 'never' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
    ['json', { outputFile: 'reports/saucedemo-results.json' }]
  ],

  use: {
    headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://www.saucedemo.com'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    }
  ]
});
