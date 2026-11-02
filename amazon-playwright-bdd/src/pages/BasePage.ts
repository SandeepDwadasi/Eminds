import { expect, Locator, Page } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  protected readonly page: Page;

  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly cartCount: Locator;
  readonly cartLink: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#twotabsearchtextbox');
    this.searchButton = page.locator('#nav-search-submit-button');
    this.cartCount = page.locator('#nav-cart-count');
    this.cartLink = page.locator('#nav-cart');
    this.logo = page.locator('#nav-logo-sprites');
  }

  async goto(path = '/'): Promise<void> {
    logger.debug(`Navigating to ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.dismissInterstitials();
  }

  /**
   * Amazon sometimes shows a "Continue shopping" splash or a CAPTCHA to automated
   * browsers. The splash is clicked through; a CAPTCHA fails fast with a clear message.
   */
  async dismissInterstitials(): Promise<void> {
    const continueButton = this.page.getByRole('button', { name: /continue shopping/i });
    if (await continueButton.isVisible().catch(() => false)) {
      logger.info('Dismissing "Continue shopping" interstitial');
      await continueButton.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
    const captcha = this.page.locator('form[action*="validateCaptcha"]');
    if (await captcha.isVisible().catch(() => false)) {
      throw new Error('Amazon served a CAPTCHA page; re-run headed (HEADLESS=false) or later.');
    }
  }

  async search(term: string): Promise<void> {
    logger.info(`Searching for "${term}"`);
    await this.searchBox.fill(term);
    await this.searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissInterstitials();
  }

  /**
   * Amazon hides "Add to Cart" for items that can't ship to the detected location
   * (e.g. when running from outside the US), so cart tests pin a US ZIP code.
   */
  async setDeliveryZip(zip: string): Promise<void> {
    logger.info(`Setting delivery ZIP code to ${zip}`);
    const zipInput = this.page.locator('#GLUXZipUpdateInput');
    // The location popover is wired up by late-loading JS; retry if the first click is ignored.
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.page.waitForLoadState('load');
      await this.page.locator('#nav-global-location-popover-link').click();
      const opened = await zipInput
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);
      if (opened) break;
      logger.debug(`Location popover did not open (attempt ${attempt}); reloading`);
      await this.page.reload({ waitUntil: 'domcontentloaded' });
    }
    await zipInput.fill(zip);
    const saved = this.page.waitForResponse((r) => r.url().includes('address-change'));
    await this.page.locator('#GLUXZipUpdate').click();
    await saved;
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await expect(this.page.locator('#glow-ingress-line2')).toContainText(zip, { timeout: 10000 });
  }

  async getCartCount(): Promise<number> {
    const text = (await this.cartCount.textContent())?.trim() ?? '0';
    return Number.parseInt(text, 10) || 0;
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  url(): string {
    return this.page.url();
  }
}
