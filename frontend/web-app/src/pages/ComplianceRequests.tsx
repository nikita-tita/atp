import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { complianceService, ComplianceStatus } from '../api/compliance';
import toast from 'react-hot-toast';

const ComplianceRequests: React.FC = () => {
  const [requests, setRequests] = useState<ComplianceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    averageReviewTime: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [history, complianceStats] = await Promise.all([
        complianceService.getComplianceHistory(),
        complianceService.getComplianceStats()
      ]);
      
      setRequests(history);
      setStats(complianceStats);
    } catch (error) {
      toast.error('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await complianceService.cancelComplianceRequest(requestId);
      toast.success('Заявка отменена');
      loadData(); // Перезагружаем данные
    } catch (error) {
      toast.error('Не удалось отменить заявку');
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
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'На рассмотрении';
      case 'approved':
        return 'Одобрено';
      case 'rejected':
        return 'Отклонено';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-4xl font-bold text-black mb-4">Комплаенс-заявки</h1>
          <p className="text-xl text-gray-600">
            Управляйте вашими заявками на комплаенс-проверку и доступ к контактам продавцов
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <DocumentTextIcon className="w-8 h-8 text-black" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Всего заявок</p>
                <p className="text-2xl font-bold text-black">{stats.totalRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">На рассмотрении</p>
                <p className="text-2xl font-bold text-black">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Одобрено</p>
                <p className="text-2xl font-bold text-black">{stats.approvedRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <XCircleIcon className="w-8 h-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Отклонено</p>
                <p className="text-2xl font-bold text-black">{stats.rejectedRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Среднее время</p>
                <p className="text-2xl font-bold text-black">{stats.averageReviewTime}ч</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">История заявок</h2>
          </div>

          <div className="p-6">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заявок</h3>
                <p className="text-gray-600">У вас пока нет комплаенс-заявок</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request, index) => (
                  <div key={request.requestId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <h4 className="font-medium text-gray-900">Заявка #{index + 1}</h4>
                          <p className="text-sm text-gray-600">
                            Отправлена {formatDate(request.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                        {request.status === 'pending' && (
                          <button 
                            onClick={() => handleCancelRequest(request.requestId)}
                            className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {request.reviewedAt && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Рассмотрена:</strong> {formatDate(request.reviewedAt)}
                        </p>
                        {request.reviewerNotes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Комментарий:</strong> {request.reviewerNotes}
                          </p>
                        )}
                      </div>
                    )}

                    {request.status === 'approved' && request.sellerContacts && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="text-sm font-medium text-green-800 mb-2">Контакты продавца:</h5>
                        <div className="space-y-1 text-sm text-green-700">
                          <p><strong>Имя:</strong> {request.sellerContacts.name}</p>
                          <p><strong>Email:</strong> {request.sellerContacts.email}</p>
                          <p><strong>Телефон:</strong> {request.sellerContacts.phone}</p>
                        </div>
                      </div>
                    )}

                    {request.status === 'rejected' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                          <div>
                            <h5 className="text-sm font-medium text-red-800 mb-1">Заявка отклонена</h5>
                            <p className="text-sm text-red-700">
                              {request.reviewerNotes || 'Заявка не прошла комплаенс-проверку. Пожалуйста, исправьте указанные замечания и подайте заявку повторно.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceRequests; 