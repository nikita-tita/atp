import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Privacy: React.FC = () => {
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
          <div className="flex items-center mb-6">
            <ShieldCheckIcon className="w-12 h-12 mr-4 text-gray-300" />
            <h1 className="text-5xl md:text-6xl font-bold">
              Политика конфиденциальности
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Как мы защищаем и обрабатываем ваши персональные данные
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Общие положения</h2>
            <p className="text-gray-600 mb-4">
              ООО «ATP Platform» (далее — «Компания», «мы») обязуется защищать конфиденциальность 
              персональных данных пользователей платформы ATP. Настоящая Политика конфиденциальности 
              описывает, как мы собираем, используем и защищаем вашу информацию.
            </p>
            <p className="text-gray-600 mb-4">
              Используя платформу ATP, вы соглашаетесь с условиями настоящей Политики конфиденциальности.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Собираемая информация</h2>
            <p className="text-gray-600 mb-4">
              Мы собираем следующие типы информации:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Персональные данные</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>ФИО и контактная информация</li>
                <li>Email адрес и номер телефона</li>
                <li>Информация о компании и должности</li>
                <li>Документы для верификации</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Техническая информация</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>IP адрес и данные браузера</li>
                <li>Информация об устройстве</li>
                <li>Логи использования платформы</li>
                <li>Cookies и аналогичные технологии</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Данные о деятельности</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>История поиска и просмотров</li>
                <li>Избранные объявления</li>
                <li>История комплаенс-проверок</li>
                <li>Взаимодействие с другими пользователями</li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Цели использования данных</h2>
            <p className="text-gray-600 mb-4">
              Мы используем ваши данные для следующих целей:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Предоставление услуг платформы</li>
              <li>Верификация пользователей и комплаенс-проверка</li>
              <li>Обеспечение безопасности сделок</li>
              <li>Улучшение функциональности платформы</li>
              <li>Предоставление технической поддержки</li>
              <li>Соблюдение юридических обязательств</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Передача данных третьим лицам</h2>
            <p className="text-gray-600 mb-4">
              Мы можем передавать ваши данные в следующих случаях:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>С вашего явного согласия</li>
              <li>Для выполнения комплаенс-проверки</li>
              <li>По требованию законодательства</li>
              <li>Для защиты прав и безопасности платформы</li>
              <li>Партнерам по верификации (с ограниченным доступом)</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Важно:</strong> Контактная информация продавцов раскрывается покупателям 
              только после успешного прохождения комплаенс-проверки.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Безопасность данных</h2>
            <p className="text-gray-600 mb-4">
              Мы применяем следующие меры для защиты ваших данных:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Техническая защита</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Шифрование данных (SSL/TLS)</li>
                  <li>• Защищенные серверы</li>
                  <li>• Регулярные обновления безопасности</li>
                  <li>• Мониторинг угроз</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Организационная защита</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ограниченный доступ к данным</li>
                  <li>• Обучение персонала</li>
                  <li>• Политики безопасности</li>
                  <li>• Регулярные аудиты</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Ваши права</h2>
            <p className="text-gray-600 mb-4">
              Вы имеете следующие права в отношении ваших персональных данных:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Право на доступ к своим данным</li>
              <li>Право на исправление неточных данных</li>
              <li>Право на удаление данных (с ограничениями)</li>
              <li>Право на ограничение обработки</li>
              <li>Право на переносимость данных</li>
              <li>Право на отзыв согласия</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Для реализации этих прав обращайтесь к нам по email: privacy@atp-platform.com
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Cookies и аналогичные технологии</h2>
            <p className="text-gray-600 mb-4">
              Мы используем cookies и аналогичные технологии для:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Обеспечения работы платформы</li>
              <li>Запоминания ваших предпочтений</li>
              <li>Анализа использования платформы</li>
              <li>Улучшения пользовательского опыта</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Вы можете управлять настройками cookies в вашем браузере.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Хранение данных</h2>
            <p className="text-gray-600 mb-4">
              Мы храним ваши данные в течение времени, необходимого для:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Предоставления услуг платформы</li>
              <li>Соблюдения юридических обязательств</li>
              <li>Разрешения споров</li>
              <li>Обеспечения безопасности</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Данные удаляются автоматически по истечении установленных сроков или по вашему запросу.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Международная передача данных</h2>
            <p className="text-gray-600 mb-4">
              Ваши данные могут передаваться и обрабатываться в странах, отличных от вашей страны проживания. 
              Мы обеспечиваем соответствующий уровень защиты данных при международной передаче.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Изменения политики</h2>
            <p className="text-gray-600 mb-4">
              Мы можем обновлять настоящую Политику конфиденциальности. 
              О значительных изменениях вы будете уведомлены через платформу или по email.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Контактная информация</h2>
            <p className="text-gray-600 mb-4">
              По вопросам, связанным с обработкой персональных данных, обращайтесь:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> privacy@atp-platform.com
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Телефон:</strong> +7 (495) 123-45-67
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Адрес:</strong> Москва, ул. Авиационная, д. 1
              </p>
              <p className="text-gray-600">
                <strong>Специалист по защите данных:</strong> Иванов И.И.
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

export default Privacy; 