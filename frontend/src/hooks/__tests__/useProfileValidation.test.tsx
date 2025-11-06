import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProfileValidation } from '../useProfileValidation'
import { useProfile } from '../useProfile'
import { useAuth } from '../useAuth'

// Mock dos hooks
vi.mock('../useProfile')
vi.mock('../useAuth')

const mockUseProfile = vi.mocked(useProfile)
const mockUseAuth = vi.mocked(useAuth)

describe('useProfileValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true for complete profile', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(true)
  })

  it('should return false for incomplete profile - missing age', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: null,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for incomplete profile - missing weight', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: null,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for incomplete profile - missing height', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: null,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for incomplete profile - missing gender', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: null,
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for incomplete profile - missing activity level', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: null,
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for incomplete profile - missing fitness goal', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: null,
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for incomplete profile - missing gym days', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: null,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(mockProfile)).toBe(false)
  })

  it('should return false for null profile', () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    expect(result.current.isProfileComplete(null)).toBe(false)
  })

  it('should validate step correctly', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    // Test step 1 (personal info)
    const step1Result = result.current.validateStep(1, {
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
    })
    expect(step1Result.isValid).toBe(true)

    // Test step 2 (activity level)
    const step2Result = result.current.validateStep(2, {
      activity_level: 'moderate',
      gym_days_per_week: 3,
    })
    expect(step2Result.isValid).toBe(true)

    // Test step 3 (goals)
    const step3Result = result.current.validateStep(3, {
      fitness_goal: 'gain_muscle',
    })
    expect(step3Result.isValid).toBe(true)

    // Test invalid step
    const invalidResult = result.current.validateStep(1, {
      age: null,
      weight: 70,
      height: 175,
      gender: 'male',
    })
    expect(invalidResult.isValid).toBe(false)
    expect(invalidResult.message).toBe('Todos os campos da etapa 1 são obrigatórios')
  })

  it('should check if can proceed correctly', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    // Test with complete profile
    const canProceedComplete = result.current.canProceed(1, {
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
    })
    expect(canProceedComplete).toBe(true)

    // Test with incomplete profile
    const canProceedIncomplete = result.current.canProceed(1, {
      age: null,
      weight: 70,
      height: 175,
      gender: 'male',
    })
    expect(canProceedIncomplete).toBe(false)
  })

  it('should calculate progress correctly', () => {
    const mockProfile = {
      id: '1',
      user_id: '1',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    }

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    const { result } = renderHook(() => useProfileValidation({ redirectOnIncomplete: false }))

    // Test progress calculation
    const progress = result.current.calculateProgress(2, 4)
    expect(progress).toBe(50) // 2/4 * 100 = 50%

    const progress2 = result.current.calculateProgress(1, 4)
    expect(progress2).toBe(25) // 1/4 * 100 = 25%

    const progress3 = result.current.calculateProgress(4, 4)
    expect(progress3).toBe(100) // 4/4 * 100 = 100%
  })
})
