import React, { useState } from 'react';
import { XMarkIcon, DocumentTextIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  aircraft: {
    title: string;
    price: number;
    currency: string;
  };
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  aircraft
}) => {
  const [step, setStep] = useState<'info' | 'documents' | 'confirmation'>('info');
  const [formData, setFormData] = useState({
    // Информация о покупателе
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    buyerCompany: '',
    buyerPosition: '',
    
    // Информация о брокере
    brokerName: '',
    brokerEmail: '',
    brokerPhone: '',
    brokerCompany: '',
    brokerLicense: '',
    brokerExperience: '',
    
    // Финансовая информация
    budget: '',
    financing: false,
    cashAvailable: false,
    letterOfIntent: false,
    proofOfFunds: false,
    
    // Дополнительная информация
    timeline: '',
    inspection: false,
    nda: false,
    terms: false
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
      if (!formData.buyerName || !formData.buyerEmail || !formData.buyerPhone || 
          !formData.brokerName || !formData.brokerEmail || !formData.brokerPhone) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }
      setStep('documents');
    } else if (step === 'documents') {
      // Валидация второго шага
      if (!formData.proofOfFunds || !formData.letterOfIntent || !formData.terms) {
        toast.error('Необходимо подтвердить наличие документов и принять условия');
        return;
      }
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'documents') {
      setStep('info');
    } else if (step === 'confirmation') {
      setStep('documents');
    }
  };

  const handleSubmit = () => {
    // В реальном приложении здесь будет отправка на сервер
    toast.success('Заявка на комплаенс отправлена! Мы свяжемся с вами в течение 24 часов.');
    onSuccess();
    onClose();
    setStep('info');
    setFormData({
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      buyerCompany: '',
      buyerPosition: '',
      brokerName: '',
      brokerEmail: '',
      brokerPhone: '',
      brokerCompany: '',
      brokerLicense: '',
      brokerExperience: '',
      budget: '',
      financing: false,
      cashAvailable: false,
      letterOfIntent: false,
      proofOfFunds: false,
      timeline: '',
      inspection: false,
      nda: false,
      terms: false
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
            <ShieldCheckIcon className="w-6 h-6 text-aviation-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Комплаенс-проверка</h2>
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
            <div className={`flex items-center ${step === 'documents' ? 'text-aviation-600' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === 'documents' ? 'bg-aviation-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium hidden sm:inline">Документы</span>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Информация о покупателе */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о покупателе</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО покупателя *
                      </label>
                      <input
                        type="text"
                        name="buyerName"
                        value={formData.buyerName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email покупателя *
                      </label>
                      <input
                        type="email"
                        name="buyerEmail"
                        value={formData.buyerEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон покупателя *
                      </label>
                      <input
                        type="tel"
                        name="buyerPhone"
                        value={formData.buyerPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Компания покупателя
                      </label>
                      <input
                        type="text"
                        name="buyerCompany"
                        value={formData.buyerCompany}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Должность
                      </label>
                      <input
                        type="text"
                        name="buyerPosition"
                        value={formData.buyerPosition}
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
            </div>
          )}

          {step === 'documents' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Подтверждение документов</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Важно!</h4>
                      <p className="text-yellow-800 text-sm mt-1">
                        Для прохождения комплаенс-проверки необходимо подтвердить наличие следующих документов
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="proofOfFunds"
                      checked={formData.proofOfFunds}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-aviation-600 focus:ring-aviation-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Подтверждение средств</span>
                      <span className="text-gray-500 block">Банковская выписка или письмо от банка о наличии средств</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="letterOfIntent"
                      checked={formData.letterOfIntent}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-aviation-600 focus:ring-aviation-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Письмо о намерениях</span>
                      <span className="text-gray-500 block">Официальное письмо о намерении приобрести самолет</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="nda"
                      checked={formData.nda}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-aviation-600 focus:ring-aviation-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">NDA (Соглашение о неразглашении)</span>
                      <span className="text-gray-500 block">Готовность подписать соглашение о конфиденциальности</span>
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-aviation-600 focus:ring-aviation-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">Согласие с условиями</span>
                      <span className="text-gray-500 block">Я согласен с условиями комплаенс-проверки и обработки персональных данных</span>
                    </span>
                  </label>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Планируемый бюджет (USD)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="25000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Временные рамки
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-500"
                  >
                    <option value="">Выберите временные рамки</option>
                    <option value="immediate">Немедленно</option>
                    <option value="1-3months">1-3 месяца</option>
                    <option value="3-6months">3-6 месяцев</option>
                    <option value="6-12months">6-12 месяцев</option>
                    <option value="flexible">Гибкие сроки</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div>
              <div className="text-center mb-6">
                <ShieldCheckIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Подтверждение заявки</h3>
                <p className="text-gray-600">Пожалуйста, проверьте введенную информацию перед отправкой</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Сводка заявки:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Покупатель:</span>
                    <span className="ml-2 font-medium">{formData.buyerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Брокер:</span>
                    <span className="ml-2 font-medium">{formData.brokerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email покупателя:</span>
                    <span className="ml-2 font-medium">{formData.buyerEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email брокера:</span>
                    <span className="ml-2 font-medium">{formData.brokerEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Бюджет:</span>
                    <span className="ml-2 font-medium">{formData.budget ? `$${formData.budget}` : 'Не указан'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Временные рамки:</span>
                    <span className="ml-2 font-medium">{formData.timeline || 'Не указаны'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  После отправки заявки наша команда свяжется с вами в течение 24 часов для уточнения деталей 
                  и проведения комплаенс-проверки. После успешной проверки вы получите доступ к контактной 
                  информации продавца.
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
                Отправить заявку
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceModal; 