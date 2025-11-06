// ✅ OTIMIZADO: Configurações centralizadas
export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
    retries: 3,
  },
  app: {
    name: 'FitLife AI',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  },
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableErrorReporting: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
    enablePerformanceMonitoring: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  },
  ui: {
    theme: {
      default: 'dark',
      available: ['light', 'dark', 'system'],
    },
    language: {
      default: 'pt-BR',
      available: ['pt-BR', 'en-US'],
    },
  },
  storage: {
    keys: {
      auth: 'fitlife_auth',
      theme: 'fitlife_theme',
      language: 'fitlife_language',
      preferences: 'fitlife_preferences',
    },
  },
  routes: {
    public: ['/', '/login', '/register'],
    protected: ['/dashboard', '/profile', '/workouts', '/nutrition', '/goals'],
    admin: ['/admin'],
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxWorkoutPlans: 50,
    maxNutritionPlans: 50,
    maxGoals: 20,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 25, 50, 100],
  },
  performance: {
    debounceDelay: 300,
    throttleDelay: 1000,
    virtualScrollThreshold: 100,
    imageLazyLoadThreshold: 200,
  },
} as const;

export type Config = typeof config;

