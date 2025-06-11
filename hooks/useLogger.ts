import { useCallback } from 'react';
import { logger, LogCategory } from '../utils/logger';

export function useLogger(category: LogCategory) {
  const debug = useCallback(
    (message: string, data?: unknown) => {
      logger.debug(category, message, data);
    },
    [category]
  );

  const info = useCallback(
    (message: string, data?: unknown) => {
      logger.info(category, message, data);
    },
    [category]
  );

  const warn = useCallback(
    (message: string, data?: unknown) => {
      logger.warn(category, message, data);
    },
    [category]
  );

  const error = useCallback(
    (message: string, error?: Error, data?: unknown) => {
      logger.error(category, message, error, data);
    },
    [category]
  );

  return {
    debug,
    info,
    warn,
    error,
  };
} 