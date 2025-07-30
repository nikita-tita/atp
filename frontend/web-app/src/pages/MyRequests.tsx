import React, { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { contactService, ContactSellerRequest, ReserveClientRequest } from '../api/contact';
import toast from 'react-hot-toast';

const MyRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'reservations'>('contacts');
  const [contacts, setContacts] = useState<ContactSellerRequest[]>([]);
  const [reservations, setReservations] = useState<ReserveClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    respondedRequests: 0,
    averageResponseTime: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contactHistory, activeReservations, contactStats] = await Promise.all([
        contactService.getContactHistory(),
        contactService.getActiveReservations(),
        contactService.getContactStats()
      ]);
      
      setContacts(contactHistory);
      setReservations(activeReservations);
      setStats(contactStats);
    } catch (error) {
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await contactService.cancelReservation(reservationId);
      toast.success('Бронирование отменено');
      loadData(); // Перезагружаем данные
    } catch (error) {
      toast.error('Не удалось отменить бронирование');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'responded':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Мои запросы</h1>
          <p className="text-xl text-gray-600">
            Управляйте вашими запросами к продавцам и бронированиями клиентов
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <EnvelopeIcon className="w-8 h-8 text-black" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всего запросов</p>
                <p className="text-2xl font-bold text-black">{stats.totalRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ожидают ответа</p>
                <p className="text-2xl font-bold text-black">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Получены ответы</p>
                <p className="text-2xl font-bold text-black">{stats.respondedRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CalendarIcon className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Среднее время ответа</p>
                <p className="text-2xl font-bold text-black">{stats.averageResponseTime}ч</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'contacts'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                Запросы к продавцам ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reservations'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <PhoneIcon className="w-4 h-4 inline mr-2" />
                Бронирования клиентов ({reservations.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-12">
                    <EnvelopeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет запросов</h3>
                    <p className="text-gray-600">У вас пока нет запросов к продавцам</p>
                  </div>
                ) : (
                  contacts.map((contact, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon('pending')}
                          <div>
                            <h4 className="font-medium text-gray-900">Запрос #{index + 1}</h4>
                            <p className="text-sm text-gray-600">Отправлен {formatDate(new Date().toISOString())}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Продавец:</span>
                          <p className="font-medium">{contact.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Способ связи:</span>
                          <p className="font-medium capitalize">{contact.preferredContact}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Бюджет:</span>
                          <p className="font-medium">{contact.budget || 'Не указан'}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <PhoneIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет бронирований</h3>
                    <p className="text-gray-600">У вас пока нет активных бронирований клиентов</p>
                  </div>
                ) : (
                  reservations.map((reservation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Бронирование #{index + 1}</h4>
                            <p className="text-sm text-gray-600">Активно до {formatDate(new Date().toISOString())}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleCancelReservation(`reservation-${index}`)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Клиент:</span>
                          <p className="font-medium">{reservation.clientName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Комиссия:</span>
                          <p className="font-medium">{reservation.commission || '2.5'}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Период:</span>
                          <p className="font-medium">{reservation.exclusivityPeriod} дней</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Email клиента:</span>
                          <span className="font-medium">{reservation.clientEmail}</span>
                        </div>
                        {reservation.clientPhone && (
                          <div className="flex items-center justify-between text-sm mt-1">
                            <span className="text-gray-600">Телефон клиента:</span>
                            <span className="font-medium">{reservation.clientPhone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRequests; 