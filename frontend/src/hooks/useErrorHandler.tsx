import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
}

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: unknown,
    context: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'Ocorreu um erro inesperado',
      onError
    } = options;

    // Extract error message
    let errorMessage = fallbackMessage;
    let errorCode = 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorCode = error.name || 'ERROR';
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorCode = 'STRING_ERROR';
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
      errorCode = 'OBJECT_ERROR';
    }

    // Log error
    if (logError) {
      console.error(`[${context}] Error:`, error);
    }

    // Show toast notification
    if (showToast) {
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }

    // Call custom error handler
    if (onError && error instanceof Error) {
      onError(error);
    }

    return {
      message: errorMessage,
      code: errorCode,
      originalError: error
    };
  }, []);

  const handleAsyncError = useCallback(async (
    asyncFn: () => Promise<any>,
    context: string,
    options: ErrorHandlerOptions = {}
  ) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error, context, options);
      return null;
    }
  }, [handleError]);

  const handleApiError = useCallback((
    error: unknown,
    operation: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const context = `API_${operation.toUpperCase()}`;
    
    // Handle specific API error types
    if (error && typeof error === 'object' && 'code' in error) {
      const apiError = error as { code: string; message: string };
      
      switch (apiError.code) {
        case 'PGRST116':
          return handleError(
            new Error('Dados não encontrados'),
            context,
            { ...options, fallbackMessage: 'Dados não encontrados' }
          );
        case '23505':
          return handleError(
            new Error('Dados já existem'),
            context,
            { ...options, fallbackMessage: 'Estes dados já existem' }
          );
        case '23503':
          return handleError(
            new Error('Dados em uso'),
            context,
            { ...options, fallbackMessage: 'Não é possível excluir dados em uso' }
          );
        default:
          return handleError(
            error,
            context,
            { ...options, fallbackMessage: `Erro ao ${operation}` }
          );
      }
    }

    return handleError(
      error,
      context,
      { ...options, fallbackMessage: `Erro ao ${operation}` }
    );
  }, [handleError]);

  const handleNetworkError = useCallback((
    error: unknown,
    operation: string,
    options: ErrorHandlerOptions = {}
  ) => {
    const context = `NETWORK_${operation.toUpperCase()}`;
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return handleError(
          new Error('Erro de conexão. Verifique sua internet.'),
          context,
          { ...options, fallbackMessage: 'Erro de conexão' }
        );
      }
      
      if (error.message.includes('timeout')) {
        return handleError(
          new Error('Tempo limite excedido. Tente novamente.'),
          context,
          { ...options, fallbackMessage: 'Tempo limite excedido' }
        );
      }
    }

    return handleError(
      error,
      context,
      { ...options, fallbackMessage: `Erro de rede ao ${operation}` }
    );
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    handleApiError,
    handleNetworkError
  };
};

