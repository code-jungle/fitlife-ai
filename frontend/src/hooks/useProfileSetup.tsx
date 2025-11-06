import { useReducer, useCallback, useMemo } from 'react';
import { ProfileFormData } from '@/types/profile';
import { useProfileValidation } from './useProfileValidation';

interface ProfileSetupState {
  currentStep: number;
  profileData: Partial<ProfileFormData>;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
}

type ProfileSetupAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_PROFILE_DATA'; payload: Partial<ProfileFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' };

const initialState: ProfileSetupState = {
  currentStep: 1,
  profileData: {},
  loading: false,
  error: null,
  isSubmitting: false,
};

// ✅ CORRIGIDO: useReducer para estado complexo
const profileSetupReducer = (state: ProfileSetupState, action: ProfileSetupAction): ProfileSetupState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_PROFILE_DATA':
      return { 
        ...state, 
        profileData: { ...state.profileData, ...action.payload },
        error: null // Clear error when updating data
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false, isSubmitting: false };
    
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    
    case 'RESET':
      return initialState;
    
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) };
    
    case 'PREVIOUS_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    
    default:
      return state;
  }
};

export const useProfileSetup = () => {
  const [state, dispatch] = useReducer(profileSetupReducer, initialState);
  const { validateStep, canProceed, calculateProgress } = useProfileValidation();

  // ✅ CORRIGIDO: useCallback para ações
  const setCurrentStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const updateProfileData = useCallback((data: Partial<ProfileFormData>) => {
    dispatch({ type: 'UPDATE_PROFILE_DATA', payload: data });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  // ✅ CORRIGIDO: useMemo para cálculos derivados
  const canProceedToNext = useMemo(() => {
    return canProceed(state.currentStep, state.profileData);
  }, [state.currentStep, state.profileData, canProceed]);

  const progress = useMemo(() => {
    return calculateProgress(state.currentStep, 4);
  }, [state.currentStep, calculateProgress]);

  const validationResult = useMemo(() => {
    return validateStep(state.currentStep, state.profileData);
  }, [state.currentStep, state.profileData, validateStep]);

  return {
    // State
    currentStep: state.currentStep,
    profileData: state.profileData,
    loading: state.loading,
    error: state.error,
    isSubmitting: state.isSubmitting,
    
    // Actions
    setCurrentStep,
    updateProfileData,
    setLoading,
    setError,
    setSubmitting,
    reset,
    nextStep,
    previousStep,
    
    // Computed values
    canProceedToNext,
    progress,
    validationResult,
  };
};

