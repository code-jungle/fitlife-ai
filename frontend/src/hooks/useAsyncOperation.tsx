import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface AsyncOperationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
  logError?: boolean;
}

export const useAsyncOperation = <T = any>(
  options: UseAsyncOperationOptions = {}
) => {
  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const { handleError } = useErrorHandler();
  const {
    onSuccess,
    onError,
    showToast = true,
    logError = true
  } = options;

  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    context: string = 'ASYNC_OPERATION'
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFn();
      
      setState({
        data: result,
        loading: false,
        error: null
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setState({
        data: null,
        loading: false,
        error: errorObj
      });

      handleError(error, context, {
        showToast,
        logError,
        onError: (err) => {
          if (onError) {
            onError(err);
          }
        }
      });

      return null;
    }
  }, [handleError, onSuccess, onError, showToast, logError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  const retry = useCallback(async (
    asyncFn: () => Promise<T>,
    context: string = 'ASYNC_OPERATION'
  ) => {
    return execute(asyncFn, context);
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry
  };
};

// Hook específico para operações de CRUD
export const useCrudOperation = <T = any>(
  options: UseAsyncOperationOptions = {}
) => {
  const asyncOp = useAsyncOperation<T>(options);

  const create = useCallback(async (
    createFn: () => Promise<T>,
    context: string = 'CREATE'
  ) => {
    return asyncOp.execute(createFn, context);
  }, [asyncOp]);

  const read = useCallback(async (
    readFn: () => Promise<T>,
    context: string = 'READ'
  ) => {
    return asyncOp.execute(readFn, context);
  }, [asyncOp]);

  const update = useCallback(async (
    updateFn: () => Promise<T>,
    context: string = 'UPDATE'
  ) => {
    return asyncOp.execute(updateFn, context);
  }, [asyncOp]);

  const remove = useCallback(async (
    deleteFn: () => Promise<T>,
    context: string = 'DELETE'
  ) => {
    return asyncOp.execute(deleteFn, context);
  }, [asyncOp]);

  return {
    ...asyncOp,
    create,
    read,
    update,
    remove
  };
};

