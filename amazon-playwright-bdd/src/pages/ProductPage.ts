import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly quantityDropdown: Locator;
  readonly addedToCartConfirmation: Locator;
  readonly noThanksCoverage: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('span#productTitle');
    this.price = page
      .locator(
        '#corePrice_feature_div .a-offscreen, #corePriceDisplay_desktop_feature_div .a-offscreen, #apex_desktop .a-offscreen',
      )
      .first();
    this.addToCartButton = page.locator('#add-to-cart-button');
    this.quantityDropdown = page.locator('#quantity');
    this.addedToCartConfirmation = page
      .locator(
        '#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation, #attachDisplayAddBaseAlert',
      )
      .or(page.getByText(/added to (cart|basket)/i))
      .first();
    // Protection-plan upsell that can appear after clicking "Add to Cart".
    this.noThanksCoverage = page
      .locator('#attachSiNoCoverage, button:has-text("No thanks")')
      .first();
  }

  async getTitle(): Promise<string> {
    return (await this.productTitle.innerText()).trim();
  }

  async getPrice(): Promise<string | null> {
    if (!(await this.price.count())) return null;
    return (await this.price.textContent())?.trim() ?? null;
  }

  async isAddToCartAvailable(): Promise<boolean> {
    return this.addToCartButton.isVisible();
  }

  async setQuantity(quantity: number): Promise<void> {
    if (await this.quantityDropdown.count()) {
      await this.quantityDropdown.selectOption(String(quantity), { force: true });
    }
  }

  async addToCart(): Promise<void> {
    logger.info('Adding product to cart');
    await this.addToCartButton.click();
    await this.addedToCartConfirmation.or(this.noThanksCoverage).first().waitFor();
    if (await this.noThanksCoverage.isVisible()) {
      await this.noThanksCoverage.click();
    }
    await this.addedToCartConfirmation.waitFor({ state: 'visible' });
  }
}
