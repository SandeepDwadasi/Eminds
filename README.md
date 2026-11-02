# EnterpriseMinds Assessment Submission

This repository is submitted as part of the **EnterpriseMinds assessment**.

**Candidate:** Sandeep Dwadasi

## Contents

| Folder | Description |
| ------ | ----------- |
| [`amazon-playwright-bdd/`](amazon-playwright-bdd/) | BDD UI automation framework for amazon.com, built with Playwright, Cucumber (Gherkin) and TypeScript |

## Framework highlights

- **BDD with Gherkin:** readable feature files for home page, search, product details and cart, tagged `@smoke` and `@regression`
- **Page Object Model:** a `BasePage` with page classes for Home, Search Results, Product and Cart
- **TypeScript** throughout, strict mode, type-checked with `tsc`
- **Cucumber World and hooks:** a fresh browser context for each scenario, plus a screenshot and Playwright trace when a scenario fails
- **Reporting:** Cucumber HTML/JSON reports and Allure results
- **Configuration** through `.env` (browser, headless mode, timeouts, retries, parallel runs)
- **Logging** with Winston, test data in JSON and Faker
- **Code quality** checks with ESLint and Prettier

## Quick start

```bash
cd amazon-playwright-bdd
npm install
npx playwright install chromium
cp .env.example .env
npm run test:smoke        # smoke suite
npm test                  # full suite
npm run test:headed       # run with a visible browser
```

The test reports are written to `amazon-playwright-bdd/reports/`. See the [framework README](amazon-playwright-bdd/README.md) for full details.

## Notes

- The tests run against the live amazon.com site. Amazon may sometimes show a CAPTCHA to automated browsers. If it does, re-run the tests or run them headed.
- Cart scenarios set a US delivery ZIP code first. From outside the US, amazon.com hides "Add to Cart" for items it can't ship to that address.
