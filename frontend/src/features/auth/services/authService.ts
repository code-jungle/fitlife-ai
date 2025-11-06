// ✅ OTIMIZADO: Service centralizado por feature
import { supabase } from '@/integrations/supabase/client';
import { User, Session, ApiResponse, AuthError } from '../types/auth.types';

class AuthService {
  async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { 
          data: null, 
          error: { message: error.message, code: error.message } 
        };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          code: 'UNKNOWN_ERROR'
        } 
      };
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<ApiResponse<User>> {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { 
          data: null, 
          error: { message: error.message, code: error.message } 
        };
      }

      return { data: data.user, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          code: 'UNKNOWN_ERROR'
        } 
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async getSession(): Promise<{ data: { session: Session | null }, error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    } catch (error) {
      return { 
        data: { session: null }, 
        error: { 
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          code: 'UNKNOWN_ERROR'
        } 
      };
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();

