import { useState, useCallback } from 'react';
import { AppError, withErrorHandling } from '../utils/errorHandling';

interface AsyncState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
}

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
  onFinally?: () => void;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (
      asyncFunction: () => Promise<T>,
      options: UseAsyncOptions<T> = {}
    ) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await withErrorHandling(asyncFunction, (error) => {
          setState((prev) => ({ ...prev, error }));
          options.onError?.(error);
        });

        setState((prev) => ({ ...prev, data: result, isLoading: false }));
        options.onSuccess?.(result);
        return result;
      } catch (error) {
        const appError = error as AppError;
        setState((prev) => ({ ...prev, error: appError, isLoading: false }));
        options.onError?.(appError);
        throw appError;
      } finally {
        options.onFinally?.();
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
} 