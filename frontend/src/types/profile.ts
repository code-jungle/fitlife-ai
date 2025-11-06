export interface ProfileFormData {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitness_goal: 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'improve_endurance' | 'general_fitness';
  gym_days_per_week: number;
  dietary_restrictions: string[];
  allergies: string[];
}

export interface ProfileStepProps {
  data: Partial<ProfileFormData>;
  updateData: (data: Partial<ProfileFormData>) => void;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'improve_endurance' | 'general_fitness';
export type Gender = 'male' | 'female' | 'other';

