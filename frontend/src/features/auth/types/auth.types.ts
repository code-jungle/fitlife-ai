// ✅ OTIMIZADO: Tipos centralizados por feature
export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<ApiResponse<User>>;
  signUp: (email: string, password: string, fullName?: string) => Promise<ApiResponse<User>>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: AuthError | null;
}

// Re-export from supabase
export type { Session } from '@supabase/supabase-js';

