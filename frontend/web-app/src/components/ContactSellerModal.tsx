import React, { useState } from 'react';
import { XMarkIcon, PhoneIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: {
    name: string;
    email: string;
    phone: string;
    verified: boolean;
  };
  aircraft: {
    title: string;
    price: number;
    currency: string;
  };
}

const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  isOpen,
  onClose,
  seller,
  aircraft
}) => {
  const [contactMethod, setContactMethod] = useState<'form' | 'phone' | 'email' | 'chat'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    preferredContact: 'email',
    budget: '',
    timeline: '',
    financing: false,
    inspection: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Пожалуйста, заполните обязательные поля');
      return;
    }

    // Отправка данных (в реальном приложении здесь будет API call)
    toast.success('Сообщение отправлено! Продавец свяжется с вами в ближайшее время.');
    onClose();
    
    // Сброс формы
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      preferredContact: 'email',
      budget: '',
      timeline: '',
      financing: false,
      inspection: false
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Связаться с продавцом</h2>
            <p className="text-sm text-gray-600 mt-1">{aircraft.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Contact Methods Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setContactMethod('form')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                contactMethod === 'form'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Форма запроса
            </button>
            <button
              onClick={() => setContactMethod('phone')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                contactMethod === 'phone'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <PhoneIcon className="w-4 h-4 inline mr-2" />
              Позвонить
            </button>
            <button
              onClick={() => setContactMethod('email')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                contactMethod === 'email'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <EnvelopeIcon className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setContactMethod('chat')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                contactMethod === 'chat'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2" />
              Чат
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {contactMethod === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aircraft Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Информация о самолете</h3>
                <div className="text-sm text-gray-600">
                  <p><strong>Модель:</strong> {aircraft.title}</p>
                  <p><strong>Цена:</strong> {formatPrice(aircraft.price, aircraft.currency)}</p>
                  <p><strong>Продавец:</strong> {seller.name}</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email * <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Предпочитаемый способ связи
                  </label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Телефон</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Бюджет
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="Например: $20-25M"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Временные рамки
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Выберите период</option>
                    <option value="immediate">Немедленно</option>
                    <option value="1-3months">1-3 месяца</option>
                    <option value="3-6months">3-6 месяцев</option>
                    <option value="6-12months">6-12 месяцев</option>
                    <option value="flexible">Гибкие сроки</option>
                  </select>
                </div>
              </div>

              {/* Additional Services */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Дополнительные услуги</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="financing"
                      checked={formData.financing}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Интересуюсь финансированием</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="inspection"
                      checked={formData.inspection}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Нужна инспекция самолета</span>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение * <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Опишите ваш интерес к этому самолету, задайте вопросы или укажите особые требования..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 rounded-md font-medium transition-colors"
                >
                  Отправить запрос
                </button>
              </div>
            </form>
          )}

          {contactMethod === 'phone' && (
            <div className="text-center py-8">
              <PhoneIcon className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Позвонить продавцу</h3>
              <p className="text-gray-600 mb-6">Свяжитесь напрямую с продавцом по телефону</p>
              <a
                href={`tel:${seller.phone}`}
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                {seller.phone}
              </a>
            </div>
          )}

          {contactMethod === 'email' && (
            <div className="text-center py-8">
              <EnvelopeIcon className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Отправить email</h3>
              <p className="text-gray-600 mb-6">Напишите продавцу напрямую на email</p>
              <a
                href={`mailto:${seller.email}?subject=Запрос о самолете: ${aircraft.title}`}
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                {seller.email}
              </a>
            </div>
          )}

          {contactMethod === 'chat' && (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Онлайн чат</h3>
              <p className="text-gray-600 mb-6">Начните чат с продавцом в реальном времени</p>
              <button
                onClick={() => {
                  toast.success('Чат будет доступен в ближайшее время!');
                  onClose();
                }}
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                Начать чат
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSellerModal; 