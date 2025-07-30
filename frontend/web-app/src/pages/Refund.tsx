import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Refund: React.FC = () => {
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
            <CurrencyDollarIcon className="w-12 h-12 mr-4 text-gray-300" />
            <h1 className="text-5xl md:text-6xl font-bold">
              Политика возврата
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl">
            Условия возврата средств и отмены услуг на платформе ATP
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Общие положения</h2>
            <p className="text-gray-600 mb-4">
              ООО «ATP Platform» (далее — «Компания») стремится обеспечить высокое качество услуг 
              и удовлетворенность клиентов. Настоящая Политика возврата устанавливает условия 
              возврата средств и отмены услуг на платформе ATP.
            </p>
            <p className="text-gray-600 mb-4">
              Политика применяется ко всем платным услугам платформы, включая премиум-подписки, 
              услуги верификации и дополнительные сервисы.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Условия возврата</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">✅ Полный возврат (100%)</h3>
              <ul className="text-green-800 space-y-2">
                <li>• Технические сбои платформы, препятствующие использованию услуг</li>
                <li>• Ошибки в выставлении счетов</li>
                <li>• Дублирование платежей</li>
                <li>• Неавторизованные транзакции</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-yellow-900 mb-4">⚠️ Частичный возврат (50-80%)</h3>
              <ul className="text-yellow-800 space-y-2">
                <li>• Отмена в течение 7 дней с момента оплаты (если услуги не использовались)</li>
                <li>• Отказ в верификации по техническим причинам</li>
                <li>• Изменение условий предоставления услуг</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">❌ Возврат не производится</h3>
              <ul className="text-red-800 space-y-2">
                <li>• Использование услуг более 7 дней</li>
                <li>• Нарушение пользовательского соглашения</li>
                <li>• Отказ в верификации по вине пользователя</li>
                <li>• Успешное завершение сделки через платформу</li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Процедура возврата</h2>
            <p className="text-gray-600 mb-4">
              Для оформления возврата выполните следующие шаги:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Подача заявки</h4>
                  <p className="text-gray-600">
                    Отправьте заявку на возврат через форму на сайте или по email: refund@atp-platform.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Предоставление документов</h4>
                  <p className="text-gray-600">
                    Приложите копию чека, скриншот платежа и обоснование причины возврата
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Рассмотрение заявки</h4>
                  <p className="text-gray-600">
                    Мы рассмотрим вашу заявку в течение 3-5 рабочих дней
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Возврат средств</h4>
                  <p className="text-gray-600">
                    При одобрении возврат будет произведен на исходный способ оплаты в течение 5-10 дней
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Сроки возврата</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Рассмотрение заявки</h4>
                <p className="text-2xl font-bold text-black mb-2">3-5 дней</p>
                <p className="text-sm text-gray-600">Рабочие дни</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Возврат средств</h4>
                <p className="text-2xl font-bold text-black mb-2">5-10 дней</p>
                <p className="text-sm text-gray-600">После одобрения</p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Способы возврата</h2>
            <p className="text-gray-600 mb-4">
              Возврат производится тем же способом, которым была произведена оплата:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Банковские карты — возврат на карту в течение 5-10 дней</li>
              <li>Электронные кошельки — возврат на кошелек в течение 1-3 дней</li>
              <li>Банковские переводы — возврат на счет в течение 3-7 дней</li>
              <li>Криптовалюты — возврат в той же валюте в течение 1-2 дней</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Особые случаи</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Верификация</h4>
                <p className="text-gray-600 mb-3">
                  При отказе в верификации по техническим причинам возвращается 80% стоимости услуги. 
                  При отказе по вине пользователя возврат не производится.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Премиум-подписки</h4>
                <p className="text-gray-600 mb-3">
                  Возврат пропорционально неиспользованному периоду подписки. 
                  Минимальный период для возврата — 7 дней.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Комплаенс-проверка</h4>
                <p className="text-gray-600 mb-3">
                  Возврат не производится после успешного прохождения проверки и получения 
                  контактной информации продавца.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Комиссии и сборы</h2>
            <p className="text-gray-600 mb-4">
              При возврате средств могут удерживаться следующие комиссии:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Комиссия платежной системы (2-5% от суммы)</li>
              <li>Комиссия банка за возврат (если применимо)</li>
              <li>Комиссия за обработку заявки (фиксированная сумма)</li>
            </ul>
            <p className="text-gray-600 mb-4">
              <strong>Важно:</strong> Комиссии не взимаются при возврате по техническим причинам 
              или ошибкам платформы.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Отказ в возврате</h2>
            <p className="text-gray-600 mb-4">
              Мы можем отказать в возврате в следующих случаях:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Нарушение пользовательского соглашения</li>
              <li>Предоставление недостоверной информации</li>
              <li>Попытки мошенничества</li>
              <li>Истечение срока подачи заявки на возврат</li>
              <li>Успешное использование услуг</li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Контактная информация</h2>
            <p className="text-gray-600 mb-4">
              По вопросам возврата средств обращайтесь:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> refund@atp-platform.com
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Телефон:</strong> +7 (495) 123-45-67
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Время работы:</strong> Пн-Пт, 9:00-18:00 (МСК)
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

export default Refund; 