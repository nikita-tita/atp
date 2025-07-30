import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Создаем axios инстанс с базовой конфигурацией
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'buyer' | 'seller' | 'admin';
    verificationStatus: 'pending' | 'verified' | 'rejected';
    subscription: {
      plan: 'basic' | 'professional' | 'corporate';
      expiresAt: string;
    };
  };
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller';
  companyName?: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'buyer' | 'seller' | 'admin';
    verificationStatus: 'pending' | 'verified' | 'rejected';
    subscription: {
      plan: 'basic' | 'professional' | 'corporate';
      expiresAt: string;
    };
  };
  token: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/api/auth/refresh', { refreshToken });
    return response.data;
  },

  async logout() {
    await apiClient.post('/api/auth/logout');
  },

  async forgotPassword(email: string) {
    await apiClient.post('/api/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string) {
    await apiClient.post('/api/auth/reset-password', { token, password });
  },
}; 