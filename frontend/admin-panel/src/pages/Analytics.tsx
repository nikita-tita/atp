import {
  UsersIcon,
  CubeIcon,
  CurrencyDollarIcon,
  EyeIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';

const stats = [
  { name: 'Новые пользователи', value: '156', change: '+12%', changeType: 'positive', icon: UsersIcon },
  { name: 'Новые объявления', value: '89', change: '+8%', changeType: 'positive', icon: CubeIcon },
  { name: 'Общий оборот', value: '$2.4M', change: '+23%', changeType: 'positive', icon: CurrencyDollarIcon },
  { name: 'Просмотры', value: '89.2K', change: '+5%', changeType: 'positive', icon: EyeIcon },
];

const topCategories = [
  { name: 'Пассажирские', count: 234, percentage: 45 },
  { name: 'Региональные', count: 156, percentage: 30 },
  { name: 'Учебные', count: 89, percentage: 17 },
  { name: 'Грузовые', count: 45, percentage: 8 },
];

const recentTransactions = [
  { id: 1, user: 'Иван Петров', amount: '$12,500,000', type: 'sale', date: '2024-01-30' },
  { id: 2, user: 'Мария Сидорова', amount: '$8,900,000', type: 'sale', date: '2024-01-29' },
  { id: 3, user: 'Алексей Козлов', amount: '$450,000', type: 'sale', date: '2024-01-28' },
  { id: 4, user: 'Елена Воробьева', amount: '$2,100,000', type: 'sale', date: '2024-01-27' },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Аналитика</h1>
        <p className="mt-1 text-sm text-gray-500">
          Анализ активности и метрик платформы
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
                        {stat.changeType === 'positive' ? (
                          <TrendingUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDownIcon className="h-4 w-4 mr-1" />
                        )}
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
        {/* Top Categories */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Популярные категории</h3>
            <div className="space-y-4">
              {topCategories.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-500 rounded mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{category.count}</span>
                    <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Последние сделки</h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentTransactions.map((transaction, transactionIdx) => (
                  <li key={transaction.id}>
                    <div className="relative pb-8">
                      {transactionIdx !== recentTransactions.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                            <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              Продажа от <span className="font-medium text-gray-900">{transaction.user}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <div className="font-medium text-gray-900">{transaction.amount}</div>
                            <div>{new Date(transaction.date).toLocaleDateString('ru-RU')}</div>
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
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Динамика активности</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">График активности будет добавлен</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 