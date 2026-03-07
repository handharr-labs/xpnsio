export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}

export class ConsoleLogger implements Logger {
  constructor(private readonly prefix = '[Xpnsio]') {}

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`${this.prefix} ${message}`, context ?? '');
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    console.info(`${this.prefix} ${message}`, context ?? '');
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(`${this.prefix} ${message}`, context ?? '');
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`${this.prefix} ${message}`, error, context ?? '');
  }
}

export const logger: Logger = new ConsoleLogger();
