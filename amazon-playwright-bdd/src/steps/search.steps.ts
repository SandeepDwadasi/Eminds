import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { SortOption } from '../pages/SearchResultsPage';
import { testData } from '../utils/testData';

When('I search for {string}', async function (this: CustomWorld, term: string) {
  this.data.searchTerm = term;
  await this.homePage.search(term);
});

When('I search for a random nonsense term', async function (this: CustomWorld) {
  const term = testData.gibberishSearchTerm();
  this.data.searchTerm = term;
  await this.homePage.search(term);
});

When('I sort the results by {string}', async function (this: CustomWorld, option: string) {
  await this.searchResultsPage.sortBy(option as SortOption);
});

When('I open search result number {int}', async function (this: CustomWorld, position: number) {
  await this.searchResultsPage.waitForResults();
  this.data.productTitle = await this.searchResultsPage.openResult(position);
});

Then('I should see search results', async function (this: CustomWorld) {
  await this.searchResultsPage.waitForResults();
  expect(await this.searchResultsPage.resultCount()).toBeGreaterThan(0);
});

Then(
  'at least {int} result titles should contain {string}',
  async function (this: CustomWorld, minimum: number, keyword: string) {
    const titles = await this.searchResultsPage.resultTitles(10);
    const matches = titles.filter((t) => t.toLowerCase().includes(keyword.toLowerCase()));
    expect(matches.length, `Titles were:\n${titles.join('\n')}`).toBeGreaterThanOrEqual(minimum);
  },
);

Then('I should see a no results message', async function (this: CustomWorld) {
  await expect(this.searchResultsPage.noResultsMessage).toBeVisible();
});

Then('the listed prices should be in ascending order', async function (this: CustomWorld) {
  const prices = await this.searchResultsPage.resultPrices(10);
  expect(prices.length, 'No prices found on the results page').toBeGreaterThan(1);
  const sorted = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sorted);
});
