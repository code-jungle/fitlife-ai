import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProfileFormData } from '@/types/profile';

interface ProfileContextType {
  // Profile data
  profileData: Partial<ProfileFormData>;
  setProfileData: (data: Partial<ProfileFormData>) => void;
  updateProfileData: (updates: Partial<ProfileFormData>) => void;
  
  // Profile state
  isProfileComplete: boolean;
  profileLoading: boolean;
  profileError: string | null;
  
  // Profile actions
  saveProfile: () => Promise<void>;
  resetProfile: () => void;
  validateProfile: () => { isValid: boolean; message?: string };
  
  // Step management
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  canProceed: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

interface ProfileProviderProps {
  children: ReactNode;
  initialStep?: number;
}

export const ProfileProvider = ({ children, initialStep = 1 }: ProfileProviderProps) => {
  const { user } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  
  const [profileData, setProfileData] = useState<Partial<ProfileFormData>>({});
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Initialize profile data from existing profile
  useEffect(() => {
    if (profile && !profileData.age) {
      setProfileData({
        age: profile.age || 0,
        gender: profile.gender || "other",
        height: profile.height || 0,
        weight: profile.weight || 0,
        activity_level: profile.activity_level || "moderate",
        fitness_goal: profile.fitness_goal || "general_fitness",
        gym_days_per_week: profile.gym_days_per_week || 0,
        dietary_restrictions: profile.dietary_restrictions || [],
        allergies: profile.allergies || [],
      });
    }
  }, [profile, profileData.age]);

  const updateProfileData = (updates: Partial<ProfileFormData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const isProfileComplete = Boolean(
    profileData.age &&
    profileData.gender &&
    profileData.height &&
    profileData.weight &&
    profileData.activity_level &&
    profileData.fitness_goal &&
    profileData.gym_days_per_week
  );

  const validateProfile = (): { isValid: boolean; message?: string } => {
    if (!profileData.age || !profileData.gender || !profileData.height || !profileData.weight) {
      return { isValid: false, message: "Informações pessoais são obrigatórias" };
    }
    if (!profileData.activity_level || !profileData.gym_days_per_week) {
      return { isValid: false, message: "Nível de atividade é obrigatório" };
    }
    if (!profileData.fitness_goal) {
      return { isValid: false, message: "Objetivo fitness é obrigatório" };
    }
    return { isValid: true };
  };

  const saveProfile = async () => {
    if (!user || !validateProfile().isValid) return;
    
    try {
      setProfileError(null);
      await updateProfile({
        age: profileData.age as number,
        gender: profileData.gender as any,
        height: profileData.height as number,
        weight: profileData.weight as number,
        activity_level: profileData.activity_level as any,
        fitness_goal: profileData.fitness_goal as any,
        gym_days_per_week: profileData.gym_days_per_week as number,
        dietary_restrictions: profileData.dietary_restrictions || [],
        allergies: profileData.allergies || [],
      });
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Erro ao salvar perfil');
    }
  };

  const resetProfile = () => {
    setProfileData({});
    setCurrentStep(1);
    setProfileError(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const canProceed = validateProfile().isValid;

  const value: ProfileContextType = {
    profileData,
    setProfileData,
    updateProfileData,
    isProfileComplete,
    profileLoading,
    profileError,
    saveProfile,
    resetProfile,
    validateProfile,
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep,
    canProceed,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
