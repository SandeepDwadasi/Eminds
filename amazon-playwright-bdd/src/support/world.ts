import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

export interface ScenarioData {
  searchTerm?: string;
  productTitle?: string;
  [key: string]: unknown;
}

/** Per-scenario state shared between hooks and step definitions. */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  data: ScenarioData = {};

  homePage!: HomePage;
  searchResultsPage!: SearchResultsPage;
  productPage!: ProductPage;
  cartPage!: CartPage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  initPages(): void {
    this.homePage = new HomePage(this.page);
    this.searchResultsPage = new SearchResultsPage(this.page);
    this.productPage = new ProductPage(this.page);
    this.cartPage = new CartPage(this.page);
  }
}

setWorldConstructor(CustomWorld);
