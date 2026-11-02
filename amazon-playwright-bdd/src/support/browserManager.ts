import { Browser, chromium, firefox, LaunchOptions, webkit } from '@playwright/test';
import { config } from './config';

const launchers = { chromium, firefox, webkit };

export async function launchBrowser(): Promise<Browser> {
  const options: LaunchOptions = {
    headless: config.headless,
    slowMo: config.slowMo,
  };
  if (config.browser === 'chromium') {
    // Reduces the chance of Amazon serving a bot-check page.
    options.args = ['--disable-blink-features=AutomationControlled'];
  }
  const launcher = launchers[config.browser];
  if (!launcher) {
    throw new Error(`Unsupported BROWSER "${config.browser}". Use chromium, firefox or webkit.`);
  }
  return launcher.launch(options);
}
