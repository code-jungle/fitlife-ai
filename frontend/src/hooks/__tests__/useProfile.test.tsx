import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProfile } from '../useProfile'
import { supabase } from '@/integrations/supabase/client'

// Mock do useAuth
vi.mock('../useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@test.com' },
    loading: false,
  }),
}))

// Mock do toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}))

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null profile and loading true', () => {
    const { result } = renderHook(() => useProfile())
    
    expect(result.current.profile).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('should fetch profile successfully', async () => {
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
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    }

    const mockResponse = { data: mockProfile, error: null }
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse),
    } as any)

    const { result } = renderHook(() => useProfile())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.loading).toBe(false)
  })

  it('should handle profile fetch errors', async () => {
    const mockError = { message: 'Profile not found' }
    const mockResponse = { data: null, error: mockError }
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse),
    } as any)

    const { result } = renderHook(() => useProfile())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.profile).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should update profile successfully', async () => {
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

    const mockResponse = { data: mockProfile, error: null }
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse),
    } as any)

    const { result } = renderHook(() => useProfile())

    await act(async () => {
      await result.current.updateProfile({
        age: 26,
        weight: 75,
        height: 180,
        gender: 'male',
        activity_level: 'active',
        fitness_goal: 'maintain_weight',
        gym_days_per_week: 4,
        dietary_restrictions: ['vegetarian'],
        allergies: ['nuts'],
      })
    })

    expect(supabase.from).toHaveBeenCalledWith('user_profiles')
  })

  it('should handle profile update errors', async () => {
    const mockError = { message: 'Update failed' }
    const mockResponse = { data: null, error: mockError }
    
    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockResponse),
    } as any)

    const { result } = renderHook(() => useProfile())

    await act(async () => {
      await expect(result.current.updateProfile({
        age: 26,
        weight: 75,
        height: 180,
        gender: 'male',
        activity_level: 'active',
        fitness_goal: 'maintain_weight',
        gym_days_per_week: 4,
        dietary_restrictions: [],
        allergies: [],
      })).rejects.toThrow('Update failed')
    })
  })

  it('should calculate macros correctly for male user', () => {
    const { result } = renderHook(() => useProfile())
    
    const macros = result.current.calculateMacros(
      70, // weight
      175, // height
      25, // age
      'male', // gender
      'moderate', // activity level
      'gain_muscle' // fitness goal
    )

    expect(macros).toHaveProperty('target_calories')
    expect(macros).toHaveProperty('target_protein')
    expect(macros).toHaveProperty('target_carbs')
    expect(macros).toHaveProperty('target_fat')
    expect(macros.target_protein).toBe(154) // 70 * 2.2
  })

  it('should calculate macros correctly for female user', () => {
    const { result } = renderHook(() => useProfile())
    
    const macros = result.current.calculateMacros(
      60, // weight
      165, // height
      25, // age
      'female', // gender
      'moderate', // activity level
      'lose_weight' // fitness goal
    )

    expect(macros).toHaveProperty('target_calories')
    expect(macros).toHaveProperty('target_protein')
    expect(macros).toHaveProperty('target_carbs')
    expect(macros).toHaveProperty('target_fat')
    expect(macros.target_protein).toBe(132) // 60 * 2.2
  })

  it('should apply weight loss goal correctly', () => {
    const { result } = renderHook(() => useProfile())
    
    const macros = result.current.calculateMacros(
      70, // weight
      175, // height
      25, // age
      'male', // gender
      'moderate', // activity level
      'lose_weight' // fitness goal
    )

    // Should reduce calories by 20% for weight loss
    expect(macros.target_calories).toBeLessThan(2500) // Approximate TDEE for moderate activity
  })

  it('should apply muscle gain goal correctly', () => {
    const { result } = renderHook(() => useProfile())
    
    const macros = result.current.calculateMacros(
      70, // weight
      175, // height
      25, // age
      'male', // gender
      'moderate', // activity level
      'gain_muscle' // fitness goal
    )

    // Should increase calories by 10% for muscle gain
    expect(macros.target_calories).toBeGreaterThan(2500) // Approximate TDEE for moderate activity
  })
})

