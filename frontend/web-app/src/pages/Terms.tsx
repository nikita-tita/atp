import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Назад на главную
            </Link>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Пользовательское соглашение
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Условия использования платформы ATP для верифицированной торговли авиатехникой
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Общие положения</h2>
            <p className="text-gray-600 mb-4">
              Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между 
              ООО «ATP Platform» (далее — «Компания», «мы») и пользователями платформы ATP 
              (далее — «Пользователи», «вы») в связи с использованием веб-сайта и услуг платформы.
            </p>
            <p className="text-gray-600 mb-4">
              Используя платформу ATP, вы соглашаетесь с условиями настоящего Соглашения. 
              Если вы не согласны с какими-либо условиями, не используйте платформу.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Описание услуг</h2>
            <p className="text-gray-600 mb-4">
              ATP Platform предоставляет специализированную площадку для верифицированной торговли авиатехникой, 
              включая следующие услуги:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Размещение объявлений о продаже авиатехники</li>
              <li>Поиск и фильтрация объявлений</li>
              <li>Система комплаенс-проверки покупателей</li>
              <li>Бронирование клиентов</li>
              <li>Сравнение характеристик самолетов</li>
              <li>Верификация участников рынка</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Регистрация и аккаунт</h2>
            <p className="text-gray-600 mb-4">
              Для использования большинства функций платформы требуется регистрация. 
              При регистрации вы обязуетесь предоставить достоверную информацию и поддерживать 
              её актуальность.
            </p>
            <p className="text-gray-600 mb-4">
              Вы несете ответственность за сохранность учетных данных и все действия, 
              совершенные под вашим аккаунтом.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Правила использования</h2>
            <p className="text-gray-600 mb-4">
              При использовании платформы запрещается:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Размещать недостоверную информацию</li>
              <li>Нарушать права интеллектуальной собственности</li>
              <li>Использовать платформу для незаконной деятельности</li>
              <li>Создавать помехи работе платформы</li>
              <li>Нарушать конфиденциальность других пользователей</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Комплаенс и верификация</h2>
            <p className="text-gray-600 mb-4">
              Платформа использует систему комплаенс-проверки для обеспечения безопасности сделок. 
              Покупатели должны пройти верификацию для получения контактной информации продавцов.
            </p>
            <p className="text-gray-600 mb-4">
              Мы оставляем за собой право отказать в доступе к платформе лицам, 
              не прошедшим верификацию или нарушившим правила.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Ответственность</h2>
            <p className="text-gray-600 mb-4">
              Компания не несет ответственности за:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Качество и состояние продаваемой авиатехники</li>
              <li>Результаты сделок между пользователями</li>
              <li>Действия третьих лиц</li>
              <li>Технические сбои, не зависящие от нас</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Конфиденциальность</h2>
            <p className="text-gray-600 mb-4">
              Мы обязуемся защищать персональные данные пользователей в соответствии с 
              Политикой конфиденциальности. Контактная информация продавцов раскрывается 
              только после прохождения комплаенс-проверки.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Изменения соглашения</h2>
            <p className="text-gray-600 mb-4">
              Мы оставляем за собой право изменять настоящее Соглашение. 
              Об изменениях пользователи будут уведомлены через платформу или по email.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Контактная информация</h2>
            <p className="text-gray-600 mb-4">
              По вопросам, связанным с настоящим Соглашением, обращайтесь:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> legal@atp-platform.com
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Телефон:</strong> +7 (495) 123-45-67
              </p>
              <p className="text-gray-600">
                <strong>Адрес:</strong> Москва, ул. Авиационная, д. 1
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Дата последнего обновления:</strong> 30 июля 2025 года
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms; 