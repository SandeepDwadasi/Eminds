import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly allMenuButton: Locator;
  readonly accountLink: Locator;

  constructor(page: Page) {
    super(page);
    this.allMenuButton = page.locator('#nav-hamburger-menu');
    this.accountLink = page.locator('#nav-link-accountList');
  }

  async open(): Promise<void> {
    await this.goto('/');
    await this.searchBox.waitFor({ state: 'visible' });
  }
}
