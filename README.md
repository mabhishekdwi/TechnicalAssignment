# Advanced Playwright Test Framework

A comprehensive, production-ready Playwright testing framework with Allure reporting, API testing, database utilities, and multi-browser support.

## Features

- **Allure Reporting** - Detailed test reports with step-by-step execution, screenshots, and attachments
- **Login Fixtures** - Reusable authentication fixtures for faster test execution
- **Excel Utility** - Read and write test data from Excel files
- **JSON Utility** - Dynamic JSON data management with filtering and merging
- **Database Utility** - Support for MySQL, PostgreSQL, and MongoDB
- **API Utility** - Complete REST API testing with all HTTP methods
- **Environment Management** - Dynamic configuration for multiple environments (dev, qa, staging, prod)
- **Multi-Browser Support** - Run tests on Chrome, Firefox, Safari, Edge, and mobile browsers
- **Parallel Execution** - Fast test execution with configurable workers
- **GitHub Actions CI/CD** - Automated testing pipeline with Allure report deployment
- **TypeScript** - Full TypeScript support with type safety

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-automation-framework
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Project Structure

```
playwright-automation-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI/CD workflow
├── config/
│   ├── apiEndpoints.ts         # API endpoints configuration
│   └── environment.ts          # Environment management
├── data/
│   ├── test-data.json          # Sample JSON test data
│   └── test-data.xlsx          # Sample Excel test data
├── fixtures/
│   └── authFixture.ts          # Login/authentication fixtures
├── pages/
│   └── BasePage.ts             # Base page object model
├── tests/
│   ├── example.spec.ts         # Example tests with all features
│   └── test.spec.ts            # Your test files
├── utils/
│   ├── ApiUtil.ts              # API testing utility
│   ├── DatabaseUtil.ts         # Database utility
│   ├── ExcelUtil.ts            # Excel read/write utility
│   ├── JsonUtil.ts             # JSON utility
│   └── helpers.ts              # Helper functions
├── .env.example                # Environment variables template
├── playwright.config.ts        # Playwright configuration
└── package.json                # Dependencies and scripts
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests in parallel
```bash
npm run test:parallel
```

### Run tests on specific browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:edge
```

### Run tests on all browsers
```bash
npm run test:allbrowsers
```

## Allure Reports

### Generate Allure report
```bash
npm run allure:generate
```

### Open Allure report
```bash
npm run allure:open
```

### Serve Allure report
```bash
npm run allure:serve
```

## Using the Framework

### 1. Excel Utility

```typescript
import { ExcelUtil } from './utils/ExcelUtil.js';

const excelUtil = new ExcelUtil();

// Load Excel file
excelUtil.loadFile('test-data.xlsx');

// Get all data from first sheet
const data = excelUtil.getSheetData();

// Get specific test data by ID
const testData = excelUtil.getTestData('TC001');

// Filter data by column
const filteredData = excelUtil.filterByColumn('Status', 'Active');

// Write data to Excel
excelUtil.writeToExcel(data, 'output.xlsx', 'Results');
```

### 2. JSON Utility

```typescript
import { JsonUtil } from './utils/JsonUtil.js';

const jsonUtil = new JsonUtil();

// Load JSON file
const data = jsonUtil.loadJson('test-data.json');

// Get nested value using dot notation
const value = jsonUtil.getValue(data, 'user.credentials.username');

// Get test data by ID
const testData = jsonUtil.getTestDataById('test-data.json', 'TC001');

// Filter test data
const filtered = jsonUtil.filterTestData('test-data.json',
  (item) => item.status === 'active'
);

// Write JSON file
jsonUtil.writeJson(data, 'output.json');
```

### 3. API Utility

```typescript
import { ApiUtil } from './utils/ApiUtil.js';
import { AUTOMATION_EXERCISE_ENDPOINTS } from './config/apiEndpoints.js';

const apiUtil = new ApiUtil();

// Initialize API client
await apiUtil.init({
  baseURL: 'https://api.example.com',
  headers: { 'Authorization': 'Bearer token' }
});

// GET request
const response = await apiUtil.get('/users');
const data = await apiUtil.getJson(response);

// POST request
const response = await apiUtil.post('/users', {
  data: { name: 'John', email: 'john@example.com' }
});

// PUT request
await apiUtil.put('/users/123', {
  data: { name: 'John Updated' }
});

// PATCH request
await apiUtil.patch('/users/123', {
  data: { email: 'newemail@example.com' }
});

// DELETE request
await apiUtil.delete('/users/123');

// Verify response
expect(apiUtil.verifyStatus(response, 200)).toBeTruthy();
```

### 4. Database Utility

```typescript
import { DatabaseUtil } from './utils/DatabaseUtil.js';

const dbUtil = new DatabaseUtil();

// MySQL
dbUtil.configure({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'testdb'
});

await dbUtil.connect();

// Execute query
const users = await dbUtil.executeQuery('SELECT * FROM users WHERE id = ?', [1]);

// Get single record
const user = await dbUtil.getOne('SELECT * FROM users WHERE email = ?', ['test@example.com']);

await dbUtil.disconnect();

// MongoDB
dbUtil.configure({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'testdb',
  uri: 'mongodb://localhost:27017'
});

await dbUtil.connect();

// Find documents
const docs = await dbUtil.findDocuments('users', { status: 'active' });

// Insert document
await dbUtil.insertDocument('users', { name: 'John', email: 'john@example.com' });

await dbUtil.disconnect();
```

### 5. Login Fixture

```typescript
import { test, expect } from '../fixtures/authFixture.js';

// Test with authenticated page
test('Dashboard test', async ({ authenticatedPage }) => {
  // User is already logged in
  await authenticatedPage.goto('/dashboard');
  // Continue with test
});

// Login with custom credentials
test('Custom login', async ({ loginAsUser, page }) => {
  await loginAsUser('custom@example.com', 'password');
  await page.goto('/dashboard');
});
```

### 6. Environment Configuration

```typescript
import { env } from './config/environment.js';

// Get current environment
const currentEnv = env.getEnvironment();

// Get environment URLs
const baseURL = env.getBaseURL();
const apiURL = env.getApiBaseURL();

// Get credentials
const credentials = env.getCredentials();

// Get database config
const dbConfig = env.getDbConfig();

// Switch environment
env.switchEnvironment('qa');
```

### 7. Allure Steps and Reporting

```typescript
import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

test('Test with Allure steps', async ({ page }) => {
  allure.epic('User Management');
  allure.feature('Login');
  allure.story('User Login');
  allure.severity('critical');

  await allure.step('Navigate to login page', async () => {
    await page.goto('/login');
    allure.parameter('URL', page.url());
  });

  await allure.step('Enter credentials', async () => {
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    allure.attachment('Credentials', 'test@example.com', 'text/plain');
  });

  await allure.step('Click login button', async () => {
    await page.click('button[type="submit"]');
    const screenshot = await page.screenshot();
    allure.attachment('After Login', screenshot, 'image/png');
  });
});
```

## CI/CD with GitHub Actions

The framework includes a complete GitHub Actions workflow that:
- Runs tests on multiple browsers (Chrome, Firefox, Safari)
- Executes tests in parallel with sharding
- Generates Allure reports
- Deploys reports to GitHub Pages
- Supports manual workflow dispatch with environment selection

To use:
1. Push your code to GitHub
2. GitHub Actions will automatically run tests
3. View Allure reports in the Actions artifacts or GitHub Pages

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
ENV=dev
BASE_URL=https://automationexercise.com/
DEV_USERNAME=testuser
DEV_PASSWORD=testpass
DEV_EMAIL=test@example.com
```

## Best Practices

1. **Use Page Object Model** - Keep locators and actions in page objects
2. **Use Allure Steps** - Make tests readable with descriptive steps
3. **Data-Driven Testing** - Use Excel/JSON for test data
4. **Environment Separation** - Use different configs for different environments
5. **Parallel Execution** - Run tests in parallel for faster execution
6. **Reusable Fixtures** - Use authentication fixtures to avoid repeated logins
7. **API Testing** - Test APIs before UI for faster feedback

## Troubleshooting

### Allure report not generating
```bash
npm install -g allure-commandline
```

### Tests failing in CI
- Check environment variables are set in GitHub Secrets
- Ensure browsers are installed with `--with-deps` flag

### Database connection issues
- Verify credentials in .env file
- Check database is accessible from test environment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT