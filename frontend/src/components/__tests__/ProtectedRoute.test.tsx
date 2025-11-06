import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { useProfileValidation } from '@/hooks/useProfileValidation'

// Mock dos hooks
vi.mock('@/hooks/useAuth')
vi.mock('@/hooks/useProfileValidation')

const mockUseAuth = vi.mocked(useAuth)
const mockUseProfileValidation = vi.mocked(useProfileValidation)

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
)

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children when user is authenticated and profile is complete', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(true),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should show loading spinner when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(false),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should not render children when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(false),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should render children when skipProfileCheck is true', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(false),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute skipProfileCheck={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should not render children when user is authenticated but profile is incomplete', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(false),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    // Should not render children when profile is incomplete
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should call useProfileValidation with correct parameters', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(true),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute skipProfileCheck={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(mockUseProfileValidation).toHaveBeenCalledWith({ skipValidation: true })
  })

  it('should call useProfileValidation with default parameters', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(true),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(mockUseProfileValidation).toHaveBeenCalledWith({ skipValidation: false })
  })

  it('should handle multiple children correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(true),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          <div>First Child</div>
          <div>Second Child</div>
          <span>Third Child</span>
        </ProtectedRoute>
      </TestWrapper>
    )

    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
    expect(screen.getByText('Third Child')).toBeInTheDocument()
  })

  it('should handle empty children correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfileValidation.mockReturnValue({
      isProfileComplete: vi.fn().mockReturnValue(true),
      validateStep: vi.fn(),
      canProceed: vi.fn(),
      calculateProgress: vi.fn(),
    })

    render(
      <TestWrapper>
        <ProtectedRoute>
          {null}
        </ProtectedRoute>
      </TestWrapper>
    )

    // Should not crash and should not render anything
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
