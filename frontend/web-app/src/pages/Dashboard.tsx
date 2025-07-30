import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BellIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import AircraftFormModal from '../components/AircraftFormModal';
import ComplianceDetailModal from '../components/ComplianceDetailModal';
import ChatModal from '../components/ChatModal';
import type { AircraftFormData, ComplianceRequest } from '../types';

// Интерфейсы для mock данных
interface ListingData {
  id: string;
  title: string;
  status: string;
  views: number;
  inquiries: number;
  price: number;
  currency: string;
  image: string;
  complianceRequests: number;
  reservations: number;
}

interface ComplianceData {
  id: string;
  aircraft: string;
  buyer: string;
  status: string;
  date: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    company: '',
    position: '',
    location: '',
    bio: ''
  });

  // States for modals
  const [isAircraftFormOpen, setIsAircraftFormOpen] = useState(false);
  const [isComplianceDetailOpen, setIsComplianceDetailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<AircraftFormData | null>(null);
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceRequest | null>(null);
  const [aircraftFormMode, setAircraftFormMode] = useState<'add' | 'edit'>('add');

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
      action: 'view',
    },
    {
      id: 2,
      type: 'message',
      title: 'Новое сообщение от покупателя',
      description: 'Получено сообщение по объявлению Airbus A320',
      time: '4 часа назад',
      status: 'info',
      action: 'reply',
    },
    {
      id: 3,
      type: 'verification',
      title: 'Верификация завершена',
      description: 'Ваш аккаунт успешно верифицирован',
      time: '1 день назад',
      status: 'success',
      action: 'view',
    },
    {
      id: 4,
      type: 'compliance',
      title: 'Заявка на комплаенс отправлена',
      description: 'Заявка на проверку для Gulfstream G650',
      time: '2 дня назад',
      status: 'pending',
      action: 'track',
    },
  ];

  const myListings: ListingData[] = [
    {
      id: '1',
      title: 'Boeing 737-800 for Sale',
      status: 'active',
      views: 156,
      inquiries: 8,
      price: 25000000,
      currency: 'USD',
      image: '/images/Bombardier-Global-6000-sales-01-1536x771.jpg.webp',
      complianceRequests: 3,
      reservations: 2,
    },
    {
      id: '2',
      title: 'Airbus A320neo',
      status: 'pending',
      views: 89,
      inquiries: 3,
      price: 35000000,
      currency: 'USD',
      image: '/images/Global Express Jet_0.jpg',
      complianceRequests: 1,
      reservations: 0,
    },
  ];

  const complianceRequests: ComplianceData[] = [
    {
      id: '1',
      aircraft: 'Gulfstream G650',
      buyer: 'Иван Петров',
      status: 'approved',
      date: '2024-01-15',
      price: 45000000,
    },
    {
      id: '2',
      aircraft: 'Bombardier Global 6000',
      buyer: 'Алексей Сидоров',
      status: 'pending',
      date: '2024-01-14',
      price: 38000000,
    },
  ];

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: ChartBarIcon },
    { id: 'listings', name: 'Мои объявления', icon: DocumentTextIcon },
    { id: 'compliance', name: 'Комплаенс', icon: ShieldCheckIcon },
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
      case 'approved':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      default:
        return status;
    }
  };

  const handleProfileSave = () => {
    // Обновляем данные пользователя в контексте
    if (user) {
      const updatedUser = {
        ...user,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        position: profileData.position,
        location: profileData.location,
        bio: profileData.bio
      };
      updateUser(updatedUser);
    }
    
    // В реальном приложении здесь будет отправка на сервер
    toast.success('Профиль успешно обновлен');
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setProfileData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '',
      company: '',
      position: '',
      location: '',
      bio: ''
    });
    setIsEditingProfile(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Aircraft management functions
  const handleAddAircraft = () => {
    setAircraftFormMode('add');
    setEditingAircraft(null);
    setIsAircraftFormOpen(true);
  };

  const handleEditAircraft = (aircraft: ListingData) => {
    setAircraftFormMode('edit');
    // Преобразуем ListingData в AircraftFormData
    const aircraftFormData: AircraftFormData = {
      manufacturer: 'Boeing',
      model: aircraft.title.split(' ')[1] || '',
      series: '',
      registration: '',
      year: 2020,
      ttaf: 0,
      landings: 0,
      price: aircraft.price.toString(),
      currency: aircraft.currency,
      location: '',
      mtow: '',
      engines: 2,
      engineType: '',
      maintenancePlan: '',
      interior: '',
      passengers: 0,
      color: '',
      description: '',
      images: [aircraft.image],
      documents: []
    };
    setEditingAircraft(aircraftFormData);
    setIsAircraftFormOpen(true);
  };

  const handleDeleteAircraft = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      // В реальном приложении здесь будет API вызов
      toast.success('Объявление удалено');
    }
  };

  const handleSaveAircraft = (aircraftData: AircraftFormData) => {
    if (aircraftFormMode === 'add') {
      // Добавление нового объявления
      toast.success('Объявление добавлено!');
    } else {
      // Обновление существующего объявления
      toast.success('Объявление обновлено!');
    }
    setIsAircraftFormOpen(false);
    setEditingAircraft(null);
  };

  // Compliance management functions
  const handleViewCompliance = (compliance: ComplianceData) => {
    // Преобразуем ComplianceData в ComplianceRequest
    const complianceRequest: ComplianceRequest = {
      id: compliance.id,
      aircraftId: '1',
      aircraftTitle: compliance.aircraft,
      aircraftPrice: compliance.price.toString(),
      status: compliance.status as 'pending' | 'approved' | 'rejected' | 'in_review',
      createdAt: compliance.date,
      updatedAt: compliance.date,
      buyerName: compliance.buyer,
      buyerEmail: 'buyer@example.com',
      buyerPhone: '+7 (999) 123-45-67',
      buyerCompany: 'ООО Покупатель',
      buyerPosition: 'Директор',
      brokerName: 'Иван Брокер',
      brokerEmail: 'broker@example.com',
      brokerPhone: '+7 (999) 987-65-43',
      brokerCompany: 'ООО Брокер',
      brokerLicense: 'LIC-123456',
      brokerExperience: '5 лет',
      budget: compliance.price.toString(),
      financing: false,
      cashAvailable: true,
      letterOfIntent: true,
      proofOfFunds: true,
      timeline: '3 месяца',
      inspection: true,
      nda: true,
      terms: true,
      documents: [],
      comments: []
    };
    setSelectedCompliance(complianceRequest);
    setIsComplianceDetailOpen(true);
  };

  const handleComplianceStatusChange = (id: string, status: 'approved' | 'rejected') => {
    // В реальном приложении здесь будет API вызов
    toast.success(`Заявка ${status === 'approved' ? 'одобрена' : 'отклонена'}`);
    setIsComplianceDetailOpen(false);
    setSelectedCompliance(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Личный кабинет</h1>
          <p className="text-gray-600">
            Добро пожаловать, {user?.firstName} {user?.lastName}!
          </p>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-3">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-1" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-8 h-8 text-white" />
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
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user?.role === 'buyer' ? 'Покупатель' : 'Продавец'}
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
                        ? 'bg-black text-white'
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
                            activity.status === 'info' ? 'bg-blue-400' : 
                            activity.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                          <button className="text-xs text-black hover:text-gray-700 font-medium">
                            {activity.action === 'view' && 'Просмотр'}
                            {activity.action === 'reply' && 'Ответить'}
                            {activity.action === 'track' && 'Отследить'}
                          </button>
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
                  <button 
                    onClick={handleAddAircraft}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
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
                        
                        <div className="text-2xl font-bold text-black mb-4">
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

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">{listing.complianceRequests}</span> комплаенс-запросов
                          </div>
                          <div>
                            <span className="font-medium">{listing.reservations}</span> бронирований
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/listing/${listing.id}`)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center"
                          >
                            <EyeIcon className="w-4 h-4 mr-1" />
                            Просмотр
                          </button>
                          <button 
                            onClick={() => handleEditAircraft(listing)}
                            className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center"
                          >
                            <PencilIcon className="w-4 h-4 mr-1" />
                            Редактировать
                          </button>
                          <button 
                            onClick={() => handleDeleteAircraft(listing.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-md text-sm font-medium"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Комплаенс-запросы</h2>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Активные запросы</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {complianceRequests.map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{request.aircraft}</h4>
                              <p className="text-sm text-gray-600">Покупатель: {request.buyer}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              Дата: {new Date(request.date).toLocaleDateString()}
                            </div>
                            <div className="text-lg font-semibold text-black">
                              {formatPrice(request.price, 'USD')}
                            </div>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button 
                              onClick={() => handleViewCompliance(request)}
                              className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded text-sm"
                            >
                              Просмотреть детали
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleComplianceStatusChange(request.id, 'approved')}
                                  className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded text-sm"
                                >
                                  Одобрить
                                </button>
                                <button 
                                  onClick={() => handleComplianceStatusChange(request.id, 'rejected')}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
                                >
                                  Отклонить
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
                  <button 
                    onClick={() => setIsChatOpen(true)}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    <BellIcon className="w-4 h-4 mr-2" />
                    Открыть чат
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Последние сообщения</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setIsChatOpen(true)}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Иван Петров</h4>
                            <p className="text-sm text-gray-600">Boeing 737-800 for Sale</p>
                            <p className="text-sm text-gray-500">Спасибо! А когда можно организовать осмотр?</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">15 мин назад</span>
                          <div className="mt-1">
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-black rounded-full">
                              1
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setIsChatOpen(true)}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Мария Козлова</h4>
                            <p className="text-sm text-gray-600">Airbus A320neo</p>
                            <p className="text-sm text-gray-500">2018 год выпуска, TTAF 12,000 часов. Самолет практически новый.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">1 час назад</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
                      <CheckCircleIcon className="w-8 h-8 text-green-600" />
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
                      <div className="text-sm text-green-800 mt-1">
                        <strong>Дата проверки:</strong> {new Date().toLocaleDateString()}
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
                        <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                          Обновить план
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">История платежей</h4>
                    <div className="text-center py-8">
                      <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">История платежей пока пуста</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Настройки профиля</h3>
                </div>
                <div className="p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Имя *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditingProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Фамилия *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditingProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                      />
                    </div>

                    {user?.role === 'seller' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Компания
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={profileData.company}
                          onChange={handleInputChange}
                          disabled={!isEditingProfile}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Должность
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={profileData.position}
                        onChange={handleInputChange}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Местоположение
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        О себе
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        disabled={!isEditingProfile}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black disabled:bg-gray-50"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      {!isEditingProfile ? (
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium"
                        >
                          Редактировать профиль
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleProfileCancel}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium"
                          >
                            Отмена
                          </button>
                          <button
                            type="button"
                            onClick={handleProfileSave}
                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium"
                          >
                            Сохранить
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aircraft Form Modal */}
      <AircraftFormModal
        isOpen={isAircraftFormOpen}
        onClose={() => {
          setIsAircraftFormOpen(false);
          setEditingAircraft(null);
        }}
        onSave={handleSaveAircraft}
        aircraft={editingAircraft}
        mode={aircraftFormMode}
      />

      {/* Compliance Detail Modal */}
      {selectedCompliance && (
        <ComplianceDetailModal
          isOpen={isComplianceDetailOpen}
          onClose={() => {
            setIsComplianceDetailOpen(false);
            setSelectedCompliance(null);
          }}
          compliance={selectedCompliance}
          onStatusChange={handleComplianceStatusChange}
        />
      )}

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUserId={user?.id || ''}
        currentUserRole={(user?.role === 'admin' ? 'buyer' : user?.role) || 'buyer'}
      />
    </div>
  );
};

export default Dashboard; 