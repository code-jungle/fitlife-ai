import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useErrorHandler } from '../useErrorHandler'

// Mock do toast
const mockToast = vi.fn()
vi.mock('@/hooks/use-toast', () => ({
  toast: mockToast,
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle Error objects correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const error = new Error('Test error message')
    
    act(() => {
      result.current.handleError(error, 'Test context')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'Test error message',
      variant: 'destructive',
    })
  })

  it('should handle string errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleError('String error message', 'Test context')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'String error message',
      variant: 'destructive',
    })
  })

  it('should handle unknown errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleError({ someProperty: 'value' }, 'Test context')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'Erro desconhecido',
      variant: 'destructive',
    })
  })

  it('should handle null errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleError(null, 'Test context')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'Erro desconhecido',
      variant: 'destructive',
    })
  })

  it('should handle undefined errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    act(() => {
      result.current.handleError(undefined, 'Test context')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'Erro desconhecido',
      variant: 'destructive',
    })
  })

  it('should handle API errors with custom message', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const apiError = {
      message: 'API Error',
      code: 'API_ERROR',
      details: 'Additional details'
    }
    
    act(() => {
      result.current.handleError(apiError, 'API call failed')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'API Error',
      variant: 'destructive',
    })
  })

  it('should handle network errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const networkError = new Error('Network Error')
    networkError.name = 'NetworkError'
    
    act(() => {
      result.current.handleError(networkError, 'Network request failed')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro de Conexão',
      description: 'Verifique sua conexão com a internet e tente novamente',
      variant: 'destructive',
    })
  })

  it('should handle timeout errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const timeoutError = new Error('Request timeout')
    timeoutError.name = 'TimeoutError'
    
    act(() => {
      result.current.handleError(timeoutError, 'Request timed out')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Timeout',
      description: 'A operação demorou muito para ser concluída. Tente novamente',
      variant: 'destructive',
    })
  })

  it('should handle validation errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const validationError = new Error('Validation failed')
    validationError.name = 'ValidationError'
    
    act(() => {
      result.current.handleError(validationError, 'Form validation')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro de Validação',
      description: 'Validation failed',
      variant: 'destructive',
    })
  })

  it('should handle authentication errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const authError = new Error('Unauthorized')
    authError.name = 'AuthError'
    
    act(() => {
      result.current.handleError(authError, 'Authentication failed')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro de Autenticação',
      description: 'Sua sessão expirou. Faça login novamente',
      variant: 'destructive',
    })
  })

  it('should handle permission errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const permissionError = new Error('Forbidden')
    permissionError.name = 'PermissionError'
    
    act(() => {
      result.current.handleError(permissionError, 'Permission check failed')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Acesso Negado',
      description: 'Você não tem permissão para realizar esta ação',
      variant: 'destructive',
    })
  })

  it('should handle server errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const serverError = new Error('Internal Server Error')
    serverError.name = 'ServerError'
    
    act(() => {
      result.current.handleError(serverError, 'Server request failed')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro do Servidor',
      description: 'Ocorreu um erro interno. Tente novamente em alguns instantes',
      variant: 'destructive',
    })
  })

  it('should handle async operation errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const asyncError = new Error('Async operation failed')
    asyncError.name = 'AsyncError'
    
    act(() => {
      result.current.handleError(asyncError, 'Async operation')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro na Operação',
      description: 'Async operation failed',
      variant: 'destructive',
    })
  })

  it('should handle multiple errors correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const error1 = new Error('First error')
    const error2 = new Error('Second error')
    
    act(() => {
      result.current.handleError(error1, 'First context')
      result.current.handleError(error2, 'Second context')
    })

    expect(mockToast).toHaveBeenCalledTimes(2)
    expect(mockToast).toHaveBeenNthCalledWith(1, {
      title: 'Erro',
      description: 'First error',
      variant: 'destructive',
    })
    expect(mockToast).toHaveBeenNthCalledWith(2, {
      title: 'Erro',
      description: 'Second error',
      variant: 'destructive',
    })
  })

  it('should handle errors with custom context', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const error = new Error('Custom error')
    
    act(() => {
      result.current.handleError(error, 'Custom context')
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Erro',
      description: 'Custom error',
      variant: 'destructive',
    })
  })
})
