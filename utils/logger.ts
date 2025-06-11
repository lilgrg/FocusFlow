import { Platform } from 'react-native';
import { storage } from './storage';

/**
 * Log levels for different types of logs
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log categories for different parts of the application
 */
export enum LogCategory {
  APP = 'APP',
  AUTH = 'AUTH',
  ROUTINE = 'ROUTINE',
  API = 'API',
  STORAGE = 'STORAGE',
  UI = 'UI',
}

/**
 * Interface for log entry
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: unknown;
  error?: Error;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  minLevel: LogLevel;
  persistLogs: boolean;
  maxPersistedLogs: number;
  categories: LogCategory[];
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  persistLogs: true,
  maxPersistedLogs: 1000,
  categories: Object.values(LogCategory),
};

class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private readonly STORAGE_KEY = '@FocusFlow/logs';

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.loadPersistedLogs();
  }

  /**
   * Load persisted logs from storage
   */
  private async loadPersistedLogs(): Promise<void> {
    if (!this.config.persistLogs) return;

    try {
      const persistedLogs = await storage.getItem(this.STORAGE_KEY);
      if (persistedLogs) {
        this.logs = JSON.parse(persistedLogs);
      }
    } catch (error) {
      console.debug('Storage not available for logs:', error);
    }
  }

  /**
   * Save logs to storage
   */
  private async persistLogs(): Promise<void> {
    if (!this.config.persistLogs) return;

    try {
      // Keep only the most recent logs
      const logsToPersist = this.logs.slice(-this.config.maxPersistedLogs);
      await storage.setItem(this.STORAGE_KEY, JSON.stringify(logsToPersist));
    } catch (error) {
      console.debug('Storage not available for logs:', error);
    }
  }

  /**
   * Create a log entry
   */
  private createLogEntry(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: unknown,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
    };
  }

  /**
   * Log a message
   */
  private log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: unknown,
    error?: Error
  ): void {
    if (
      !this.config.categories.includes(category) ||
      this.getLogLevelValue(level) < this.getLogLevelValue(this.config.minLevel)
    ) {
      return;
    }

    const entry = this.createLogEntry(level, category, message, data, error);
    this.logs.push(entry);

    // Console output
    const consoleMethod = this.getConsoleMethod(level);
    const logMessage = this.formatLogMessage(entry);
    consoleMethod(logMessage);

    // Persist logs
    this.persistLogs();
  }

  /**
   * Get console method based on log level
   */
  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Get numeric value for log level
   */
  private getLogLevelValue(level: LogLevel): number {
    switch (level) {
      case LogLevel.DEBUG:
        return 0;
      case LogLevel.INFO:
        return 1;
      case LogLevel.WARN:
        return 2;
      case LogLevel.ERROR:
        return 3;
      default:
        return 1;
    }
  }

  /**
   * Format log message for console output
   */
  private formatLogMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const platform = Platform.OS;
    const baseMessage = `[${timestamp}] [${entry.level}] [${entry.category}] [${platform}]: ${entry.message}`;

    if (entry.error) {
      return `${baseMessage}\nError: ${entry.error.message}\nStack: ${entry.error.stack}`;
    }

    if (entry.data) {
      return `${baseMessage}\nData: ${JSON.stringify(entry.data, null, 2)}`;
    }

    return baseMessage;
  }

  /**
   * Get all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  public async clearLogs(): Promise<void> {
    this.logs = [];
    if (this.config.persistLogs) {
      await storage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Debug level logging
   */
  public debug(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Info level logging
   */
  public info(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  /**
   * Warn level logging
   */
  public warn(category: LogCategory, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  /**
   * Error level logging
   */
  public error(
    category: LogCategory,
    message: string,
    error?: Error,
    data?: unknown
  ): void {
    this.log(LogLevel.ERROR, category, message, data, error);
  }
}

// Create and export a singleton instance
export const logger = new Logger(); 