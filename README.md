# Playwright Automation Framework

> **Enterprise-grade test automation** for Web UI and REST API testing built on **Playwright + TypeScript**.
>
> Covers two targets:
> - **Web UI** — [SauceDemo](https://www.saucedemo.com/) (e-commerce demo app)
> - **API** — [Restful-Booker](https://restful-booker.herokuapp.com/) (hotel booking REST API)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Framework Architecture](#2-framework-architecture)
3. [Prerequisites & Setup](#3-prerequisites--setup)
4. [Running Tests Locally](#4-running-tests-locally)
5. [Test Coverage Summary](#5-test-coverage-summary)
6. [CI/CD Pipeline](#6-cicd-pipeline)
7. [Reporting](#7-reporting)
8. [Team Onboarding Guide](#8-team-onboarding-guide)
9. [Design Patterns](#9-design-patterns)
10. [API Test Strategy](#10-api-test-strategy)
11. [Contributing](#11-contributing)

---

## 1. Project Overview

This framework was built to replace a 1-week manual regression cycle run by 10 QA engineers, automating the critical regression path across UI and API layers.

| Dimension        | Detail                                             |
|------------------|----------------------------------------------------|
| **Framework**    | Playwright `^1.40` + TypeScript `^5.3`             |
| **Pattern**      | Page Object Model (POM) + Fixture-based setup      |
| **Reporting**    | Allure + Playwright HTML + JSON                    |
| **CI/CD**        | GitHub Actions (path-triggered, suite-selectable)  |
| **Parallelism**  | 4 workers locally / 2 workers in CI               |
| **Retries**      | 1 locally / 2 in CI                               |

---

## 2. Framework Architecture

```
playwright-automation-framework/
│
├── .github/
│   └── workflows/
│       ├── web-ui-tests.yml        # CI for SauceDemo UI tests
│       └── api-tests.yml           # CI for Restful-Booker API tests
│
├── config/
│   ├── environment.ts              # Multi-env manager (dev/qa/staging/prod)
│   └── apiEndpoints.ts             # Centralised API endpoint constants
│
├── fixtures/
│   └── authFixture.ts              # Reusable authenticated-page fixtures
│
├── pages/
│   ├── BasePage.ts                 # Shared Playwright wrappers (all pages extend this)
│   └── saucedemo/                  # SauceDemo page objects
│       ├── LoginPage.ts
│       ├── InventoryPage.ts
│       ├── CartPage.ts
│       └── CheckoutPage.ts
│
├── tests/
│   ├── saucedemo/                  # Web UI test specs
│   │   ├── login.spec.ts           # Login module (4 tests)
│   │   ├── products.spec.ts        # Product catalog (5 tests)
│   │   ├── checkout.spec.ts        # Cart & checkout (5 tests)
│   │   └── e2e.spec.ts             # Full purchase E2E (1 test)
│   └── api/                        # REST API test specs
│       ├── auth.spec.ts            # POST /auth (3 tests)
│       ├── booking-get.spec.ts     # GET /booking (4 tests)
│       ├── booking-create-update.spec.ts  # POST & PUT /booking (5 tests)
│       ├── booking-delete.spec.ts  # DELETE /booking/:id (3 tests)
│       └── booking-e2e.spec.ts     # Full lifecycle E2E (1 test)
│
├── types/
│   └── index.ts                    # Shared TypeScript interfaces
│
├── utils/
│   ├── ApiUtil.ts                  # HTTP client wrapper (GET/POST/PUT/PATCH/DELETE)
│   ├── DatabaseUtil.ts             # MySQL / PostgreSQL helpers
│   ├── ExcelUtil.ts                # Excel test-data reader
│   ├── CsvUtil.ts                  # CSV test-data reader
│   ├── JsonUtil.ts                 # JSON test-data loader
│   └── helpers.ts                  # Misc shared helpers
│
├── playwright.config.ts            # Default config (automationexercise.com)
├── playwright.config.saucedemo.ts  # Web UI config (saucedemo.com)
└── playwright.config.api.ts        # API config (restful-booker)
```

### Layer Diagram

```
┌─────────────────────────────────┐
│          Test Specs             │  ← What to test (describe/test blocks)
├─────────────────────────────────┤
│        Page Objects             │  ← How to interact with the UI
├─────────────────────────────────┤
│   BasePage / ApiUtil / Utils    │  ← Shared infrastructure & helpers
├─────────────────────────────────┤
│  Playwright / Node.js / TypeScript │  ← Runtime
└─────────────────────────────────┘
```

---

## 3. Prerequisites & Setup

### System Requirements

| Tool          | Version  |
|---------------|----------|
| Node.js       | ≥ 20 LTS |
| npm           | ≥ 10     |
| Git           | any      |

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd playwright-automation-framework

# 2. Install Node dependencies
npm ci

# 3. Install Playwright browsers
npx playwright install --with-deps

# 4. (Optional) Copy and configure environment variables
cp .env.example .env
```

### Environment Variables

All variables are optional; sensible defaults are provided.

| Variable   | Default                           | Purpose                       |
|------------|-----------------------------------|-------------------------------|
| `BASE_URL` | `https://automationexercise.com/` | Legacy test target            |
| `ENV`      | `dev`                             | Environment selector          |
| `CI`       | *(set by GitHub Actions)*         | Headless mode + retry control |

---

## 4. Running Tests Locally

### Web UI — SauceDemo

```bash
# Run all SauceDemo tests
npm run sd:test

# Run in browser window (headed)
npm run sd:test:headed

# Filter by suite tag
npm run sd:test:smoke       # @smoke tagged tests
npm run sd:test:regression  # @regression tagged tests
npm run sd:test:e2e         # End-to-End test only

# Filter by spec file
npm run sd:test:login       # Login module
npm run sd:test:products    # Product catalog
npm run sd:test:checkout    # Cart & checkout

# Open HTML report
npm run sd:report
```

### API — Restful-Booker

```bash
# Run all API tests
npm run api:test

# Filter by suite tag
npm run api:test:smoke      # @smoke tagged tests
npm run api:test:e2e        # E2E lifecycle test only

# Filter by spec file
npm run api:test:auth       # Authentication tests
npm run api:test:get        # GET booking tests
npm run api:test:crud       # Create/Update booking tests
npm run api:test:delete     # Delete booking tests

# Open HTML report
npm run api:report
```

### Allure Report

```bash
npm run allure:generate   # Generate report from allure-results/
npm run allure:open       # Open the generated report
npm run allure:serve      # Serve directly from results (no generate step)
```

### Playwright UI Mode (interactive debugging)

```bash
npm run test:ui           # Opens the Playwright UI explorer
```

---

## 5. Test Coverage Summary

### Part 1 — Web UI (SauceDemo)

| Module       | Test ID  | Type     | Tags               | Description                                        |
|--------------|----------|----------|--------------------|----------------------------------------------------|
| **Login**    | TC-L-001 | Positive | `@smoke @critical` | Successful login with valid credentials            |
| **Login**    | TC-L-002 | Negative | `@smoke`           | Login failure — wrong password                     |
| **Login**    | TC-L-003 | Negative |                    | Locked-out user is rejected                        |
| **Login**    | TC-L-004 | Negative |                    | Empty fields show validation error                 |
| **Products** | TC-P-001 | Positive | `@smoke @critical` | Add product to cart — badge increments             |
| **Products** | TC-P-002 | Positive |                    | Product listing renders ≥ 6 items                  |
| **Products** | TC-P-003 | Positive |                    | Sort products by price low-to-high                 |
| **Products** | TC-P-004 | Negative |                    | Cart is empty when no items added                  |
| **Products** | TC-P-005 | Positive |                    | Add specific product by name                       |
| **Checkout** | TC-C-001 | Positive | `@smoke @critical` | Complete checkout: add → cart → ship → confirm     |
| **Checkout** | TC-C-002 | Negative | `@smoke`           | Form validation: all fields empty                  |
| **Checkout** | TC-C-003 | Negative |                    | Form validation: missing last name                 |
| **Checkout** | TC-C-004 | Negative |                    | Form validation: missing postal code               |
| **Checkout** | TC-C-005 | Positive |                    | Continue Shopping returns to inventory             |
| **E2E**      | E2E-001  | E2E      | `@e2e @smoke @critical` | Login → Browse → Add → Cart → Checkout → Confirm |

**Total: 15 UI tests** (minimum 6 required ✓, 1 E2E required ✓)

---

### Part 2 — API (Restful-Booker)

| Endpoint              | Test ID      | Type     | Tags               | Description                                                 |
|-----------------------|--------------|----------|--------------------|-------------------------------------------------------------|
| `POST /auth`          | TC-AUTH-001  | Positive | `@smoke @critical` | Valid credentials → token returned                          |
| `POST /auth`          | TC-AUTH-002  | Negative | `@smoke`           | Invalid password → "Bad credentials"                        |
| `POST /auth`          | TC-AUTH-003  | Negative |                    | Empty credentials → "Bad credentials"                       |
| `GET /booking`        | TC-GET-001   | Positive | `@smoke @critical` | All bookings → non-empty array with bookingid               |
| `GET /booking/:id`    | TC-GET-002   | Positive | `@smoke @critical` | Valid ID → full booking with schema validation              |
| `GET /booking/:id`    | TC-GET-003   | Negative | `@smoke`           | Non-existent ID → 404                                       |
| `GET /booking`        | TC-GET-004   | Positive |                    | Filter by checkin date                                      |
| `POST /booking`       | TC-CU-001    | Positive | `@smoke @critical` | Create with valid payload → bookingid returned              |
| `POST /booking`       | TC-CU-002    | Negative |                    | Incomplete payload → 500                                    |
| `PUT /booking/:id`    | TC-CU-003    | Positive | `@smoke`           | Full update with auth token → updated fields verified       |
| `PUT /booking/:id`    | TC-CU-004    | Negative |                    | Update without auth → 403                                   |
| `PATCH /booking/:id`  | TC-CU-005    | Positive |                    | Partial update → only specified fields changed              |
| `DELETE /booking/:id` | TC-DEL-001   | Positive | `@smoke @critical` | Delete with auth → 201, confirmed by 404 on GET             |
| `DELETE /booking/:id` | TC-DEL-002   | Negative | `@smoke`           | Delete without auth → 403                                   |
| `DELETE /booking/:id` | TC-DEL-003   | Negative |                    | Delete non-existent ID → 405                                |
| **E2E Lifecycle**     | E2E-API-001  | E2E      | `@e2e @critical`   | Auth → Create → Verify → PUT → PATCH → Delete → Verify 404  |

**Total: 16 API tests** (minimum 8 required ✓, 1 E2E required ✓)

---

## 6. CI/CD Pipeline

### Workflows

| Workflow       | File                                    | Triggers                                                   |
|----------------|-----------------------------------------|------------------------------------------------------------|
| Web UI Tests   | `.github/workflows/web-ui-tests.yml`    | Push/PR to main/master/develop; path-filtered; manual      |
| API Tests      | `.github/workflows/api-tests.yml`       | Push/PR to main/master/develop; path-filtered; manual      |

### Path-based Triggering

Workflows only run when relevant files change — no wasted CI minutes:

- **Web UI**: `tests/saucedemo/**`, `pages/saucedemo/**`, `playwright.config.saucedemo.ts`
- **API**: `tests/api/**`, `playwright.config.api.ts`

### Manual Dispatch with Suite Selection

Go to **Actions → [Workflow] → Run workflow** and pick from:

```
all | smoke | regression | e2e | login | products | checkout
```

### Pipeline Steps

```
Checkout → Node 20 setup → npm ci → Install Playwright browsers
  → Run tests (suite-filtered) → Upload reports & artifacts
```

### Artifacts per Run

| Artifact                      | Retention |
|-------------------------------|-----------|
| Playwright HTML Report        | 30 days   |
| Allure Results                | 30 days   |
| JSON Results                  | 30 days   |
| Screenshots / Videos (failure)| 7 days    |

---

## 7. Reporting

Three report formats are generated automatically on every run:

1. **Playwright HTML Report** — interactive, filterable, includes traces, screenshots, videos
   - Web UI: `reports/saucedemo-report/`
   - API: `reports/api-report/`

2. **Allure Report** — rich visual report with suite → feature → story → step hierarchy
   - Results: `allure-results/`

3. **JSON** — machine-readable output for dashboards or Slack notifications
   - Web UI: `reports/saucedemo-results.json`
   - API: `reports/api-results.json`

**On failure**: trace files, screenshots, and videos are automatically retained and uploaded as CI artifacts.

---

## 8. Team Onboarding Guide

### New SDET Checklist

```
□ Install Node.js 20 LTS (https://nodejs.org/)
□ Clone the repository and run: npm ci
□ Run: npx playwright install --with-deps
□ Run: npm run sd:test:smoke         ← confirm UI environment works
□ Run: npm run api:test:smoke        ← confirm API environment works
□ Open the HTML reports to review results
□ Read this README fully
□ Familiarise yourself with the tag convention below
```

### Writing Your First UI Test

```typescript
// tests/saucedemo/my-feature.spec.ts
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../../pages/saucedemo/LoginPage.js';
import { InventoryPage } from '../../pages/saucedemo/InventoryPage.js';

test.describe('My Feature', { tag: ['@regression'] }, () => {

  test('TC-MF-001: My positive test', { tag: ['@positive', '@smoke'] }, async ({ page }) => {
    allure.epic('SauceDemo');
    allure.feature('My Feature');
    allure.story('Happy Path');
    allure.severity('normal');

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await allure.step('Navigate and login', async () => {
      await loginPage.navigate();
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL(/inventory/);
    });

    await allure.step('Assert my feature works', async () => {
      expect(await inventoryPage.getProductCount()).toBeGreaterThan(0);
    });
  });

});
```

### Writing Your First API Test

```typescript
// tests/api/my-endpoint.spec.ts
import { test, expect, request } from '@playwright/test';
import { allure } from 'allure-playwright';

const BASE_URL = 'https://restful-booker.herokuapp.com';

test('TC-MY-001: My API test', { tag: ['@positive', '@smoke'] }, async () => {
  allure.epic('Restful-Booker API');
  allure.feature('My Endpoint');

  const ctx = await request.newContext({ baseURL: BASE_URL });

  const response = await ctx.get('/booking', {
    headers: { 'Accept': 'application/json' }
  });

  await allure.step('Verify 200 status and array response', async () => {
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

  await ctx.dispose(); // Always dispose to avoid resource leaks
});
```

### Adding a New Page Object

1. Create `pages/saucedemo/MyPage.ts` extending `BasePage`
2. Declare all locators as `private readonly Locator` in the constructor — prefer `data-test` attributes
3. Write one method per user action — keep them focused
4. Add JSDoc for non-obvious methods

```typescript
import { Page, Locator } from '@playwright/test';
import BasePage from '../BasePage.js';

export class MyPage extends BasePage {
  private readonly myButton: Locator;

  constructor(page: Page) {
    super(page);
    this.myButton = page.locator('[data-test="my-button"]');
  }

  async clickMyButton(): Promise<void> {
    await this.myButton.click();
    await this.page.waitForLoadState('load');
  }
}
```

### Tag Convention

| Tag               | Meaning                                               |
|-------------------|-------------------------------------------------------|
| `@smoke`          | Critical subset — must pass on every merge to main    |
| `@regression`     | Full suite — run before every release                 |
| `@critical`       | High business-impact tests                            |
| `@e2e`            | End-to-end flow tests                                 |
| `@positive`       | Happy-path / valid-input scenarios                    |
| `@negative`       | Error, validation, and boundary-condition scenarios   |
| `@login`          | Login module (UI)                                     |
| `@products`       | Product catalog module (UI)                           |
| `@checkout`       | Cart and checkout module (UI)                         |
| `@auth`           | Authentication endpoint (API)                         |
| `@booking-get`    | GET booking endpoints (API)                           |
| `@booking-crud`   | Create/Update booking endpoints (API)                 |
| `@booking-delete` | Delete booking endpoint (API)                         |

---

## 9. Design Patterns

### Page Object Model (POM)

Each page of the application has a corresponding class that:
- Encapsulates all locators (declared as `private readonly Locator`)
- Exposes only meaningful **action methods** — no raw Playwright selectors in test files
- Extends `BasePage` for shared utilities (`goto`, `click`, `fill`, `waitForElement`, etc.)

### Fixture Pattern

Custom Playwright fixtures in `fixtures/authFixture.ts` provide:
- `authenticatedPage` — a pre-logged-in page ready to use
- `loginAsUser(username, password)` — per-test dynamic login
- `testWithStorageState` — session state reuse for fast authentication

### Tag-Based Suite Organisation

```bash
# Any combination works
npx playwright test --config=playwright.config.saucedemo.ts --grep "@smoke"
npx playwright test --config=playwright.config.saucedemo.ts --grep "@negative"
npx playwright test --config=playwright.config.api.ts --grep "@e2e"
```

### Utility Separation

| Utility        | Responsibility                           |
|----------------|------------------------------------------|
| `ApiUtil`      | HTTP client (wraps `APIRequestContext`)  |
| `DatabaseUtil` | SQL query execution (MySQL/PostgreSQL)   |
| `ExcelUtil`    | Excel test-data read/write               |
| `CsvUtil`      | CSV test-data handling                   |
| `JsonUtil`     | JSON fixture loading                     |

---

## 10. API Test Strategy

### Approach

All API tests use **Playwright's native `request` context** — no additional HTTP library required. Each spec file is independently executable and disposes its own `APIRequestContext` after each test to prevent state leakage.

### Validation Layers

Every API test validates:

| Layer            | What is checked                                          |
|------------------|----------------------------------------------------------|
| Status code      | Exact HTTP status (200, 201, 403, 404, 500)              |
| Response schema  | Required fields exist with correct types                 |
| Data integrity   | Response values match what was sent in the request       |
| Security         | Unauthenticated/unauthorised requests are rejected (403) |

### Authentication Strategy

The Restful-Booker API uses **cookie-based token authentication**:

```http
Cookie: token=<token-value>
```

The token is obtained via `POST /auth` and injected into the `Cookie` header for all mutating operations (PUT, PATCH, DELETE). In the E2E test it is retrieved once and reused across all steps to mirror real-world usage.

### E2E Lifecycle Test

`tests/api/booking-e2e.spec.ts` chains all operations in a single test, validating end-to-end data integrity:

```
POST /auth          → obtain token
POST /booking       → create booking, capture bookingid
GET  /booking/:id   → verify created data matches payload
PUT  /booking/:id   → full update, verify all fields changed
GET  /booking/:id   → verify persistence of PUT
PATCH /booking/:id  → partial update, verify only target fields changed
DELETE /booking/:id → delete, expect 201
GET  /booking/:id   → confirm 404 (booking is gone)
```

---

## 11. Contributing

1. **Branch naming**: `feature/TC-XXX-description` or `fix/TC-XXX-description`
2. **Commit messages**: `feat: TC-L-005 add remember-me login test`
3. **Before raising a PR**: both `npm run sd:test:smoke` and `npm run api:test:smoke` must pass
4. **New test checklist**:
   - [ ] Follows POM pattern — no raw Playwright selectors in spec files
   - [ ] Allure annotations on every test (`epic`, `feature`, `story`, `severity`, `step`)
   - [ ] At least one `@smoke` tag on critical-path tests
   - [ ] Both positive and negative scenarios covered per endpoint/module
   - [ ] API tests dispose their context in every test
   - [ ] No hard-coded test data that will break on environment change

---

*Built with Playwright + TypeScript. Maintained by the SDET team.*
