import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright-report' }],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
    ['json', { outputFile: 'reports/test-results.json' }]
  ],

  use: {
    headless: process.env.CI ? true : false,
    viewport: null,
    actionTimeout: 10 * 1000,
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'https://automationexercise.com/'
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox'
      }
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit'
      }
    },
    {
      name: 'Desktop Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge'
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13']
      }
    }
  ]
});
