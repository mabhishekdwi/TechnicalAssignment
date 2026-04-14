import { defineConfig } from '@playwright/test';

/**
 * Restful-Booker API Test Configuration
 * Target: https://restful-booker.herokuapp.com/
 * Docs: https://restful-booker.herokuapp.com/apidoc/index.html
 */
export default defineConfig({
  testDir: './tests/api',
  timeout: 30 * 1000,
  expect: { timeout: 10000 },
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/api-report', open: 'never' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
    ['json', { outputFile: 'reports/api-results.json' }]
  ],

  use: {
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },

  projects: [
    {
      name: 'api',
      use: {}
    }
  ]
});
