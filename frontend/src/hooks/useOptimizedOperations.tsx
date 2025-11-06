import { useCallback, useMemo, useRef } from 'react';

// ✅ OTIMIZADO: Hook para operações otimizadas
export const useOptimizedOperations = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // ✅ OTIMIZADO: Debounce para operações custosas
  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }, []);

  // ✅ OTIMIZADO: Throttle para operações que devem ser limitadas
  const throttle = useCallback((func: Function, delay: number) => {
    let lastCall = 0;
    
    return (...args: any[]) => {
      const now = Date.now();
      
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }, []);

  // ✅ OTIMIZADO: Memoização de arrays
  const memoizedArray = useCallback((array: any[], deps: any[]) => {
    return useMemo(() => array, deps);
  }, []);

  // ✅ OTIMIZADO: Memoização de objetos
  const memoizedObject = useCallback((obj: any, deps: any[]) => {
    return useMemo(() => obj, deps);
  }, []);

  // ✅ OTIMIZADO: Memoização de funções
  const memoizedFunction = useCallback((fn: Function, deps: any[]) => {
    return useMemo(() => fn, deps);
  }, []);

  // ✅ OTIMIZADO: Lazy loading para componentes
  const lazyLoad = useCallback((importFn: () => Promise<any>) => {
    return useMemo(() => {
      return React.lazy(importFn);
    }, []);
  }, []);

  // ✅ OTIMIZADO: Intersection Observer para lazy loading
  const useIntersectionObserver = useCallback((
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const observerRef = useRef<IntersectionObserver>();
    
    const observe = useCallback((element: Element) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      observerRef.current = new IntersectionObserver(callback, options);
      observerRef.current.observe(element);
    }, [callback, options]);

    const unobserve = useCallback((element: Element) => {
      if (observerRef.current) {
        observerRef.current.unobserve(element);
      }
    }, []);

    return { observe, unobserve };
  }, []);

  // ✅ OTIMIZADO: Performance monitoring
  const measurePerformance = useCallback((name: string, fn: Function) => {
    return (...args: any[]) => {
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    };
  }, []);

  // ✅ OTIMIZADO: Batch updates
  const batchUpdates = useCallback((updates: Function[]) => {
    return () => {
      updates.forEach(update => update());
    };
  }, []);

  // ✅ OTIMIZADO: Cleanup
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    debounce,
    throttle,
    memoizedArray,
    memoizedObject,
    memoizedFunction,
    lazyLoad,
    useIntersectionObserver,
    measurePerformance,
    batchUpdates,
    cleanup
  };
};

