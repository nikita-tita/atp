import {
  UsersIcon,
  CubeIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Всего пользователей', value: '1,234', icon: UsersIcon, change: '+12%', changeType: 'positive' },
  { name: 'Активных объявлений', value: '567', icon: CubeIcon, change: '+8%', changeType: 'positive' },
  { name: 'Общий оборот', value: '$2.4M', icon: CurrencyDollarIcon, change: '+23%', changeType: 'positive' },
  { name: 'Просмотров сегодня', value: '89.2K', icon: EyeIcon, change: '+5%', changeType: 'positive' },
];

const recentActivity = [
  { id: 1, user: 'Иван Петров', action: 'Добавил новое объявление', time: '2 минуты назад', type: 'listing' },
  { id: 2, user: 'Мария Сидорова', action: 'Подтвердила верификацию', time: '15 минут назад', type: 'verification' },
  { id: 3, user: 'Алексей Козлов', action: 'Оплатил премиум подписку', time: '1 час назад', type: 'payment' },
  { id: 4, user: 'Елена Воробьева', action: 'Зарегистрировалась', time: '2 часа назад', type: 'registration' },
];

const pendingActions = [
  { id: 1, type: 'verification', count: 23, title: 'Ожидают верификации' },
  { id: 2, type: 'moderation', count: 15, title: 'На модерации' },
  { id: 3, type: 'support', count: 8, title: 'Обращения в поддержку' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Обзор платформы ATP - Платформа для верифицированной торговли авиатехникой
        </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                            {activity.type === 'listing' && <CubeIcon className="h-4 w-4 text-primary-600" />}
                            {activity.type === 'verification' && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
                            {activity.type === 'payment' && <CurrencyDollarIcon className="h-4 w-4 text-green-600" />}
                            {activity.type === 'registration' && <UsersIcon className="h-4 w-4 text-blue-600" />}
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {action.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 