// ✅ OTIMIZADO: Hook centralizado por feature
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, Session, AuthContextType, AuthProviderProps } from '../types/auth.types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    authService.getSession().then(({ data: { session }, error }) => {
      if (!error) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    
    if (result.error) {
      toast({
        title: "Erro no login",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao FitLife AI",
      });
    }
    
    return result;
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const result = await authService.signUp(email, password, fullName);
    
    if (result.error) {
      toast({
        title: "Erro no cadastro",
        description: result.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta",
      });
    }
    
    return result;
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até logo!",
      });
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível fazer logout",
        variant: "destructive",
      });
    }
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

