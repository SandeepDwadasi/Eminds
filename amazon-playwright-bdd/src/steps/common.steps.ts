import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I am on the Amazon home page', async function (this: CustomWorld) {
  await this.homePage.open();
});

Given('my delivery ZIP code is {string}', async function (this: CustomWorld, zip: string) {
  await this.homePage.setDeliveryZip(zip);
});

Then('the page title should contain {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
});

Then('the page URL should contain {string}', async function (this: CustomWorld, text: string) {
  expect(this.page.url()).toContain(text);
});
