import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface Metric {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface ChartData {
  name: string;
  value: number;
  date?: string;
}

interface GeographyData {
  country: string;
  users: number;
  listings: number;
  revenue: number;
}

interface PriceAlert {
  id: string;
  aircraft: string;
  currentPrice: number;
  averagePrice: number;
  deviation: number;
  type: 'high' | 'low' | 'suspicious';
  dateDetected: Date;
}

const PlatformAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  // Mock data
  const metrics: Metric[] = [
    {
      title: 'Total Users',
      value: '2,847',
      change: 12.5,
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'blue'
    },
    {
      title: 'Active Listings',
      value: '1,234',
      change: 8.2,
      changeType: 'increase',
      icon: GlobeAltIcon,
      color: 'green'
    },
    {
      title: 'Total GMV',
      value: '$1.2B',
      change: 15.7,
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'yellow'
    },
    {
      title: 'Conversion Rate',
      value: '3.4%',
      change: -2.1,
      changeType: 'decrease',
      icon: ArrowTrendingUpIcon,
      color: 'red'
    }
  ];

  const registrationTrend: ChartData[] = [
    { name: 'Sep 1', value: 45 },
    { name: 'Sep 5', value: 52 },
    { name: 'Sep 10', value: 61 },
    { name: 'Sep 15', value: 78 }
  ];

  const listingActivity: ChartData[] = [
    { name: 'Boeing 737', value: 234 },
    { name: 'Airbus A320', value: 189 },
    { name: 'Boeing 777', value: 156 },
    { name: 'Embraer E190', value: 98 },
    { name: 'Other', value: 234 }
  ];

  const geographyData: GeographyData[] = [
    { country: 'United States', users: 847, listings: 423, revenue: 450000000 },
    { country: 'United Kingdom', users: 523, listings: 287, revenue: 320000000 },
    { country: 'Germany', users: 412, listings: 198, revenue: 280000000 },
    { country: 'France', users: 345, listings: 156, revenue: 210000000 },
    { country: 'Canada', users: 298, listings: 134, revenue: 180000000 },
    { country: 'Australia', users: 234, listings: 89, revenue: 120000000 },
    { country: 'Netherlands', users: 198, listings: 67, revenue: 95000000 }
  ];

  const priceAlerts: PriceAlert[] = [
    {
      id: '1',
      aircraft: 'Boeing 737-800 (2015)',
      currentPrice: 65000000,
      averagePrice: 45000000,
      deviation: 44.4,
      type: 'high',
      dateDetected: new Date('2024-09-14')
    },
    {
      id: '2',
      aircraft: 'Airbus A320-200 (2018)',
      currentPrice: 25000000,
      averagePrice: 52000000,
      deviation: -51.9,
      type: 'low',
      dateDetected: new Date('2024-09-13')
    },
    {
      id: '3',
      aircraft: 'Boeing 777-300ER (2010)',
      currentPrice: 180000000,
      averagePrice: 125000000,
      deviation: 44.0,
      type: 'suspicious',
      dateDetected: new Date('2024-09-12')
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadData();
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const getAlertColor = (type: PriceAlert['type']) => {
    switch (type) {
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'suspicious': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: PriceAlert['type']) => {
    switch (type) {
      case 'high': return <ArrowTrendingUpIcon className="h-4 w-4" />;
      case 'low': return <ArrowTrendingDownIcon className="h-4 w-4" />;
      case 'suspicious': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Monitor platform performance, user activity, and market trends
            </p>
          </div>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  selectedPeriod === period
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <IconComponent className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {metric.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {metric.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          metric.changeType === 'increase' ? 'text-green-600' :
                          metric.changeType === 'decrease' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {metric.changeType === 'increase' ? (
                            <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                          ) : metric.changeType === 'decrease' ? (
                            <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                          ) : null}
                          <span className="sr-only">
                            {metric.changeType === 'increase' ? 'Increased' : 'Decreased'} by
                          </span>
                          {Math.abs(metric.change)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trend */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Registration Trend</h3>
            <ChartBarIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {registrationTrend.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-sm text-gray-600">{item.name}</div>
                <div className="flex-1 ml-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.value / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aircraft Types Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Popular Aircraft Types</h3>
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {listingActivity.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 truncate">{item.name}</div>
                <div className="flex-1 ml-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.value / 250) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geography and Price Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="space-y-4">
            {geographyData.map((country, index) => (
              <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{country.country}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(country.revenue)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Users: {country.users.toLocaleString()}</div>
                  <div>Listings: {country.listings.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Monitoring Alerts */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Price Monitoring Alerts</h3>
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          
          {priceAlerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">No price alerts</h4>
              <p className="mt-1 text-sm text-gray-500">All pricing looks normal.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {priceAlerts.map((alert) => (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{alert.aircraft}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                          {getAlertIcon(alert.type)}
                          <span className="ml-1">{alert.type.toUpperCase()}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Current Price:</span>
                          <span className="ml-1 font-medium">{formatCurrency(alert.currentPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Market Average:</span>
                          <span className="ml-1 font-medium">{formatCurrency(alert.averagePrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Deviation:</span>
                          <span className={`ml-1 font-medium ${
                            alert.deviation > 0 ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {alert.deviation > 0 ? '+' : ''}{alert.deviation.toFixed(1)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Detected:</span>
                          <span className="ml-1">{alert.dateDetected.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="ml-4 text-sm text-blue-600 hover:text-blue-800">
                      Investigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <div className="text-sm text-gray-600">User Verification Rate</div>
            <div className="text-xs text-gray-500 mt-1">+2.1% vs last period</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1.2 days</div>
            <div className="text-sm text-gray-600">Avg. Document Review Time</div>
            <div className="text-xs text-gray-500 mt-1">-0.3 days vs last period</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">87.5%</div>
            <div className="text-sm text-gray-600">Listing Quality Score</div>
            <div className="text-xs text-gray-500 mt-1">+1.8% vs last period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
