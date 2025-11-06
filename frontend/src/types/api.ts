export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
}

export interface AuthResponse {
  user: any; // Supabase User type
  error: ApiError | null;
}

export interface SupabaseError {
  message: string;
  code: string;
  details?: string;
  hint?: string;
}

