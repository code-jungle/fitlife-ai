import { useMemo, useCallback } from 'react';
import { ActivityLevel, FitnessGoal } from '@/types/profile';

interface MacroCalculationInput {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
}

interface MacroCalculationResult {
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
  bmr: number;
  tdee: number;
}

export const useMacroCalculation = () => {
  // ✅ CORRIGIDO: useMemo para cálculos pesados
  const calculateBMR = useCallback((weight: number, height: number, age: number, gender: string): number => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }, []);

  // ✅ CORRIGIDO: useMemo para activity multipliers
  const getActivityMultiplier = useCallback((activityLevel: ActivityLevel): number => {
    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    return multipliers[activityLevel] || 1.2;
  }, []);

  // ✅ CORRIGIDO: useMemo para fitness goal adjustments
  const getFitnessGoalMultiplier = useCallback((fitnessGoal: FitnessGoal): number => {
    switch (fitnessGoal) {
      case 'lose_weight':
        return 0.8; // 20% deficit
      case 'gain_muscle':
        return 1.1; // 10% surplus
      case 'maintain_weight':
      case 'improve_endurance':
      case 'general_fitness':
      default:
        return 1.0; // No adjustment
    }
  }, []);

  // ✅ CORRIGIDO: useMemo para cálculo principal
  const calculateMacros = useCallback((input: MacroCalculationInput): MacroCalculationResult => {
    const { weight, height, age, gender, activityLevel, fitnessGoal } = input;

    // Calculate BMR
    const bmr = calculateBMR(weight, height, age, gender);
    
    // Calculate TDEE
    const activityMultiplier = getActivityMultiplier(activityLevel);
    const tdee = bmr * activityMultiplier;
    
    // Apply fitness goal adjustment
    const goalMultiplier = getFitnessGoalMultiplier(fitnessGoal);
    const adjustedCalories = tdee * goalMultiplier;
    
    // Calculate macros
    const target_calories = Math.round(adjustedCalories);
    const target_protein = Math.round(weight * 2.2); // 2.2g per kg
    const target_fat = Math.round(target_calories * 0.25 / 9); // 25% of calories from fat
    const target_carbs = Math.round((target_calories - (target_protein * 4) - (target_fat * 9)) / 4); // Remaining calories from carbs

    return {
      target_calories,
      target_protein,
      target_carbs,
      target_fat,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    };
  }, [calculateBMR, getActivityMultiplier, getFitnessGoalMultiplier]);

  // ✅ CORRIGIDO: useMemo para cálculos otimizados
  const calculateMacrosMemoized = useCallback((input: MacroCalculationInput) => {
    return calculateMacros(input);
  }, [calculateMacros]);

  return {
    calculateMacros: calculateMacrosMemoized,
    calculateBMR,
    getActivityMultiplier,
    getFitnessGoalMultiplier,
  };
};

