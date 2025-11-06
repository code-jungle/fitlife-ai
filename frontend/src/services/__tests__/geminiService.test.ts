import { describe, it, expect, vi, beforeEach } from 'vitest'
import { geminiService } from '../geminiService'

// Mock do Google Generative AI
const mockGenerateContent = vi.fn()
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: mockGetGenerativeModel
  }))
}))

describe('GeminiService', () => {
  const mockProfile = {
    age: 25,
    weight: 70,
    height: 175,
    gender: 'male' as const,
    activity_level: 'moderate' as const,
    fitness_goal: 'gain_muscle' as const,
    gym_days_per_week: 3,
    allergies: [],
    dietary_restrictions: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateWorkoutPlan', () => {
    it('should generate workout plan successfully', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify([{
            name: 'Treino A - Peito e Tríceps',
            description: 'Treino focado em desenvolvimento do peitoral e tríceps',
            duration_minutes: 60,
            difficulty_level: 'intermediate',
            exercises: [
              {
                name: 'Supino Reto com Barra',
                description: 'Deitado no banco, segure a barra com pegada ligeiramente mais larga que os ombros',
                sets: 4,
                reps: 8,
                rest_seconds: 90,
                muscle_groups: ['peito', 'tríceps'],
                equipment: 'barra e banco'
              }
            ]
          }])
        }
      }

      mockGenerateContent.mockResolvedValue(mockResponse)

      const result = await geminiService.generateWorkoutPlan(mockProfile)

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Treino A - Peito e Tríceps')
      expect(result[0].exercises).toHaveLength(1)
      expect(result[0].exercises[0].name).toBe('Supino Reto com Barra')
    })

    it('should handle API errors gracefully', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'))

      await expect(geminiService.generateWorkoutPlan(mockProfile))
        .rejects.toThrow('API Error')
    })

    it('should handle service overload errors', async () => {
      const overloadError = new Error('503 Service Unavailable')
      mockGenerateContent.mockRejectedValue(overloadError)

      const result = await geminiService.generateWorkoutPlan(mockProfile)

      // Should return fallback plans
      expect(result).toHaveLength(3) // Based on gym_days_per_week
      expect(result[0].name).toContain('Treino A')
    })

    it('should handle invalid JSON response', async () => {
      const mockResponse = {
        response: {
          text: () => 'Invalid JSON response'
        }
      }

      mockGenerateContent.mockResolvedValue(mockResponse)

      const result = await geminiService.generateWorkoutPlan(mockProfile)

      // Should return fallback plans
      expect(result).toHaveLength(3)
    })
  })

  describe('generateNutritionPlan', () => {
    it('should generate nutrition plan successfully', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify({
            name: 'Plano Nutricional Personalizado',
            description: 'Plano alimentar completo e balanceado',
            total_calories: 2000,
            meals: [
              {
                name: 'Café da Manhã Energético',
                meal_type: 'Café da Manhã',
                suggested_time: '07:00 - 08:00',
                calories: 500,
                protein: 25,
                carbs: 60,
                fat: 15,
                meal_foods: [
                  {
                    food_name: 'Aveia em flocos',
                    quantity: 50,
                    unit: 'g',
                    calories_per_unit: 4
                  }
                ]
              }
            ]
          })
        }
      }

      mockGenerateContent.mockResolvedValue(mockResponse)

      const result = await geminiService.generateNutritionPlan(mockProfile)

      expect(result.name).toBe('Plano Nutricional Personalizado')
      expect(result.total_calories).toBe(2000)
      expect(result.meals).toHaveLength(1)
      expect(result.meals[0].name).toBe('Café da Manhã Energético')
    })

    it('should handle nutrition plan API errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Nutrition API Error'))

      await expect(geminiService.generateNutritionPlan(mockProfile))
        .rejects.toThrow('Nutrition API Error')
    })

    it('should handle service overload for nutrition', async () => {
      const overloadError = new Error('503 Service Unavailable')
      mockGenerateContent.mockRejectedValue(overloadError)

      const result = await geminiService.generateNutritionPlan(mockProfile)

      // Should return fallback plan
      expect(result.name).toBe('Plano Nutricional Personalizado')
      expect(result.meals).toHaveLength(4) // Breakfast, lunch, snack, dinner
    })
  })

  describe('generateGoalSuggestions', () => {
    it('should generate goal suggestions successfully', async () => {
      const mockResponse = {
        response: {
          text: () => JSON.stringify([
            'Perder 5kg em 3 meses',
            'Treinar 4x por semana',
            'Consumir 2L de água por dia'
          ])
        }
      }

      mockGenerateContent.mockResolvedValue(mockResponse)

      const result = await geminiService.generateGoalSuggestions(mockProfile)

      expect(result).toHaveLength(3)
      expect(result[0]).toBe('Perder 5kg em 3 meses')
      expect(result[1]).toBe('Treinar 4x por semana')
      expect(result[2]).toBe('Consumir 2L de água por dia')
    })

    it('should handle goal suggestions API errors', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Goals API Error'))

      const result = await geminiService.generateGoalSuggestions(mockProfile)

      // Should return empty array on error
      expect(result).toEqual([])
    })

    it('should handle invalid JSON for goals', async () => {
      const mockResponse = {
        response: {
          text: () => 'Invalid JSON'
        }
      }

      mockGenerateContent.mockResolvedValue(mockResponse)

      const result = await geminiService.generateGoalSuggestions(mockProfile)

      expect(result).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockGenerateContent.mockRejectedValue(networkError)

      await expect(geminiService.generateWorkoutPlan(mockProfile))
        .rejects.toThrow('Network Error')
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      mockGenerateContent.mockRejectedValue(timeoutError)

      await expect(geminiService.generateWorkoutPlan(mockProfile))
        .rejects.toThrow('Request timeout')
    })

    it('should handle malformed JSON responses', async () => {
      const mockResponse = {
        response: {
          text: () => '{ invalid json }'
        }
      }

      mockGenerateContent.mockResolvedValue(mockResponse)

      const result = await geminiService.generateWorkoutPlan(mockProfile)

      // Should return fallback plans
      expect(result).toHaveLength(3)
    })
  })

  describe('retry mechanism', () => {
    it('should retry on 503 errors', async () => {
      const overloadError = new Error('503 Service Unavailable')
      mockGenerateContent
        .mockRejectedValueOnce(overloadError)
        .mockRejectedValueOnce(overloadError)
        .mockResolvedValueOnce({
          response: {
            text: () => JSON.stringify([{
              name: 'Treino A',
              description: 'Test workout',
              duration_minutes: 60,
              difficulty_level: 'intermediate',
              exercises: []
            }])
          }
        })

      const result = await geminiService.generateWorkoutPlan(mockProfile)

      expect(mockGenerateContent).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(1)
    })

    it('should fail after max retries', async () => {
      const overloadError = new Error('503 Service Unavailable')
      mockGenerateContent.mockRejectedValue(overloadError)

      const result = await geminiService.generateWorkoutPlan(mockProfile)

      expect(mockGenerateContent).toHaveBeenCalledTimes(3)
      expect(result).toHaveLength(3) // Fallback plans
    })
  })
})

