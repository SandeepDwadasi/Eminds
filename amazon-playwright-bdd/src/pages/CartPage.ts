import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class CartPage extends BasePage {
  readonly activeItems: Locator;
  readonly emptyCartHeading: Locator;
  readonly subtotal: Locator;

  constructor(page: Page) {
    super(page);
    this.activeItems = page.locator(
      '[data-name="Active Items"] div[data-asin][data-itemtype="active"], #sc-active-cart div.sc-list-item[data-asin]',
    );
    this.emptyCartHeading = page.getByText(/your amazon (cart|basket) is empty/i).first();
    this.subtotal = page
      .locator('#sc-subtotal-amount-activecart, #sc-subtotal-amount-buybox')
      .first();
  }

  async open(): Promise<void> {
    await this.goto('/gp/cart/view.html');
  }

  async itemCount(): Promise<number> {
    return this.activeItems.count();
  }

  async itemTitles(): Promise<string[]> {
    const titles = await this.activeItems
      .locator('.sc-product-title, .a-truncate-full')
      .allInnerTexts();
    return titles.map((t) => t.trim()).filter(Boolean);
  }

  async removeFirstItem(): Promise<void> {
    logger.info('Removing first item from cart');
    await this.activeItems
      .first()
      .locator('input[value="Delete"], [data-action="delete"] input, button[aria-label^="Delete"]')
      .filter({ visible: true })
      .first()
      .click();
    // Amazon keeps the row in the DOM and swaps in a "was removed" notice.
    await expect(
      this.emptyCartHeading.or(this.page.getByText(/was removed from/i).first()).first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async isEmpty(): Promise<boolean> {
    return this.emptyCartHeading.isVisible();
  }
}
