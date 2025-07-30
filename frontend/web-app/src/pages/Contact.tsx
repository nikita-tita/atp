import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    // В реальном приложении здесь будет отправка на сервер
    toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
    
    // Очистка формы
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              СВЯЖИТЕСЬ С НАМИ
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Готовы ответить на ваши вопросы и помочь с любыми задачами
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <PhoneIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Телефон</h3>
              <p className="text-gray-600 mb-2">+7 (495) 123-45-67</p>
              <p className="text-gray-600">+1 (305) 555-0123</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <EnvelopeIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Email</h3>
              <p className="text-gray-600 mb-2">info@atp-platform.com</p>
              <p className="text-gray-600">support@atp-platform.com</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPinIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Адрес</h3>
              <p className="text-gray-600 mb-2">Москва, Россия</p>
              <p className="text-gray-600">Майами, США</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Время работы</h3>
              <p className="text-gray-600 mb-2">Пн-Пт: 9:00-18:00</p>
              <p className="text-gray-600">Сб-Вс: 10:00-16:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ОТПРАВИТЬ СООБЩЕНИЕ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Заполните форму ниже, и мы свяжемся с вами в ближайшее время
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя * <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email * <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Компания
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тема
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Выберите тему</option>
                <option value="general">Общие вопросы</option>
                <option value="registration">Регистрация на платформе</option>
                <option value="verification">Верификация аккаунта</option>
                <option value="technical">Техническая поддержка</option>
                <option value="partnership">Партнерство</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение * <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Опишите ваш вопрос или задачу..."
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-8 py-4 bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
              >
                Отправить сообщение
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Как зарегистрироваться на платформе?</h3>
              <p className="text-gray-600">
                Для регистрации перейдите на страницу регистрации, заполните форму и предоставьте необходимые документы для верификации.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Сколько времени занимает верификация?</h3>
              <p className="text-gray-600">
                Обычно верификация занимает 1-3 рабочих дня. Мы тщательно проверяем все предоставленные документы.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Какие документы нужны для верификации?</h3>
              <p className="text-gray-600">
                Для физических лиц: паспорт, подтверждение адреса. Для компаний: регистрационные документы, лицензии, подтверждение финансового состояния.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Есть ли комиссия за использование платформы?</h3>
              <p className="text-gray-600">
                Регистрация и базовое использование платформы бесплатны. Комиссия взимается только при успешном завершении сделки.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 