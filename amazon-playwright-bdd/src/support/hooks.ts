import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  setDefaultTimeout,
  Status,
} from '@cucumber/cucumber';
import { Browser } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { launchBrowser } from './browserManager';
import { config } from './config';
import { CustomWorld } from './world';
import { logger } from '../utils/logger';

setDefaultTimeout(config.defaultTimeout * 2);

let browser: Browser;

const safeName = (name: string): string => name.replace(/[^a-z0-9]+/gi, '_').slice(0, 80);

BeforeAll(async function () {
  fs.mkdirSync('reports/screenshots', { recursive: true });
  logger.info(
    `Launching ${config.browser} (headless=${config.headless}) against ${config.baseUrl}`,
  );
  browser = await launchBrowser();
});

Before(async function (this: CustomWorld, { pickle }: ITestCaseHookParameter) {
  logger.info(`START scenario: ${pickle.name}`);
  this.browser = browser;
  this.context = await browser.newContext({
    baseURL: config.baseUrl,
    viewport: config.viewport,
    userAgent: config.userAgent,
    locale: 'en-US',
    recordVideo: config.recordVideo ? { dir: 'reports/videos' } : undefined,
  });
  if (config.trace !== 'off') {
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.defaultTimeout);
  this.initPages();
});

After(async function (this: CustomWorld, { pickle, result }: ITestCaseHookParameter) {
  const failed = result?.status === Status.FAILED;
  const name = safeName(pickle.name);

  if (failed && this.page) {
    const screenshot = await this.page.screenshot({
      path: path.join('reports/screenshots', `${name}.png`),
      fullPage: true,
    });
    this.attach(screenshot, 'image/png');
  }

  if (config.trace !== 'off' && this.context) {
    const keep = config.trace === 'on' || failed;
    await this.context.tracing.stop(
      keep ? { path: path.join('reports/traces', `${name}.zip`) } : undefined,
    );
  }

  await this.page?.close();
  await this.context?.close();
  logger.info(`END scenario: ${pickle.name} -> ${result?.status}`);
});

AfterAll(async function () {
  await browser?.close();
});
