// ✅ OTIMIZADO: Barrel exports para feature
export { useAuth, AuthProvider } from './hooks/useAuth';
export { authService } from './services/authService';
export type { 
  User, 
  Session, 
  AuthContextType, 
  AuthProviderProps,
  LoginFormData,
  RegisterFormData,
  AuthError,
  ApiResponse
} from './types/auth.types';

