import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('my cart is empty', async function (this: CustomWorld) {
  // Every scenario uses a fresh browser context, so the guest cart starts empty.
  expect(await this.homePage.getCartCount()).toBe(0);
});

When('I open the cart', async function (this: CustomWorld) {
  await this.cartPage.open();
});

When('I remove the first item from the cart', async function (this: CustomWorld) {
  await this.cartPage.removeFirstItem();
});

Then('the cart count should be {int}', async function (this: CustomWorld, count: number) {
  await expect(this.homePage.cartCount).toHaveText(String(count));
});

Then('the cart should contain {int} item(s)', async function (this: CustomWorld, count: number) {
  await expect(this.cartPage.activeItems).toHaveCount(count);
});

Then('the cart should be empty', async function (this: CustomWorld) {
  await expect(this.cartPage.emptyCartHeading).toBeVisible();
});
