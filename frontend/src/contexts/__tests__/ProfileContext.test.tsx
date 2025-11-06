import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ProfileProvider, useProfileContext } from '../ProfileContext'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'

// Mock dos hooks
vi.mock('@/hooks/useAuth')
vi.mock('@/hooks/useProfile')

const mockUseAuth = vi.mocked(useAuth)
const mockUseProfile = vi.mocked(useProfile)

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProfileProvider>{children}</ProfileProvider>
)

describe('ProfileContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide initial context values', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    expect(result.current.profileData).toEqual({})
    expect(result.current.isProfileComplete).toBe(false)
    expect(result.current.profileLoading).toBe(false)
    expect(result.current.profileError).toBeNull()
    expect(result.current.currentStep).toBe(1)
    expect(result.current.canProceed).toBe(false)
  })

  it('should initialize profile data from existing profile', () => {
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
      dietary_restrictions: ['vegetarian'],
      allergies: ['nuts'],
    }

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    expect(result.current.profileData).toEqual({
      age: '25',
      gender: 'male',
      height: '175',
      weight: '70',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: ['vegetarian'],
      allergies: ['nuts'],
    })
  })

  it('should update profile data correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    act(() => {
      result.current.updateProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
      })
    })

    expect(result.current.profileData).toEqual({
      age: '25',
      weight: '70',
      height: '175',
      gender: 'male',
    })
  })

  it('should set profile data correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    const newData = {
      age: '30',
      weight: '80',
      height: '180',
      gender: 'female',
      activity_level: 'active',
      fitness_goal: 'lose_weight',
      gym_days_per_week: 4,
    }

    act(() => {
      result.current.setProfileData(newData)
    })

    expect(result.current.profileData).toEqual(newData)
  })

  it('should validate profile correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    // Test with complete profile
    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
        activity_level: 'moderate',
        fitness_goal: 'gain_muscle',
        gym_days_per_week: 3,
      })
    })

    const validation = result.current.validateProfile()
    expect(validation.isValid).toBe(true)

    // Test with incomplete profile
    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
      })
    })

    const invalidValidation = result.current.validateProfile()
    expect(invalidValidation.isValid).toBe(false)
    expect(invalidValidation.message).toBe('Nível de atividade é obrigatório')
  })

  it('should check if profile is complete correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    // Test with incomplete profile
    expect(result.current.isProfileComplete).toBe(false)

    // Test with complete profile
    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
        activity_level: 'moderate',
        fitness_goal: 'gain_muscle',
        gym_days_per_week: 3,
      })
    })

    expect(result.current.isProfileComplete).toBe(true)
  })

  it('should manage step navigation correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    expect(result.current.currentStep).toBe(1)

    act(() => {
      result.current.nextStep()
    })

    expect(result.current.currentStep).toBe(2)

    act(() => {
      result.current.previousStep()
    })

    expect(result.current.currentStep).toBe(1)

    act(() => {
      result.current.previousStep()
    })

    expect(result.current.currentStep).toBe(1) // Should not go below 1

    act(() => {
      result.current.setCurrentStep(5)
    })

    expect(result.current.currentStep).toBe(5)
  })

  it('should reset profile correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: vi.fn(),
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    // Set some data first
    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
      })
      result.current.setCurrentStep(3)
    })

    expect(result.current.profileData).not.toEqual({})
    expect(result.current.currentStep).toBe(3)

    // Reset
    act(() => {
      result.current.resetProfile()
    })

    expect(result.current.profileData).toEqual({})
    expect(result.current.currentStep).toBe(1)
    expect(result.current.profileError).toBeNull()
  })

  it('should handle save profile successfully', async () => {
    const mockUpdateProfile = vi.fn().mockResolvedValue(undefined)

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: mockUpdateProfile,
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
        activity_level: 'moderate',
        fitness_goal: 'gain_muscle',
        gym_days_per_week: 3,
      })
    })

    await act(async () => {
      await result.current.saveProfile()
    })

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      fitness_goal: 'gain_muscle',
      gym_days_per_week: 3,
      dietary_restrictions: [],
      allergies: [],
    })
  })

  it('should handle save profile errors', async () => {
    const mockUpdateProfile = vi.fn().mockRejectedValue(new Error('Save failed'))

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: mockUpdateProfile,
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
        activity_level: 'moderate',
        fitness_goal: 'gain_muscle',
        gym_days_per_week: 3,
      })
    })

    await act(async () => {
      await result.current.saveProfile()
    })

    expect(result.current.profileError).toBe('Save failed')
  })

  it('should not save profile when user is not authenticated', async () => {
    const mockUpdateProfile = vi.fn()

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: mockUpdateProfile,
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    await act(async () => {
      await result.current.saveProfile()
    })

    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('should not save profile when validation fails', async () => {
    const mockUpdateProfile = vi.fn()

    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    })

    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      updateProfile: mockUpdateProfile,
      refetchProfile: vi.fn(),
      calculateMacros: vi.fn(),
    })

    const { result } = renderHook(() => useProfileContext(), { wrapper })

    // Set incomplete profile
    act(() => {
      result.current.setProfileData({
        age: '25',
        weight: '70',
        height: '175',
        gender: 'male',
      })
    })

    await act(async () => {
      await result.current.saveProfile()
    })

    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })
})

