# Shared Hooks

Esta pasta contém todos os hooks compartilhados do aplicativo.

## Estrutura Proposta

```
src/features/shared/hooks/
├── api/                    # Hooks de API
│   ├── useApi.tsx
│   ├── useQuery.tsx
│   ├── useMutation.tsx
│   └── useInfiniteQuery.tsx
├── state/                  # Hooks de estado
│   ├── useLocalStorage.tsx
│   ├── useSessionStorage.tsx
│   ├── useToggle.tsx
│   ├── useCounter.tsx
│   └── usePrevious.tsx
├── ui/                     # Hooks de UI
│   ├── useModal.tsx
│   ├── useToast.tsx
│   ├── useTheme.tsx
│   ├── useBreakpoint.tsx
│   └── useIntersectionObserver.tsx
├── form/                   # Hooks de formulário
│   ├── useForm.tsx
│   ├── useField.tsx
│   ├── useValidation.tsx
│   └── useFormState.tsx
├── performance/            # Hooks de performance
│   ├── useDebounce.tsx
│   ├── useThrottle.tsx
│   ├── useMemo.tsx
│   ├── useCallback.tsx
│   └── useVirtualization.tsx
├── error/                  # Hooks de erro
│   ├── useErrorHandler.tsx
│   ├── useErrorBoundary.tsx
│   └── useRetry.tsx
├── async/                  # Hooks assíncronos
│   ├── useAsync.tsx
│   ├── useAsyncOperation.tsx
│   ├── usePromise.tsx
│   └── useTimeout.tsx
└── index.ts                # Barrel exports
```

## Benefícios

1. **Reutilização**: Hooks podem ser usados em qualquer feature
2. **Consistência**: Padrões de comportamento unificados
3. **Manutenibilidade**: Lógica centralizada
4. **Testabilidade**: Hooks isolados e testáveis
5. **Performance**: Hooks otimizados para performance
6. **Documentação**: Cada hook tem sua própria documentação

