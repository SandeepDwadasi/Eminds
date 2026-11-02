import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export type SortOption = 'featured' | 'price-low-to-high' | 'price-high-to-low' | 'newest';

const SORT_PARAMS: Record<SortOption, string> = {
  featured: 'relevanceblender',
  'price-low-to-high': 'price-asc-rank',
  'price-high-to-low': 'price-desc-rank',
  newest: 'date-desc-rank',
};

export class SearchResultsPage extends BasePage {
  readonly results: Locator;
  readonly organicResults: Locator;
  readonly resultInfoBar: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.results = page.locator('div[data-component-type="s-search-result"]');
    this.organicResults = this.results.filter({
      hasNot: page.getByText('Sponsored', { exact: true }),
    });
    this.resultInfoBar = page.locator('[data-component-type="s-result-info-bar"]');
    this.noResultsMessage = page.getByText(/no results for/i).first();
  }

  async waitForResults(): Promise<void> {
    await this.results.first().waitFor({ state: 'visible' });
  }

  async resultCount(): Promise<number> {
    return this.results.count();
  }

  /** Cards contain several h2s (brand line, badges); the product title is the one inside a link. */
  private titleOf(result: Locator): Locator {
    return result.locator('[data-cy="title-recipe"] a h2, a h2').first();
  }

  async resultTitles(limit = 10): Promise<string[]> {
    const titles: string[] = [];
    const count = Math.min(await this.results.count(), limit);
    for (let i = 0; i < count; i++) {
      const title = this.titleOf(this.results.nth(i));
      if (await title.count()) titles.push((await title.innerText()).trim());
    }
    return titles;
  }

  async resultPrices(limit = 10): Promise<number[]> {
    const prices: number[] = [];
    const count = Math.min(await this.results.count(), limit);
    for (let i = 0; i < count; i++) {
      const price = this.results.nth(i).locator('.a-price:not(.a-text-price) .a-offscreen').first();
      if (await price.count()) {
        const value = Number.parseFloat(
          ((await price.textContent()) ?? '').replace(/[^0-9.]/g, ''),
        );
        if (!Number.isNaN(value)) prices.push(value);
      }
    }
    return prices;
  }

  /** Sorting via the URL is far more stable than Amazon's custom dropdown widget. */
  async sortBy(option: SortOption): Promise<void> {
    const url = new URL(this.page.url());
    url.searchParams.set('s', SORT_PARAMS[option]);
    logger.info(`Sorting results by ${option}`);
    await this.page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
    await this.dismissInterstitials();
    await this.waitForResults();
  }

  /** Opens the nth (1-based) non-sponsored result and returns its title. */
  async openResult(position = 1): Promise<string> {
    const result = this.organicResults.nth(position - 1);
    const heading = this.titleOf(result);
    const title = (await heading.innerText()).trim();
    logger.info(`Opening result #${position}: ${title}`);
    const link = heading.locator('xpath=ancestor::a[1]');
    // Product links occasionally open in a new tab; force same-tab navigation.
    await link.evaluate((a) => a.removeAttribute('target'));
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissInterstitials();
    return title;
  }
}
