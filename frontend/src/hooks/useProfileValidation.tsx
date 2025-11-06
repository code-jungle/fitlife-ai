import { useCallback, useMemo } from 'react';
import { ProfileFormData } from '@/types/profile';

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface UseProfileValidationOptions {
  redirectOnIncomplete?: boolean;
  skipValidation?: boolean;
}

export const useProfileValidation = (options: UseProfileValidationOptions = {}) => {
  const { redirectOnIncomplete = true, skipValidation = false } = options;

  // ✅ CORRIGIDO: useCallback para estabilizar a função
  const isProfileComplete = useCallback((profile: Partial<ProfileFormData> | null): boolean => {
    if (!profile) return false;
    
    return !!(
      profile.age &&
      profile.gender &&
      profile.height &&
      profile.weight &&
      profile.activity_level &&
      profile.fitness_goal &&
      profile.gym_days_per_week
    );
  }, []);

  // ✅ CORRIGIDO: useCallback para estabilizar a função de validação
  const validateStep = useCallback((step: number, profileData: Partial<ProfileFormData>): ValidationResult => {
    switch (step) {
      case 1: // Personal Info
        if (!profileData.age || !profileData.gender || !profileData.height || !profileData.weight) {
          return { isValid: false, message: "Todos os campos da etapa 1 são obrigatórios" };
        }
        if (parseInt(profileData.age as string) < 13 || parseInt(profileData.age as string) > 120) {
          return { isValid: false, message: "Idade deve estar entre 13 e 120 anos" };
        }
        if (parseFloat(profileData.height as string) < 100 || parseFloat(profileData.height as string) > 250) {
          return { isValid: false, message: "Altura deve estar entre 100 e 250 cm" };
        }
        if (parseFloat(profileData.weight as string) < 30 || parseFloat(profileData.weight as string) > 300) {
          return { isValid: false, message: "Peso deve estar entre 30 e 300 kg" };
        }
        return { isValid: true };
      
      case 2: // Activity Level
        if (!profileData.activity_level) {
          return { isValid: false, message: "Nível de atividade é obrigatório" };
        }
        if (!profileData.gym_days_per_week || (profileData.gym_days_per_week as number) < 1 || (profileData.gym_days_per_week as number) > 7) {
          return { isValid: false, message: "Dias na academia deve estar entre 1 e 7" };
        }
        return { isValid: true };
      
      case 3: // Goals
        if (!profileData.fitness_goal) {
          return { isValid: false, message: "Objetivo fitness é obrigatório" };
        }
        return { isValid: true };
      
      case 4: // Restrictions (optional)
        return { isValid: true };
      
      default:
        return { isValid: true };
    }
  }, []);

  // ✅ CORRIGIDO: useMemo para calcular se pode prosseguir
  const canProceed = useCallback((currentStep: number, profileData: Partial<ProfileFormData>): boolean => {
    return validateStep(currentStep, profileData).isValid;
  }, [validateStep]);

  // ✅ CORRIGIDO: useMemo para calcular progresso
  const calculateProgress = useCallback((currentStep: number, totalSteps: number): number => {
    return (currentStep / totalSteps) * 100;
  }, []);

  return {
    isProfileComplete,
    validateStep,
    canProceed,
    calculateProgress,
  };
};