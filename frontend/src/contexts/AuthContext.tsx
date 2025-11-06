import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import { UserRegister, UserLogin, UserProfile } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: UserLogin) => Promise<{ error: any | null }>;
  register: (data: UserRegister) => Promise<{ error: any | null }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: UserLogin): Promise<{ error: any | null }> => {
    try {
      setLoading(true);
      const tokenData = await api.login(credentials);
      
      // Save token
      localStorage.setItem('auth_token', tokenData.access_token);
      
      // Load user profile
      const profile = await api.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { 
        error: error.response?.data?.detail || 'Erro ao fazer login. Tente novamente.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: UserRegister): Promise<{ error: any | null }> => {
    try {
      setLoading(true);
      const tokenData = await api.register(data);
      
      // Save token
      localStorage.setItem('auth_token', tokenData.access_token);
      
      // Load user profile
      const profile = await api.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
      
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      return { 
        error: error.response?.data?.detail || 'Erro ao criar conta. Tente novamente.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated, 
        login, 
        register, 
        logout,
        refreshProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
