import * as dotenv from 'dotenv';

dotenv.config({ quiet: true });

export type BrowserName = 'chromium' | 'firefox' | 'webkit';
export type TraceMode = 'off' | 'on' | 'on-failure';

const bool = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined ? fallback : value.toLowerCase() === 'true';

export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.amazon.com',
  browser: (process.env.BROWSER ?? 'chromium') as BrowserName,
  headless: bool(process.env.HEADLESS, true),
  slowMo: Number(process.env.SLOW_MO ?? 0),
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT ?? 30000),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  recordVideo: bool(process.env.RECORD_VIDEO, false),
  trace: (process.env.TRACE ?? 'on-failure') as TraceMode,
  viewport: { width: 1366, height: 900 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
};
