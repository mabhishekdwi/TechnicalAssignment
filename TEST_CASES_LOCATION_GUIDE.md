## 🎯 26 Manual Test Cases (Now Automated)

All 26 manual test cases have been automated and are located in the `tests/` folder.

#### 1. **tests/signup.spec.ts** (3 tests)
#### 2. **tests/login.spec.ts** (4 tests)
#### 3. **tests/products.spec.ts** (6 tests)
#### 4. **tests/cart.spec.ts** (6 tests)
#### 5. **tests/checkout.spec.ts** (4 tests)
#### 6. **tests/additional-flows.spec.ts** (6 tests)

## 🔌 All 14 API Test Cases
#### Version 1: **tests/api-tests.spec.ts** (Original - Using ApiUtil)
tests/
├── signup.spec.ts                  ← TC001, TC005
├── login.spec.ts                   ← TC002, TC003, TC004, TC007
├── products.spec.ts                ← TC008, TC009, TC012, TC018, TC019, TC021
├── cart.spec.ts                    ← TC011, TC013, TC016, TC017, TC019,TC022
├── checkout.spec.ts                ← TC006, TC014, TC016, TC024,TC023
├── additional-flows.spec.ts        ← TC010, TC015, TC020, TC025, TC026
├── e2e-complete-flow.spec.ts       ← Complete E2E journey
├── api-tests.spec.ts               ← All 14 API tests (original version)
└── api-tests-working.spec.ts       ← All 14 API tests (working version)
s```


### Execute Specific API Test Case

```bash
 📌 Basic Syntax:

  npm run <script-name>

  🎯 Examples:

  Run All Tests:

  npm run test

  Run Tests with Browser Visible (Headed Mode):

  npm run test:headed

  Run Tests in UI Mode (Interactive):

  npm run test:ui

  Run Specific Test File:

  npm run test:signup
  npm run test:login
  npm run test:cart
  npm run test:products:spec
  npm run test:checkout:spec

  Run Tests on Specific Browser:

  npm run test:chrome
  npm run test:firefox
  npm run test:safari
  npm run test:edge
  npm run test:mobile

  Run All Browsers:

  npm run test:allbrowsers

  Run Tests by Tags:

  npm run test:smoke
  npm run test:sanity
  npm run test:critical
  npm run test:regression

  Run Test Suites:

  npm run test:user-management
  npm run test:ecommerce
  npm run test:products
  npm run test:checkout
  npm run test:nightly

  Run API Tests:

  npm run test:api
  npm run test:api:critical
  npm run test:api:negative
  npm run test:api:working

  Run with Parallel Workers:

  npm run test:parallel

  Type Check (Without Running Tests):

  npm run type-check

  View Test Report:

  npm run test:report

  Allure Reports:

  # Generate Allure report
  npm run allure:generate

  # Open existing Allure report
  npm run allure:open

  # Generate and serve Allure report
  npm run allure:serve

  💡 Pro Tips:

  Chain Multiple Commands:

  # Run tests and then generate report
  npm run test && npm run allure:generate && npm run allure:open

  Run Tests and Open Report:

  npm run test:chrome && npm run test:report

  Pass Additional Arguments:

  # Run specific test with grep
  npm run test -- --grep "login"

  # Run with specific number of workers
  npm run test -- --workers=2

  Run in Different Environments:

  # Set environment variable and run
  BASE_URL=https://example.com npm run test

```

**Total Tests:** 43 (29 UI + 14 API)
**All Automated:** Yes
