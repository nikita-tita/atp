import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Локальное хранилище пользователей (в реальном приложении это будет база данных)
const USERS_STORAGE_KEY = 'atp_users';
const TOKENS_STORAGE_KEY = 'atp_tokens';

// Интерфейсы для локального хранения
interface StoredUser {
  id: string;
  email: string;
  password: string; // В реальном приложении пароли хешируются
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller' | 'admin';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  companyName?: string;
  createdAt: string;
  subscription: {
    plan: 'basic' | 'professional' | 'corporate';
    expiresAt: string;
  };
}

interface StoredToken {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

// Утилиты для работы с локальным хранилищем
const getStoredUsers = (): StoredUser[] => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getStoredTokens = (): StoredToken[] => {
  const tokens = localStorage.getItem(TOKENS_STORAGE_KEY);
  return tokens ? JSON.parse(tokens) : [];
};

const saveStoredTokens = (tokens: StoredToken[]) => {
  localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
};

// Генерация ID и токенов
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateToken = () => Math.random().toString(36).substr(2, 20);
const generateRefreshToken = () => Math.random().toString(36).substr(2, 30);

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
    // Проверяем локальное хранилище
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    // Генерируем токены
    const token = generateToken();
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 часа

    // Сохраняем токен
    const tokens = getStoredTokens();
    tokens.push({
      userId: user.id,
      token,
      refreshToken,
      expiresAt
    });
    saveStoredTokens(tokens);

    // Возвращаем данные пользователя (без пароля)
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    // Проверяем, не существует ли уже пользователь с таким email
    const users = getStoredUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Создаем нового пользователя
    const newUser: StoredUser = {
      id: generateId(),
      email: userData.email,
      password: userData.password, // В реальном приложении пароль хешируется
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      verificationStatus: 'pending', // По умолчанию pending, но без подтверждения email
      companyName: userData.companyName,
      createdAt: new Date().toISOString(),
      subscription: {
        plan: 'basic',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 дней
      }
    };

    // Сохраняем пользователя
    users.push(newUser);
    saveStoredUsers(users);

    // Генерируем токены
    const token = generateToken();
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Сохраняем токен
    const tokens = getStoredTokens();
    tokens.push({
      userId: newUser.id,
      token,
      refreshToken,
      expiresAt
    });
    saveStoredTokens(tokens);

    // Возвращаем данные пользователя (без пароля)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }

    // Находим токен в хранилище
    const tokens = getStoredTokens();
    const tokenData = tokens.find(t => t.token === token);
    
    if (!tokenData) {
      throw new Error('Недействительный токен');
    }

    // Проверяем срок действия токена
    if (new Date(tokenData.expiresAt) < new Date()) {
      // Удаляем просроченный токен
      const updatedTokens = tokens.filter(t => t.token !== token);
      saveStoredTokens(updatedTokens);
      localStorage.removeItem('token');
      throw new Error('Токен истек');
    }

    // Находим пользователя
    const users = getStoredUsers();
    const user = users.find(u => u.id === tokenData.userId);
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Возвращаем данные пользователя (без пароля)
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async refreshToken(refreshToken: string) {
    const tokens = getStoredTokens();
    const tokenData = tokens.find(t => t.refreshToken === refreshToken);
    
    if (!tokenData) {
      throw new Error('Недействительный refresh token');
    }

    // Генерируем новые токены
    const newToken = generateToken();
    const newRefreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Обновляем токены
    const updatedTokens = tokens.map(t => 
      t.refreshToken === refreshToken 
        ? { ...t, token: newToken, refreshToken: newRefreshToken, expiresAt }
        : t
    );
    saveStoredTokens(updatedTokens);

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  },

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      // Удаляем токен из хранилища
      const tokens = getStoredTokens();
      const updatedTokens = tokens.filter(t => t.token !== token);
      saveStoredTokens(updatedTokens);
    }
    localStorage.removeItem('token');
  },

  async forgotPassword(email: string) {
    // В реальном приложении здесь будет отправка email
    const users = getStoredUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Пользователь с таким email не найден');
    }

    // Пока просто возвращаем успех
    return { message: 'Инструкции по сбросу пароля отправлены на email' };
  },

  async resetPassword(token: string, password: string) {
    // В реальном приложении здесь будет проверка токена и обновление пароля
    const users = getStoredUsers();
    // Логика сброса пароля...
    return { message: 'Пароль успешно изменен' };
  },

  // Дополнительные методы для отладки
  getStoredUsers() {
    return getStoredUsers();
  },

  clearStoredData() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(TOKENS_STORAGE_KEY);
    localStorage.removeItem('token');
  }
}; 