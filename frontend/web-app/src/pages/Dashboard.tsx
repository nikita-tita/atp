import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BellIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = [
    { name: 'Активные объявления', value: '3', change: '+12%', changeType: 'positive' },
    { name: 'Просмотры за месяц', value: '1,234', change: '+8%', changeType: 'positive' },
    { name: 'Входящие сообщения', value: '15', change: '+23%', changeType: 'positive' },
    { name: 'Забронированные клиенты', value: '7', change: '+5%', changeType: 'positive' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'listing',
      title: 'Boeing 737-800 обновлено',
      description: 'Объявление обновлено с новой информацией',
      time: '2 часа назад',
      status: 'success',
    },
    {
      id: 2,
      type: 'message',
      title: 'Новое сообщение от покупателя',
      description: 'Получено сообщение по объявлению Airbus A320',
      time: '4 часа назад',
      status: 'info',
    },
    {
      id: 3,
      type: 'verification',
      title: 'Верификация завершена',
      description: 'Ваш аккаунт успешно верифицирован',
      time: '1 день назад',
      status: 'success',
    },
  ];

  const myListings = [
    {
      id: '1',
      title: 'Boeing 737-800 for Sale',
      status: 'active',
      views: 156,
      inquiries: 8,
      price: 25000000,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    },
    {
      id: '2',
      title: 'Airbus A320neo',
      status: 'pending',
      views: 89,
      inquiries: 3,
      price: 35000000,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: ChartBarIcon },
    { id: 'listings', name: 'Мои объявления', icon: DocumentTextIcon },
    { id: 'messages', name: 'Сообщения', icon: BellIcon },
    { id: 'verification', name: 'Верификация', icon: UserIcon },
    { id: 'billing', name: 'Биллинг', icon: CreditCardIcon },
    { id: 'settings', name: 'Настройки', icon: Cog6ToothIcon },
  ];

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активно';
      case 'pending':
        return 'На модерации';
      case 'inactive':
        return 'Неактивно';
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
          <p className="text-gray-600">
            Добро пожаловать, {user?.firstName} {user?.lastName}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-aviation-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-aviation-600" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user?.verificationStatus === 'verified' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.verificationStatus === 'verified' ? 'Проверен' : 'На проверке'}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-aviation-100 text-aviation-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Последняя активность</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            activity.status === 'success' ? 'bg-green-400' :
                            activity.status === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Мои объявления</h2>
                  <button className="bg-aviation-600 hover:bg-aviation-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Добавить объявление
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                            {getStatusText(listing.status)}
                          </span>
                        </div>
                        
                        <div className="text-2xl font-bold text-aviation-600 mb-4">
                          {formatPrice(listing.price, listing.currency)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">{listing.views}</span> просмотров
                          </div>
                          <div>
                            <span className="font-medium">{listing.inquiries}</span> запросов
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center">
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Просмотр
                          </button>
                          <button className="flex-1 bg-aviation-100 hover:bg-aviation-200 text-aviation-700 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center">
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Редактировать
                          </button>
                          <button className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-md text-sm font-medium">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Сообщения</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Здесь будут отображаться ваши сообщения</p>
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Верификация</h3>
                </div>
                <div className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Верификация завершена
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ваш аккаунт успешно прошел проверку. Теперь вы можете использовать все функции платформы.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="text-sm text-green-800">
                        <strong>Статус:</strong> Проверен ✓
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Биллинг</h3>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Текущий план</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.subscription.plan === 'basic' && 'Базовый план'}
                            {user?.subscription.plan === 'professional' && 'Профессиональный план'}
                            {user?.subscription.plan === 'corporate' && 'Корпоративный план'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Истекает: {new Date(user?.subscription.expiresAt || '').toLocaleDateString()}
                          </p>
                        </div>
                        <button className="bg-aviation-600 hover:bg-aviation-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Обновить план
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">История платежей</h4>
                    <p className="text-gray-600">Здесь будет отображаться история ваших платежей</p>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Настройки</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Здесь будут настройки вашего аккаунта</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 