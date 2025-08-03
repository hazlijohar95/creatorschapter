/**
 * Centralized logging utility for the application
 * Provides structured logging with different levels and contexts
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private isTest = import.meta.env.MODE === 'test';

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    // In test mode, suppress all logs except errors
    if (this.isTest && level !== LogLevel.ERROR) {
      return false;
    }
    return true;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG) && this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorContext = error instanceof Error 
        ? { ...context, error: error.message, stack: error.stack }
        : { ...context, error };
      
      console.error(this.formatMessage(LogLevel.ERROR, message, errorContext));
    }
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext): void {
    if (this.isDevelopment) {
      this.debug(`Performance: ${operation} took ${duration}ms`, context);
    }
  }

  // User action logging for analytics (production safe)
  userAction(action: string, context?: LogContext): void {
    // In production, this could send to analytics service
    if (this.isDevelopment) {
      this.info(`User Action: ${action}`, context);
    }
  }
}

export const logger = new Logger();

// Performance measurement utility
export function measurePerformance<T>(
  operation: string,
  fn: () => T | Promise<T>,
  context?: LogContext
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = fn();
    
    // Handle both sync and async operations
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        logger.performance(operation, duration, context);
      });
    } else {
      const duration = performance.now() - start;
      logger.performance(operation, duration, context);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error, context);
    throw error;
  }
}