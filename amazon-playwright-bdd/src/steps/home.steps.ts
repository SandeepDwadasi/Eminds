import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('the Amazon logo should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.logo).toBeVisible();
});

Then('the search box should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.searchBox).toBeVisible();
});

Then('the cart icon should be visible', async function (this: CustomWorld) {
  await expect(this.homePage.cartLink).toBeVisible();
});
