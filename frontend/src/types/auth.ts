export interface UserRegister {
  email: string;
  password: string;
  full_name: string;
  age: number;
  weight: number;
  height: number;
  objectives: string;
  dietary_restrictions?: string;
  training_type: 'academia' | 'casa' | 'ar_livre';
  current_activities?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  age: number;
  weight: number;
  height: number;
  objectives: string;
  dietary_restrictions?: string;
  training_type: string;
  current_activities?: string;
  bmi: number;
  bmi_category: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  full_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  objectives?: string;
  dietary_restrictions?: string;
  training_type?: 'academia' | 'casa' | 'ar_livre';
  current_activities?: string;
}

export interface Suggestion {
  id: string;
  type: 'workout' | 'nutrition';
  content: string;
  created_at: string;
}

export interface SuggestionsHistory {
  workouts: Suggestion[];
  nutrition: Suggestion[];
}
