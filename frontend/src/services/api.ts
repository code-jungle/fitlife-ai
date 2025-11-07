import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  UserRegister, 
  UserLogin, 
  AuthToken, 
  UserProfile, 
  ProfileUpdate,
  Suggestion,
  SuggestionsHistory
} from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://fitgenai.preview.emergentagent.com';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTH ====================

  async register(data: UserRegister): Promise<AuthToken> {
    const response = await this.client.post<AuthToken>('/api/auth/register', data);
    return response.data;
  }

  async login(data: UserLogin): Promise<AuthToken> {
    const response = await this.client.post<AuthToken>('/api/auth/login', data);
    return response.data;
  }

  // ==================== PROFILE ====================

  async getProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>('/api/profile');
    return response.data;
  }

  async updateProfile(data: ProfileUpdate): Promise<UserProfile> {
    const response = await this.client.put<UserProfile>('/api/profile', data);
    return response.data;
  }

  async deleteAccount(): Promise<void> {
    await this.client.delete('/api/user');
  }

  // ==================== SUGGESTIONS ====================

  async generateWorkout(): Promise<Suggestion> {
    const response = await this.client.post<Suggestion>('/api/suggestions/workout');
    return response.data;
  }

  async generateNutrition(): Promise<Suggestion> {
    const response = await this.client.post<Suggestion>('/api/suggestions/nutrition');
    return response.data;
  }

  async getSuggestionsHistory(): Promise<SuggestionsHistory> {
    const response = await this.client.get<SuggestionsHistory>('/api/suggestions/history');
    return response.data;
  }

  async deleteSuggestion(suggestionId: string): Promise<void> {
    await this.client.delete(`/api/suggestions/${suggestionId}`);
  }

  // ==================== PAYMENTS ====================

  async createCheckoutSession(packageId: string, originUrl: string): Promise<{ url: string; session_id: string }> {
    const response = await this.client.post('/api/payments/checkout', {
      package_id: packageId,
      origin_url: originUrl
    });
    return response.data;
  }

  async getCheckoutStatus(sessionId: string): Promise<any> {
    const response = await this.client.get(`/api/payments/checkout/status/${sessionId}`);
    return response.data;
  }

  async getSubscriptionStatus(): Promise<any> {
    const response = await this.client.get('/api/subscription/status');
    return response.data;
  }

  async getSubscriptionPackages(): Promise<{ packages: any[] }> {
    const response = await this.client.get('/api/subscription/packages');
    return response.data;
  }

  // ==================== HEALTH ====================

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/api/health');
    return response.data;
  }
}

export const api = new ApiService();
