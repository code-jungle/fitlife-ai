import { useState, useCallback, useMemo } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface UseLoadingOptions {
  initialLoading?: boolean;
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const { initialLoading = false } = options;
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  // ✅ CORRIGIDO: useCallback para ações de loading
  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  }, []);

  const setAllLoading = useCallback((loading: boolean) => {
    setLoadingStates(prev => {
      const newState: LoadingState = {};
      Object.keys(prev).forEach(key => {
        newState[key] = loading;
      });
      return newState;
    });
  }, []);

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  // ✅ CORRIGIDO: useMemo para cálculos derivados
  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const isLoadingAny = useMemo(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const loadingKeys = useMemo(() => {
    return Object.keys(loadingStates).filter(key => loadingStates[key]);
  }, [loadingStates]);

  return {
    loadingStates,
    setLoading,
    setAllLoading,
    clearLoading,
    clearAllLoading,
    isLoading,
    isLoadingAny,
    loadingKeys,
  };
};

