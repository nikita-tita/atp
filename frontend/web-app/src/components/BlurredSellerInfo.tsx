import React, { useState } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SellerInfo {
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  company?: string;
  license?: string;
}

interface BlurredSellerInfoProps {
  seller: SellerInfo;
  aircraftId: string;
  onCompliancePass?: () => void;
}

const BlurredSellerInfo: React.FC<BlurredSellerInfoProps> = ({
  seller,
  aircraftId,
  onCompliancePass
}) => {
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [complianceData, setComplianceData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    company: '',
    proofOfFunds: false,
    letterOfIntent: false,
    nda: false,
    brokerLicense: '',
    experience: '',
    previousDeals: '',
    timeline: '',
    budget: ''
  });

  const handleComplianceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!complianceData.buyerName || !complianceData.buyerEmail || !complianceData.budget) {
      toast.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (!complianceData.proofOfFunds || !complianceData.letterOfIntent) {
      toast.error('Необходимо предоставить подтверждение средств и намерений');
      return;
    }

    // В реальном приложении здесь будет отправка на проверку
    toast.success('Заявка на комплаенс отправлена! Мы свяжемся с вами в течение 24 часов.');
    setShowComplianceModal(false);
    
    // Сброс формы
    setComplianceData({
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      company: '',
      proofOfFunds: false,
      letterOfIntent: false,
      nda: false,
      brokerLicense: '',
      experience: '',
      previousDeals: '',
      timeline: '',
      budget: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setComplianceData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const blurText = (text: string) => {
    if (!text) return '';
    const firstChar = text.charAt(0);
    const lastChar = text.charAt(text.length - 1);
    const middle = '•'.repeat(Math.max(0, text.length - 2));
    return `${firstChar}${middle}${lastChar}`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Продавец</h3>
          <div className="flex items-center space-x-2">
            <EyeSlashIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Данные скрыты</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600 font-mono">{blurText(seller.name)}</span>
            {seller.verified && (
              <ShieldCheckIcon className="w-4 h-4 text-green-500 ml-2" />
            )}
          </div>
          
          <div className="flex items-center">
            <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600 font-mono">{blurText(seller.phone)}</span>
          </div>
          
          <div className="flex items-center">
            <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-gray-600 font-mono">{blurText(seller.email)}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                Комплаенс-проверка требуется
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                Для получения контактных данных продавца необходимо пройти комплаенс-проверку 
                и подтвердить наличие реального покупателя.
              </p>
              <button
                onClick={() => setShowComplianceModal(true)}
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 transition-colors"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Пройти комплаенс-проверку
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Комплаенс-проверка</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Подтвердите наличие реального покупателя для получения контактов продавца
                </p>
              </div>
              <button
                onClick={() => setShowComplianceModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeSlashIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleComplianceSubmit} className="p-6 space-y-6">
              {/* Buyer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о покупателе</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Имя покупателя * <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="buyerName"
                      value={complianceData.buyerName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email покупателя * <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="buyerEmail"
                      value={complianceData.buyerEmail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Телефон покупателя
                    </label>
                    <input
                      type="tel"
                      name="buyerPhone"
                      value={complianceData.buyerPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Компания
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={complianceData.company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Финансовая информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Бюджет * <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={complianceData.budget}
                      onChange={handleInputChange}
                      placeholder="Например: $20-25M"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Временные рамки
                    </label>
                    <select
                      name="timeline"
                      value={complianceData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Выберите период</option>
                      <option value="immediate">Немедленно</option>
                      <option value="1-3months">1-3 месяца</option>
                      <option value="3-6months">3-6 месяцев</option>
                      <option value="6-12months">6-12 месяцев</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Обязательные документы</h3>
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="proofOfFunds"
                      checked={complianceData.proofOfFunds}
                      onChange={handleInputChange}
                      className="mr-3 mt-1"
                      required
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Подтверждение средств</span>
                      <p className="text-xs text-gray-500">Банковская справка или письмо от банка о наличии средств</p>
                    </div>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="letterOfIntent"
                      checked={complianceData.letterOfIntent}
                      onChange={handleInputChange}
                      className="mr-3 mt-1"
                      required
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Письмо о намерениях</span>
                      <p className="text-xs text-gray-500">Официальное письмо о намерении приобрести самолет</p>
                    </div>
                  </label>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="nda"
                      checked={complianceData.nda}
                      onChange={handleInputChange}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Соглашение о конфиденциальности</span>
                      <p className="text-xs text-gray-500">NDA для защиты конфиденциальной информации</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Broker Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Информация о брокере</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Лицензия брокера
                    </label>
                    <input
                      type="text"
                      name="brokerLicense"
                      value={complianceData.brokerLicense}
                      onChange={handleInputChange}
                      placeholder="Номер лицензии"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Опыт работы
                    </label>
                    <select
                      name="experience"
                      value={complianceData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Выберите опыт</option>
                      <option value="0-2">0-2 года</option>
                      <option value="2-5">2-5 лет</option>
                      <option value="5-10">5-10 лет</option>
                      <option value="10+">Более 10 лет</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Предыдущие сделки
                  </label>
                  <textarea
                    name="previousDeals"
                    value={complianceData.previousDeals}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Опишите ваши предыдущие сделки с авиатехникой..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowComplianceModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 rounded-md font-medium transition-colors"
                >
                  Отправить на проверку
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BlurredSellerInfo; 