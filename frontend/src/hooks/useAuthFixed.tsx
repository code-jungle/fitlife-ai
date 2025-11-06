import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from './useErrorHandler';
import { ApiResponse } from '@/types/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<ApiResponse<User>>;
  signUp: (email: string, password: string, fullName?: string) => Promise<ApiResponse<User>>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError, handleAsyncError } = useErrorHandler();

  useEffect(() => {
    // Set up auth state listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        try {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (error) {
          handleError(error, 'AUTH_STATE_CHANGE', {
            showToast: false, // Don't show toast for state changes
            logError: true
          });
          setLoading(false);
        }
      }
    );

    // Check for existing session with error handling
    handleAsyncError(
      async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      },
      'GET_SESSION',
      {
        showToast: false, // Don't show toast for initial session check
        logError: true
      }
    );

    return () => subscription.unsubscribe();
  }, [handleError, handleAsyncError]);

  const signIn = async (email: string, password: string): Promise<ApiResponse<User>> => {
    return handleAsyncError(
      async () => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao FitLife AI",
        });

        return { data: data.user, error: null };
      },
      'SIGN_IN',
      {
        showToast: false, // Toast is handled in the success case
        logError: true,
        onError: (error) => {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    ) as Promise<ApiResponse<User>>;
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<ApiResponse<User>> => {
    return handleAsyncError(
      async () => {
        setLoading(true);
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
          throw error;
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Verifique seu email para confirmar a conta",
        });

        return { data: data.user, error: null };
      },
      'SIGN_UP',
      {
        showToast: false, // Toast is handled in the success case
        logError: true,
        onError: (error) => {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    ) as Promise<ApiResponse<User>>;
  };

  const signOut = async (): Promise<void> => {
    await handleAsyncError(
      async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw error;
        }

        toast({
          title: "Logout realizado com sucesso!",
          description: "Até logo!",
        });
      },
      'SIGN_OUT',
      {
        showToast: false, // Toast is handled in the success case
        logError: true,
        onError: (error) => {
          toast({
            title: "Erro ao sair",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

