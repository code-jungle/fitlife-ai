import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth, AuthProvider } from '../useAuth'
import { supabase } from '@/integrations/supabase/client'

// Mock do toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null user and loading true', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('should sign in successfully', async () => {
    const mockUser = { 
      id: '1', 
      email: 'test@test.com',
      user_metadata: { full_name: 'Test User' }
    }
    const mockResponse = { 
      data: { user: mockUser, session: null }, 
      error: null 
    }
    
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse)
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.signIn('test@test.com', 'password')
      expect(response.data).toEqual(mockUser)
      expect(response.error).toBeNull()
    })
  })

  it('should handle sign in errors', async () => {
    const mockError = { message: 'Invalid credentials' }
    const mockResponse = { 
      data: { user: null, session: null }, 
      error: mockError 
    }
    
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.signIn('test@test.com', 'wrong')
      expect(response.data).toBeNull()
      expect(response.error).toEqual({ message: 'Invalid credentials', code: 'Invalid credentials' })
    })
  })

  it('should sign up successfully', async () => {
    const mockUser = { 
      id: '1', 
      email: 'test@test.com',
      user_metadata: { full_name: 'Test User' }
    }
    const mockResponse = { 
      data: { user: mockUser, session: null }, 
      error: null 
    }
    
    vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.signUp('test@test.com', 'password', 'Test User')
      expect(response.data).toEqual(mockUser)
      expect(response.error).toBeNull()
    })
  })

  it('should handle sign up errors', async () => {
    const mockError = { message: 'Email already registered' }
    const mockResponse = { 
      data: { user: null, session: null }, 
      error: mockError 
    }
    
    vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.signUp('test@test.com', 'password', 'Test User')
      expect(response.data).toBeNull()
      expect(response.error).toEqual({ message: 'Email already registered', code: 'Email already registered' })
    })
  })

  it('should sign out successfully', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.signOut()
    })

    expect(supabase.auth.signOut).toHaveBeenCalled()
  })

  it('should handle sign out errors', async () => {
    const mockError = { message: 'Sign out failed' }
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: mockError })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await expect(result.current.signOut()).rejects.toThrow('Sign out failed')
    })
  })

  it('should handle unknown errors gracefully', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.signIn('test@test.com', 'password')
      expect(response.data).toBeNull()
      expect(response.error).toEqual({ 
        message: 'Network error', 
        code: 'UNKNOWN_ERROR' 
      })
    })
  })
})

