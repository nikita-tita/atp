import { useState } from 'react';
import {
  UsersIcon,
  CubeIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import UserModeration from '../components/UserModeration';
import PlatformAnalytics from '../components/PlatformAnalytics';
import ContentModeration from '../components/ContentModeration';

const stats = [
  { name: 'Всего пользователей', value: '2,847', icon: UsersIcon, change: '+12%', changeType: 'positive' },
  { name: 'Активных объявлений', value: '1,234', icon: CubeIcon, change: '+8%', changeType: 'positive' },
  { name: 'Общий оборот', value: '$1.2B', icon: CurrencyDollarIcon, change: '+23%', changeType: 'positive' },
  { name: 'Просмотров сегодня', value: '89.2K', icon: EyeIcon, change: '+5%', changeType: 'positive' },
];

const recentActivity = [
  { id: 1, user: 'John Smith', action: 'Добавил новое объявление Boeing 737', time: '2 минуты назад', type: 'listing' },
  { id: 2, user: 'Maria Rodriguez', action: 'Подтвердила верификацию', time: '15 минут назад', type: 'verification' },
  { id: 3, user: 'Ahmed Al-Rashid', action: 'Загрузил KYC документы', time: '1 час назад', type: 'payment' },
  { id: 4, user: 'Elena Voronova', action: 'Зарегистрировалась на платформе', time: '2 часа назад', type: 'registration' },
];

const pendingActions = [
  { id: 1, type: 'verification', count: 23, title: 'Ожидают верификации' },
  { id: 2, type: 'moderation', count: 15, title: 'На модерации' },
  { id: 3, type: 'support', count: 8, title: 'Обращения в поддержку' },
];

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'analytics' | 'content'>('overview');

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: CubeIcon },
    { id: 'users', name: 'User Moderation', icon: UserGroupIcon },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    { id: 'content', name: 'Content Moderation', icon: ClipboardDocumentListIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ATP Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Comprehensive platform management and analytics
            </p>
          </div>
        </div>
        
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeView === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Overview</h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Последняя активность</h3>
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                activity.type === 'listing' ? 'bg-green-500' :
                                activity.type === 'verification' ? 'bg-blue-500' :
                                activity.type === 'payment' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`}>
                                {activity.type === 'listing' && <CubeIcon className="h-4 w-4 text-white" />}
                                {activity.type === 'verification' && <CheckCircleIcon className="h-4 w-4 text-white" />}
                                {activity.type === 'payment' && <CurrencyDollarIcon className="h-4 w-4 text-white" />}
                                {activity.type === 'registration' && <UsersIcon className="h-4 w-4 text-white" />}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Требуют внимания</h3>
                <div className="space-y-4">
                  {pendingActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {action.type === 'verification' && (
                            <CheckCircleIcon className="h-5 w-5 text-yellow-500" />
                          )}
                          {action.type === 'moderation' && (
                            <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                          )}
                          {action.type === 'support' && (
                            <UsersIcon className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{action.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            if (action.type === 'verification') setActiveView('users');
                            if (action.type === 'moderation') setActiveView('content');
                          }}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          {action.count}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'users' && <UserModeration />}
      {activeView === 'analytics' && <PlatformAnalytics />}
      {activeView === 'content' && <ContentModeration />}
    </div>
  );
}