// ✅ OTIMIZADO: Service centralizado para API
import { ApiResponse, ApiError } from '../types/common.types';

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'Erro na requisição',
          code: data.code || 'REQUEST_ERROR',
          statusCode: response.status,
          details: data.details,
        };

        return {
          data: null,
          error,
          success: false,
        };
      }

      return {
        data: data.data || data,
        error: null,
        success: true,
      };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        code: 'NETWORK_ERROR',
        details: 'Erro de rede ou conexão',
      };

      return {
        data: null,
        error: apiError,
        success: false,
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  setBaseURL(url: string) {
    this.baseURL = url;
  }
}

export const apiService = new ApiService();

