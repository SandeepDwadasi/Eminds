import { createLogger, format, transports } from 'winston';
import { config } from '../support/config';

const lineFormat = format.printf(
  ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`,
);

export const logger = createLogger({
  level: config.logLevel,
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), lineFormat),
  transports: [
    new transports.Console({ silent: process.env.SILENT_LOGS === 'true' }),
    new transports.File({ filename: 'logs/test-run.log' }),
  ],
});
