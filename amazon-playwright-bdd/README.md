# Amazon Playwright BDD

UI automation for amazon.com using Playwright, Cucumber (Gherkin) and TypeScript.

## Setup

```bash
npm install
npm run install:browsers
cp .env.example .env
```

## Run

| Command                   | What it does                         |
| ------------------------- | ------------------------------------ |
| `npm test`                | All scenarios                        |
| `npm run test:smoke`      | `@smoke` scenarios                   |
| `npm run test:regression` | `@regression` scenarios              |
| `npm run test:headed`     | Run with a visible browser           |
| `npm run report:allure`   | Build Allure report from last run    |
| `npm run typecheck`       | TypeScript check                     |
| `npm run lint`            | ESLint                               |

Reports go to `reports/` (Cucumber HTML/JSON, screenshots and traces of failures) and `allure-results/`.

## Structure

```
features/            Gherkin feature files
src/pages/           Page objects (BasePage, HomePage, SearchResultsPage, ProductPage, CartPage)
src/steps/           Step definitions
src/support/         World, hooks, browser launch, config (.env)
src/utils/           Logger, test data helpers
test-data/           JSON test data
cucumber.js          Cucumber config and profiles
```

## Notes

- Outside the US, amazon.com hides "Add to Cart", so cart scenarios set a US delivery ZIP first (`my delivery ZIP code is "10001"`).
- Amazon may occasionally serve a CAPTCHA to automated browsers; the run fails with a clear message. Re-run, or use `HEADLESS=false`.
