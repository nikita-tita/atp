import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AircraftDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Mock data - в реальном приложении это будет загружаться из API
  const aircraft = {
    id: '1',
    title: 'Boeing 737-800 for Sale',
    description: 'Excellent condition Boeing 737-800, low hours, full maintenance history. This aircraft has been meticulously maintained and is ready for immediate delivery.',
    manufacturer: 'Boeing',
    model: '737-800',
    yearBuilt: 2015,
    serialNumber: 'SN123456',
    registrationNumber: 'N123AB',
    totalFlightHours: 15000,
    totalLandings: 8500,
    price: 25000000,
    currency: 'USD',
    location: 'Miami, FL, USA',
    seller: {
      name: 'Aviation Sales Corp',
      email: 'sales@aviationsales.com',
      phone: '+1 (305) 555-0123',
      verified: true,
    },
    status: 'active',
    verificationStatus: 'verified',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    ],
    specifications: {
      maxPassengers: 189,
      range: 3200,
      maxSpeed: 842,
      fuelCapacity: 26020,
      engines: 2,
      engineType: 'CFM56-7B26',
      length: 39.5,
      wingspan: 35.8,
      height: 12.5,
    },
    maintenanceHistory: [
      {
        date: '2024-01-15',
        type: 'C-Check',
        description: 'Major maintenance inspection completed',
        hours: 14000,
        facility: 'Boeing Service Center',
      },
      {
        date: '2023-07-20',
        type: 'A-Check',
        description: 'Routine maintenance inspection',
        hours: 12000,
        facility: 'Local Maintenance Facility',
      },
    ],
    documents: [
      { name: 'Certificate of Airworthiness', type: 'pdf', size: '2.3 MB' },
      { name: 'Maintenance Log', type: 'pdf', size: '15.7 MB' },
      { name: 'Engine Logs', type: 'pdf', size: '8.1 MB' },
      { name: 'Aircraft Photos', type: 'zip', size: '45.2 MB' },
    ],
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSeller = () => {
    setIsContactModalOpen(true);
  };

  const handleReserveClient = () => {
    toast.success('Клиент забронирован! Вы получите эксклюзивные права на работу с этим покупателем.');
  };

  const tabs = [
    { id: 'overview', name: 'Обзор', icon: DocumentTextIcon },
    { id: 'specifications', name: 'Характеристики', icon: DocumentTextIcon },
    { id: 'maintenance', name: 'Техобслуживание', icon: DocumentTextIcon },
    { id: 'documents', name: 'Документы', icon: DocumentTextIcon },
    { id: 'photos', name: 'Фотографии', icon: CameraIcon },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-aviation-600">Главная</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/aircraft" className="hover:text-aviation-600">Самолеты</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{aircraft.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={aircraft.images[0]}
                  alt={aircraft.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {aircraft.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${aircraft.title} ${index + 1}`}
                      className="w-20 h-16 object-cover rounded border border-gray-200 cursor-pointer hover:border-aviation-500"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-aviation-500 text-aviation-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 inline mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>
                    <p className="text-gray-600 mb-6">{aircraft.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <CalendarIcon className="w-6 h-6 text-aviation-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Год выпуска</div>
                        <div className="font-semibold">{aircraft.yearBuilt}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <ClockIcon className="w-6 h-6 text-aviation-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Налет часов</div>
                        <div className="font-semibold">{aircraft.totalFlightHours.toLocaleString()}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <MapPinIcon className="w-6 h-6 text-aviation-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Местоположение</div>
                        <div className="font-semibold">{aircraft.location}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <CurrencyDollarIcon className="w-6 h-6 text-aviation-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Цена</div>
                        <div className="font-semibold">{formatPrice(aircraft.price, aircraft.currency)}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Технические характеристики</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Основные характеристики</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Максимальная вместимость:</dt>
                            <dd className="font-medium">{aircraft.specifications.maxPassengers} пассажиров</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Дальность полета:</dt>
                            <dd className="font-medium">{aircraft.specifications.range} км</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Максимальная скорость:</dt>
                            <dd className="font-medium">{aircraft.specifications.maxSpeed} км/ч</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Емкость топливных баков:</dt>
                            <dd className="font-medium">{aircraft.specifications.fuelCapacity} л</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Габариты</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Длина:</dt>
                            <dd className="font-medium">{aircraft.specifications.length} м</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Размах крыльев:</dt>
                            <dd className="font-medium">{aircraft.specifications.wingspan} м</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Высота:</dt>
                            <dd className="font-medium">{aircraft.specifications.height} м</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Количество двигателей:</dt>
                            <dd className="font-medium">{aircraft.specifications.engines}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {/* Maintenance Tab */}
                {activeTab === 'maintenance' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">История технического обслуживания</h3>
                    <div className="space-y-4">
                      {aircraft.maintenanceHistory.map((maintenance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{maintenance.type}</h4>
                            <span className="text-sm text-gray-500">{maintenance.date}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{maintenance.description}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Налет часов: {maintenance.hours.toLocaleString()}</span>
                            <span>{maintenance.facility}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Документы</h3>
                    <div className="space-y-3">
                      {aircraft.documents.map((document, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">{document.name}</div>
                              <div className="text-sm text-gray-500">{document.size}</div>
                            </div>
                          </div>
                          <button className="text-aviation-600 hover:text-aviation-700 text-sm font-medium">
                            Скачать
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Фотографии</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {aircraft.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${aircraft.title} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-3xl font-bold text-aviation-600 mb-2">
                {formatPrice(aircraft.price, aircraft.currency)}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {aircraft.status === 'active' && 'Доступен для покупки'}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleContactSeller}
                  className="w-full bg-aviation-600 hover:bg-aviation-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Связаться с продавцом
                </button>
                <button
                  onClick={handleReserveClient}
                  className="w-full bg-white hover:bg-gray-50 text-aviation-600 border border-aviation-600 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Забронировать клиента
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Продавец</h3>
              <div className="flex items-center mb-4">
                <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="font-medium">{aircraft.seller.name}</span>
                {aircraft.seller.verified && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Проверен
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{aircraft.seller.phone}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{aircraft.seller.email}</span>
                </div>
              </div>
            </div>

            {/* Aircraft Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о самолете</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Серийный номер:</dt>
                  <dd className="font-medium">{aircraft.serialNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Регистрационный номер:</dt>
                  <dd className="font-medium">{aircraft.registrationNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Количество посадок:</dt>
                  <dd className="font-medium">{aircraft.totalLandings.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Статус верификации:</dt>
                  <dd className="font-medium">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {aircraft.verificationStatus}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AircraftDetail; 