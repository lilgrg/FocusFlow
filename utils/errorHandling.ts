import { ApiError } from '../types';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error codes for different types of errors
 */
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Error messages for different types of errors
 */
export const ErrorMessages = {
  [ErrorCodes.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ErrorCodes.VALIDATION_ERROR]: 'Invalid input data. Please check your input.',
  [ErrorCodes.AUTHENTICATION_ERROR]: 'Authentication failed. Please log in again.',
  [ErrorCodes.AUTHORIZATION_ERROR]: 'You do not have permission to perform this action.',
  [ErrorCodes.NOT_FOUND_ERROR]: 'The requested resource was not found.',
  [ErrorCodes.SERVER_ERROR]: 'An unexpected server error occurred. Please try again later.',
  [ErrorCodes.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
} as const;

/**
 * Check if an error is an API error
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};

/**
 * Check if an error is an AppError
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

/**
 * Create an AppError from an unknown error
 */
export const createAppError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (isApiError(error)) {
    return new AppError(error.message, error.code, error.details);
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      { originalError: error }
    );
  }

  return new AppError(
    'An unknown error occurred',
    ErrorCodes.UNKNOWN_ERROR,
    { originalError: error }
  );
};

/**
 * Handle errors in async functions
 */
export const withErrorHandling = async <T>(
  fn: () => Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    const appError = createAppError(error);
    if (errorHandler) {
      errorHandler(appError);
    }
    throw appError;
  }
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  const appError = createAppError(error);
  return ErrorMessages[appError.code as keyof typeof ErrorMessages] || appError.message;
}; 