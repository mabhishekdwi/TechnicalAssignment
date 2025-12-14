import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120 * 1000, // Increased to 2 minutes for regression tests
  expect: { timeout: 10000 }, // Increased to 10 seconds
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1, // Added 1 retry for local runs

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
    headless: true, // Always run in headless mode
    // headless: process.env.CI ? true : false,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15 * 1000, // Increased to 15 seconds
    navigationTimeout: 30 * 1000, // Added 30 seconds for page navigation
    trace: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || 'https://automationexercise.com/'
  },

  // ===============================
  // ONLY DESKTOP CHROME PROJECT
  // ===============================
  projects: [
    {
      name: 'desktop-chrome',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    },

    // ===============================
    // REGRESSION SUITE
    // ===============================
    {
      name: 'regression',
      testMatch: [
        '**/signup.spec.ts',
        '**/login.spec.ts',
        '**/products.spec.ts',
        '**/cart.spec.ts',
        '**/checkout.spec.ts',
        '**/additional-flows.spec.ts'
      ],
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome'
      }
    }

    /*
    // ===============================
    // OTHER PROJECTS (COMMENTED)
    // ===============================

    {
      name: 'cross-browser-firefox',
      use: {
        ...devices['Desktop Firefox'],
        browserName: 'firefox'
      }
    },
    {
      name: 'cross-browser-safari',
      use: {
        ...devices['Desktop Safari'],
        browserName: 'webkit'
      }
    },
    {
      name: 'smoke',
      grep: /@smoke/
    },
    {
      name: 'sanity',
      grep: /@sanity/
    },
    {
      name: 'nightly'
    }
    */
  ]
});
