import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AppStateProvider, useAppState } from '../AppStateContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppStateProvider>{children}</AppStateProvider>
)

describe('AppStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide initial context values', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.setLoading).toBeDefined()
    expect(result.current.setError).toBeDefined()
    expect(result.current.clearError).toBeDefined()
    expect(result.current.setLoadingState).toBeDefined()
    expect(result.current.getLoadingState).toBeDefined()
    expect(result.current.clearLoadingState).toBeDefined()
  })

  it('should set global loading state', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.loading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should set and clear error state', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setError('Test error message')
    })

    expect(result.current.error).toBe('Test error message')

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should set error with Error object', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    const error = new Error('Test error')
    act(() => {
      result.current.setError(error)
    })

    expect(result.current.error).toBe('Test error')
  })

  it('should set error with unknown object', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setError({ message: 'Custom error' })
    })

    expect(result.current.error).toBe('Erro desconhecido')
  })

  it('should manage keyed loading states', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setLoadingState('profile', true)
    })

    expect(result.current.getLoadingState('profile')).toBe(true)
    expect(result.current.getLoadingState('workout')).toBe(false)

    act(() => {
      result.current.setLoadingState('workout', true)
    })

    expect(result.current.getLoadingState('profile')).toBe(true)
    expect(result.current.getLoadingState('workout')).toBe(true)

    act(() => {
      result.current.clearLoadingState('profile')
    })

    expect(result.current.getLoadingState('profile')).toBe(false)
    expect(result.current.getLoadingState('workout')).toBe(true)
  })

  it('should clear all loading states', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setLoadingState('profile', true)
      result.current.setLoadingState('workout', true)
      result.current.setLoadingState('nutrition', true)
    })

    expect(result.current.getLoadingState('profile')).toBe(true)
    expect(result.current.getLoadingState('workout')).toBe(true)
    expect(result.current.getLoadingState('nutrition')).toBe(true)

    act(() => {
      result.current.clearLoadingState()
    })

    expect(result.current.getLoadingState('profile')).toBe(false)
    expect(result.current.getLoadingState('workout')).toBe(false)
    expect(result.current.getLoadingState('nutrition')).toBe(false)
  })

  it('should handle multiple error states', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setError('First error')
    })

    expect(result.current.error).toBe('First error')

    act(() => {
      result.current.setError('Second error')
    })

    expect(result.current.error).toBe('Second error')
  })

  it('should handle concurrent loading states', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setLoadingState('profile', true)
      result.current.setLoadingState('workout', true)
      result.current.setLoading(true)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.getLoadingState('profile')).toBe(true)
    expect(result.current.getLoadingState('workout')).toBe(true)

    act(() => {
      result.current.setLoading(false)
      result.current.clearLoadingState('profile')
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.getLoadingState('profile')).toBe(false)
    expect(result.current.getLoadingState('workout')).toBe(true)
  })

  it('should handle undefined loading states', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    expect(result.current.getLoadingState('nonexistent')).toBe(false)
    expect(result.current.getLoadingState('')).toBe(false)
  })

  it('should handle null error clearing', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')

    act(() => {
      result.current.setError(null)
    })

    expect(result.current.error).toBeNull()
  })

  it('should handle undefined error clearing', () => {
    const { result } = renderHook(() => useAppState(), { wrapper })

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBe('Test error')

    act(() => {
      result.current.setError(undefined)
    })

    expect(result.current.error).toBeNull()
  })
})

