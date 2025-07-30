import { useState } from 'react';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

const settings = [
  {
    id: 'general',
    name: 'Общие настройки',
    description: 'Основные параметры платформы',
    icon: Cog6ToothIcon,
    fields: [
      { name: 'Название платформы', value: 'ATP - Платформа авиаторговли', type: 'text' },
      { name: 'Email поддержки', value: 'support@atp-platform.com', type: 'email' },
      { name: 'Телефон поддержки', value: '+7 (800) 555-0123', type: 'tel' },
    ]
  },
  {
    id: 'security',
    name: 'Безопасность',
    description: 'Настройки безопасности и модерации',
    icon: ShieldCheckIcon,
    fields: [
      { name: 'Требовать верификацию', value: true, type: 'checkbox' },
      { name: 'Автомодерация объявлений', value: false, type: 'checkbox' },
      { name: 'Максимальная цена', value: '$50,000,000', type: 'text' },
    ]
  },
  {
    id: 'notifications',
    name: 'Уведомления',
    description: 'Настройки уведомлений',
    icon: BellIcon,
    fields: [
      { name: 'Email уведомления', value: true, type: 'checkbox' },
      { name: 'SMS уведомления', value: false, type: 'checkbox' },
      { name: 'Push уведомления', value: true, type: 'checkbox' },
    ]
  },
  {
    id: 'regional',
    name: 'Региональные настройки',
    description: 'Язык и региональные параметры',
    icon: GlobeAltIcon,
    fields: [
      { name: 'Основной язык', value: 'Русский', type: 'select' },
      { name: 'Часовой пояс', value: 'Москва (UTC+3)', type: 'select' },
      { name: 'Валюта', value: 'USD', type: 'select' },
    ]
  },
  {
    id: 'payments',
    name: 'Платежи',
    description: 'Настройки платежной системы',
    icon: CreditCardIcon,
    fields: [
      { name: 'Комиссия платформы', value: '2.5%', type: 'text' },
      { name: 'Минимальная сумма', value: '$1,000', type: 'text' },
      { name: 'Автоподтверждение', value: false, type: 'checkbox' },
    ]
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const currentSetting = settings.find(s => s.id === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Настройки</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление параметрами платформы
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {settings.map((setting) => {
                const Icon = setting.icon;
                return (
                  <button
                    key={setting.id}
                    onClick={() => setActiveTab(setting.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === setting.id
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {setting.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 p-6">
            {currentSetting && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{currentSetting.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{currentSetting.description}</p>
                </div>

                <form className="space-y-6">
                  {currentSetting.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.name}
                      </label>
                      {field.type === 'checkbox' ? (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.value as boolean}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-sm text-gray-900">
                            Включено
                          </label>
                        </div>
                      ) : field.type === 'select' ? (
                        <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                          <option>{field.value as string}</option>
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={field.value as string}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Сохранить
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 