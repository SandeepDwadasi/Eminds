import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('I should be on the product details page', async function (this: CustomWorld) {
  await expect(this.productPage.productTitle).toBeVisible();
});

Then('the product title should match the selected result', async function (this: CustomWorld) {
  const expected = this.data.productTitle ?? '';
  const actual = await this.productPage.getTitle();
  // Result cards often truncate titles, so compare on the leading words.
  const prefix = expected.split(/\s+/).slice(0, 4).join(' ').toLowerCase();
  expect(actual.toLowerCase()).toContain(prefix);
});

When('I add the product to the cart', async function (this: CustomWorld) {
  expect(
    await this.productPage.isAddToCartAvailable(),
    'This product has no "Add to Cart" button (unavailable or multiple sellers)',
  ).toBe(true);
  await this.productPage.addToCart();
});
