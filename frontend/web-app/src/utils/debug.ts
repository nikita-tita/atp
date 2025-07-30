// Утилиты для отладки и просмотра данных
import { authApi } from '../api/auth';

export const debugUtils = {
  // Показать всех зарегистрированных пользователей
  showUsers: () => {
    const users = authApi.getStoredUsers();
    console.log('=== ЗАРЕГИСТРИРОВАННЫЕ ПОЛЬЗОВАТЕЛИ ===');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Роль: ${user.role}`);
      console.log(`   Статус: ${user.verificationStatus}`);
      console.log(`   Компания: ${user.companyName || 'Не указана'}`);
      console.log(`   Дата регистрации: ${new Date(user.createdAt).toLocaleString()}`);
      console.log('---');
    });
    return users;
  },

  // Очистить все данные
  clearAllData: () => {
    authApi.clearStoredData();
    console.log('Все данные очищены');
  },

  // Создать тестового пользователя
  createTestUser: () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Тест',
      lastName: 'Пользователь',
      role: 'buyer' as const,
      companyName: undefined
    };

    try {
      authApi.register(testUser);
      console.log('Тестовый пользователь создан:', testUser.email);
    } catch (error) {
      console.log('Ошибка создания тестового пользователя:', error);
    }
  },

  // Создать тестового продавца
  createTestSeller: () => {
    const testSeller = {
      email: 'seller@example.com',
      password: 'password123',
      firstName: 'Александр',
      lastName: 'Петров',
      role: 'seller' as const,
      companyName: 'ООО АвиаТрейд'
    };

    try {
      authApi.register(testSeller);
      console.log('Тестовый продавец создан:', testSeller.email);
    } catch (error) {
      console.log('Ошибка создания тестового продавца:', error);
    }
  },

  // Проверить текущий токен
  checkCurrentToken: () => {
    const token = localStorage.getItem('token');
    console.log('Текущий токен:', token ? 'Есть' : 'Нет');
    return token;
  },

  // Автоматически войти как тестовый пользователь
  autoLoginTestUser: () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123'
    };

    try {
      authApi.login(testUser.email, testUser.password);
      console.log('Автоматический вход выполнен:', testUser.email);
      window.location.href = '/dashboard';
    } catch (error) {
      console.log('Ошибка автоматического входа:', error);
    }
  },

  // Автоматически войти как тестовый продавец
  autoLoginTestSeller: () => {
    const testSeller = {
      email: 'seller@example.com',
      password: 'password123'
    };

    try {
      authApi.login(testSeller.email, testSeller.password);
      console.log('Автоматический вход выполнен:', testSeller.email);
      window.location.href = '/dashboard';
    } catch (error) {
      console.log('Ошибка автоматического входа:', error);
    }
  }
};

// Добавляем в глобальный объект для доступа из консоли браузера
if (typeof window !== 'undefined') {
  (window as unknown as { debugUtils: typeof debugUtils }).debugUtils = debugUtils;
  console.log('🔧 Утилиты отладки доступны в window.debugUtils');
  console.log('📋 Команды:');
  console.log('  debugUtils.showUsers() - показать всех пользователей');
  console.log('  debugUtils.clearAllData() - очистить все данные');
  console.log('  debugUtils.createTestUser() - создать тестового пользователя');
  console.log('  debugUtils.createTestSeller() - создать тестового продавца');
  console.log('  debugUtils.checkCurrentToken() - проверить текущий токен');
  console.log('  debugUtils.autoLoginTestUser() - войти как тестовый пользователь');
  console.log('  debugUtils.autoLoginTestSeller() - войти как тестовый продавец');
} 