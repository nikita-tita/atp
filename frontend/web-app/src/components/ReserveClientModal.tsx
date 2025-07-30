import React, { useState } from 'react';
import { XMarkIcon, UserIcon, CalendarIcon, ShieldCheckIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ReserveClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  aircraft: {
    title: string;
    price: number;
    currency: string;
    seller: {
      name: string;
    };
  };
}

const ReserveClientModal: React.FC<ReserveClientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  aircraft
}) => {
  const [step, setStep] = useState<'info' | 'terms' | 'confirmation'>('info');
  const [formData, setFormData] = useState({
    // Информация о клиенте
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    clientPosition: '',
    
    // Информация о брокере
    brokerName: '',
    brokerEmail: '',
    brokerPhone: '',
    brokerCompany: '',
    brokerLicense: '',
    brokerExperience: '',
    
    // Условия бронирования
    exclusivityPeriod: '30',
    commission: '',
    terms: false,
    marketing: false,
    
    // Дополнительная информация
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNext = () => {
    if (step === 'info') {
      // Валидация первого шага
      if (!formData.clientName || !formData.clientEmail || !formData.clientPhone || 
          !formData.brokerName || !formData.brokerEmail || !formData.brokerPhone) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }
      setStep('terms');
    } else if (step === 'terms') {
      // Валидация второго шага
      if (!formData.terms) {
        toast.error('Необходимо принять условия бронирования');
        return;
      }
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'terms') {
      setStep('info');
    } else if (step === 'confirmation') {
      setStep('terms');
    }
  };

  const handleSubmit = () => {
    // В реальном приложении здесь будет отправка на сервер
    toast.success('Клиент успешно забронирован! Вы получите эксклюзивные права на работу с этим покупателем.');
    onSuccess();
    onClose();
    setStep('info');
    setFormData({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientCompany: '',
      clientPosition: '',
      brokerName: '',
      brokerEmail: '',
      brokerPhone: '',
      brokerCompany: '',
      brokerLicense: '',
      brokerExperience: '',
      exclusivityPeriod: '30',
      commission: '',
      terms: false,
      marketing: false,
      notes: ''
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <UserIcon className="w-6 h-6 text-aviation-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Забронировать клиента</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step === 'info' ? 'text-aviation-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'info' ? 'bg-aviation-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Информация</span>
            </div>
            <div className={`flex items-center ${step === 'terms' ? 'text-aviation-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'terms' ? 'bg-aviation-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Условия</span>
            </div>
            <div className={`flex items-center ${step === 'confirmation' ? 'text-aviation-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'confirmation' ? 'bg-aviation-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Подтверждение</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'info' && (
            <div>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Самолет: {aircraft.title}</h3>
                <p className="text-blue-800 text-sm">Цена: {formatPrice(aircraft.price, aircraft.currency)}</p>
                <p className="text-blue-800 text-sm">Продавец: {aircraft.seller.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Информация о клиенте */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о клиенте</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО клиента *
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email клиента *
                      </label>
                      <input
                        type="email"
                        name="clientEmail"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон клиента *
                      </label>
                      <input
                        type="tel"
                        name="clientPhone"
                        value={formData.clientPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Компания клиента
                      </label>
                      <input
                        type="text"
                        name="clientCompany"
                        value={formData.clientCompany}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Должность клиента
                      </label>
                      <input
                        type="text"
                        name="clientPosition"
                        value={formData.clientPosition}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Информация о брокере */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о брокере</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО брокера *
                      </label>
                      <input
                        type="text"
                        name="brokerName"
                        value={formData.brokerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email брокера *
                      </label>
                      <input
                        type="email"
                        name="brokerEmail"
                        value={formData.brokerEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон брокера *
                      </label>
                      <input
                        type="tel"
                        name="brokerPhone"
                        value={formData.brokerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Компания брокера
                      </label>
                      <input
                        type="text"
                        name="brokerCompany"
                        value={formData.brokerCompany}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Лицензия брокера
                      </label>
                      <input
                        type="text"
                        name="brokerLicense"
                        value={formData.brokerLicense}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дополнительные заметки
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                  placeholder="Дополнительная информация о клиенте, его потребностях, бюджете и т.д."
                />
              </div>
            </div>
          )}

          {step === 'terms' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Условия бронирования</h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Эксклюзивные права</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        При бронировании клиента вы получаете эксклюзивные права на работу с этим покупателем 
                        в течение указанного периода.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Период эксклюзивности (дни)
                    </label>
                    <select
                      name="exclusivityPeriod"
                      value={formData.exclusivityPeriod}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                    >
                      <option value="7">7 дней</option>
                      <option value="14">14 дней</option>
                      <option value="30">30 дней</option>
                      <option value="60">60 дней</option>
                      <option value="90">90 дней</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Комиссия (%)
                    </label>
                    <input
                      type="text"
                      name="commission"
                      value={formData.commission}
                      onChange={handleInputChange}
                      placeholder="3.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-aviation-600 focus:ring-aviation-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Согласие с условиями бронирования</span>
                      <span className="text-gray-500 block">
                        Я согласен с условиями эксклюзивного бронирования клиента и обязуюсь соблюдать 
                        конфиденциальность информации
                      </span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="marketing"
                      checked={formData.marketing}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-aviation-600 focus:ring-aviation-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Маркетинговые материалы</span>
                      <span className="text-gray-500 block">
                        Согласен получать информацию о новых предложениях и маркетинговые материалы
                      </span>
                    </span>
                  </label>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Условия бронирования:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Эксклюзивные права действуют в течение выбранного периода</li>
                    <li>• Брокер обязуется соблюдать конфиденциальность информации о клиенте</li>
                    <li>• При успешной сделке комиссия выплачивается согласно договоренности</li>
                    <li>• Бронирование может быть отменено при нарушении условий</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div>
              <div className="text-center mb-6">
                <UserIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Подтверждение бронирования</h3>
                <p className="text-gray-600">Пожалуйста, проверьте введенную информацию перед подтверждением</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Сводка бронирования:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Клиент:</span>
                    <span className="ml-2 font-medium">{formData.clientName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Брокер:</span>
                    <span className="ml-2 font-medium">{formData.brokerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email клиента:</span>
                    <span className="ml-2 font-medium">{formData.clientEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email брокера:</span>
                    <span className="ml-2 font-medium">{formData.brokerEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Период эксклюзивности:</span>
                    <span className="ml-2 font-medium">{formData.exclusivityPeriod} дней</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Комиссия:</span>
                    <span className="ml-2 font-medium">{formData.commission ? `${formData.commission}%` : 'Не указана'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  После подтверждения бронирования вы получите эксклюзивные права на работу с этим клиентом 
                  в течение {formData.exclusivityPeriod} дней. Мы уведомим вас о статусе бронирования.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Отмена
          </button>
          <div className="flex space-x-3">
            {step !== 'info' && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Назад
              </button>
            )}
            {step !== 'confirmation' ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-aviation-600 text-white text-sm font-medium rounded-md hover:bg-aviation-700"
              >
                Далее
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-aviation-600 text-white text-sm font-medium rounded-md hover:bg-aviation-700"
              >
                Забронировать клиента
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveClientModal; 