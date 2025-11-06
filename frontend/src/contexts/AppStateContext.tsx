import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingState {
  profile: boolean;
  workouts: boolean;
  nutrition: boolean;
  goals: boolean;
  general: boolean;
}

interface ErrorState {
  message: string | null;
  code?: string;
  details?: string;
}

interface AppStateContextType {
  // Loading states
  loading: LoadingState;
  setLoading: (key: keyof LoadingState, value: boolean) => void;
  setAllLoading: (value: boolean) => void;
  isLoading: (key?: keyof LoadingState) => boolean;
  
  // Error states
  error: ErrorState;
  setError: (error: ErrorState | null) => void;
  clearError: () => void;
  
  // Global UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Notification state
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
  }>;
  addNotification: (notification: Omit<AppStateContextType['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  const [loading, setLoadingState] = useState<LoadingState>({
    profile: false,
    workouts: false,
    nutrition: false,
    goals: false,
    general: false,
  });

  const [error, setErrorState] = useState<ErrorState>({
    message: null,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState<AppStateContextType['notifications']>([]);

  const setLoading = (key: keyof LoadingState, value: boolean) => {
    setLoadingState(prev => ({ ...prev, [key]: value }));
  };

  const setAllLoading = (value: boolean) => {
    setLoadingState({
      profile: value,
      workouts: value,
      nutrition: value,
      goals: value,
      general: value,
    });
  };

  const isLoading = (key?: keyof LoadingState) => {
    if (key) {
      return loading[key];
    }
    return Object.values(loading).some(Boolean);
  };

  const setError = (error: ErrorState | null) => {
    setErrorState(error || { message: null });
  };

  const clearError = () => {
    setErrorState({ message: null });
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const addNotification = (notification: Omit<AppStateContextType['notifications'][0], 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    setNotifications(prev => [...prev, { ...notification, id, timestamp }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: AppStateContextType = {
    loading,
    setLoading,
    setAllLoading,
    isLoading,
    error,
    setError,
    clearError,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    theme,
    setTheme,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

