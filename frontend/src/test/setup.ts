import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

// Mock do Gemini Service
vi.mock('@/services/geminiService', () => ({
  geminiService: {
    generateWorkoutPlan: vi.fn(),
    generateNutritionPlan: vi.fn(),
    generateGoalSuggestions: vi.fn(),
  },
}))

// Mock do React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => {
    const React = require('react')
    return React.createElement('a', { href: to }, children)
  },
}))

// Mock do React Query
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}))

// Mock do toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  }),
}))

// Mock do environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_GEMINI_API_KEY: 'test-api-key',
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  },
  writable: true,
})

// Mock do localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock do console para evitar logs nos testes
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}
