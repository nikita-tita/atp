import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ComplianceModal from '../components/ComplianceModal';
import ReserveClientModal from '../components/ReserveClientModal';

const AircraftDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [compliancePassed, setCompliancePassed] = useState(false);

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
      '/images/Global Express Jet_0.jpg',
      '/images/Bombardier-Global-6000-sales-01-1536x771.jpg.webp',
      '/images/cff5ba0469b909cc9cfb2b892c13407f8a9435c6.jpeg',
      '/images/xjcid1avepox27tm0jxglg33ltpmod0b.jpg',
      '/images/image_3EyOkbE.jpg',
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

  const handleComplianceCheck = () => {
    setIsComplianceModalOpen(true);
  };

  const handleReserveClient = () => {
    setIsReserveModalOpen(true);
  };

  const handleComplianceSuccess = () => {
    setCompliancePassed(true);
    toast.success('Комплаенс-проверка пройдена! Теперь вы можете связаться с продавцом.');
  };

  const handleReserveSuccess = () => {
    toast.success('Клиент забронирован! Вы получите эксклюзивные права на работу с этим покупателем.');
  };

  if (!aircraft) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Самолет не найден</h1>
            <p className="mt-2 text-gray-600">Запрашиваемый самолет не существует или был удален.</p>
            <Link to="/aircraft" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-aviation-600 hover:bg-aviation-700">
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-aviation-600">
                Главная
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/aircraft" className="ml-1 text-sm font-medium text-gray-700 hover:text-aviation-600 md:ml-2">
                  Самолеты
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{aircraft.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={aircraft.images[0]}
                  alt={aircraft.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {aircraft.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${aircraft.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Обзор' },
                    { id: 'specifications', name: 'Характеристики' },
                    { id: 'maintenance', name: 'Обслуживание' },
                    { id: 'documents', name: 'Документы' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-aviation-500 text-aviation-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Описание</h3>
                    <p className="text-gray-600 mb-6">{aircraft.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-aviation-600">{aircraft.yearBuilt}</div>
                        <div className="text-sm text-gray-500">Год выпуска</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-aviation-600">{aircraft.totalFlightHours.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Часов налета</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-aviation-600">{aircraft.totalLandings.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Посадок</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-aviation-600">{aircraft.specifications.maxPassengers}</div>
                        <div className="text-sm text-gray-500">Пассажиров</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Технические характеристики</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Основные параметры</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Длина:</dt>
                            <dd className="font-medium">{aircraft.specifications.length} м</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Размах крыла:</dt>
                            <dd className="font-medium">{aircraft.specifications.wingspan} м</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Высота:</dt>
                            <dd className="font-medium">{aircraft.specifications.height} м</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Дальность полета:</dt>
                            <dd className="font-medium">{aircraft.specifications.range} км</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Максимальная скорость:</dt>
                            <dd className="font-medium">{aircraft.specifications.maxSpeed} км/ч</dd>
                          </div>
                        </dl>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Двигатели</h4>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Количество:</dt>
                            <dd className="font-medium">{aircraft.specifications.engines}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Тип:</dt>
                            <dd className="font-medium">{aircraft.specifications.engineType}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-500">Емкость топливных баков:</dt>
                            <dd className="font-medium">{aircraft.specifications.fuelCapacity} л</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">История обслуживания</h3>
                    <div className="space-y-4">
                      {aircraft.maintenanceHistory.map((maintenance, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{maintenance.type}</h4>
                            <span className="text-sm text-gray-500">{maintenance.date}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{maintenance.description}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Часы: {maintenance.hours.toLocaleString()}</span>
                            <span>{maintenance.facility}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                          <button className="text-aviation-600 hover:text-aviation-700 font-medium">
                            Скачать
                          </button>
                        </div>
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
                  onClick={handleComplianceCheck}
                  className="w-full bg-aviation-600 hover:bg-aviation-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {compliancePassed ? 'Связаться с продавцом' : 'Пройти комплаенс-проверку'}
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
              
              {compliancePassed ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{aircraft.seller.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{aircraft.seller.email}</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Комплаенс-проверка пройдена. Контактная информация доступна.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>••••••••••••</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span>••••••••••••</span>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Контактная информация будет доступна после прохождения комплаенс-проверки
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Aircraft Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Информация о самолете</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Производитель:</span>
                  <span className="font-medium">{aircraft.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Модель:</span>
                  <span className="font-medium">{aircraft.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Серийный номер:</span>
                  <span className="font-medium">{aircraft.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Регистрация:</span>
                  <span className="font-medium">{aircraft.registrationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Местоположение:</span>
                  <span className="font-medium">{aircraft.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ComplianceModal
          isOpen={isComplianceModalOpen}
          onClose={() => setIsComplianceModalOpen(false)}
          onSuccess={handleComplianceSuccess}
          aircraft={{
            title: aircraft.title,
            price: aircraft.price,
            currency: aircraft.currency
          }}
        />

        <ReserveClientModal
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          onSuccess={handleReserveSuccess}
          aircraft={{
            title: aircraft.title,
            price: aircraft.price,
            currency: aircraft.currency,
            seller: aircraft.seller
          }}
        />
      </div>
    </div>
  );
};

export default AircraftDetail; 