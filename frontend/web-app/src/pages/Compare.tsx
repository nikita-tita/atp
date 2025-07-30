import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrashIcon,
  StarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Расширенные данные самолетов (те же, что и в AircraftList)
const aircraftData = [
  {
    id: 1,
    manufacturer: 'Gulfstream',
    model: 'G650',
    series: '6062',
    registration: 'OE-LVJ',
    year: 2014,
    status: 'FS',
    ttaf: 5340,
    landings: 1980,
    price: 'Inquire',
    location: 'Schwechat, Austria',
    mtow: '99,598 Lbs',
    engines: 2,
    engineType: 'RR BR700-725A1-12',
    maintenancePlan: 'RR CorporateCare',
    interior: 'Executive',
    passengers: 14,
    color: 'White w/Blue & Red',
    range: '7,000 nm',
    maxSpeed: 'Mach 0.925',
    fuelCapacity: '41,300 lbs',
    length: '99.8 ft',
    wingspan: '99.6 ft',
    height: '20.4 ft',
    cabinLength: '46.8 ft',
    cabinWidth: '6.5 ft',
    cabinHeight: '6.2 ft',
    baggageCapacity: '175 cu ft',
  },
  {
    id: 2,
    manufacturer: 'Gulfstream',
    model: 'G650',
    series: '6088',
    registration: 'N380SE',
    year: 2014,
    status: 'FS',
    ttaf: 3600,
    landings: 1450,
    price: 'Inquire',
    location: 'Miami, FL',
    mtow: '99,598 Lbs',
    engines: 2,
    engineType: 'RR BR700-725A1-12',
    maintenancePlan: 'RR CorporateCare',
    interior: 'Executive',
    passengers: 14,
    color: 'White w/Gold',
    range: '7,000 nm',
    maxSpeed: 'Mach 0.925',
    fuelCapacity: '41,300 lbs',
    length: '99.8 ft',
    wingspan: '99.6 ft',
    height: '20.4 ft',
    cabinLength: '46.8 ft',
    cabinWidth: '6.5 ft',
    cabinHeight: '6.2 ft',
    baggageCapacity: '175 cu ft',
  },
  {
    id: 3,
    manufacturer: 'Bombardier',
    model: 'Global 6000',
    series: '7001',
    registration: 'N123AB',
    year: 2016,
    status: 'FS-Unv',
    ttaf: 2800,
    landings: 1200,
    price: '$45,000,000',
    location: 'Los Angeles, CA',
    mtow: '99,500 Lbs',
    engines: 2,
    engineType: 'RR BR710A2-20',
    maintenancePlan: 'RR CorporateCare',
    interior: 'Executive',
    passengers: 13,
    color: 'White w/Silver',
    range: '6,000 nm',
    maxSpeed: 'Mach 0.89',
    fuelCapacity: '43,090 lbs',
    length: '99.4 ft',
    wingspan: '94.0 ft',
    height: '25.5 ft',
    cabinLength: '43.3 ft',
    cabinWidth: '7.2 ft',
    cabinHeight: '6.2 ft',
    baggageCapacity: '195 cu ft',
  },
];

const statusConfig = {
  'FS': { label: 'For Sale', color: 'bg-green-100 text-green-800' },
  'FS-Unv': { label: 'For Sale (Unverified)', color: 'bg-yellow-100 text-yellow-800' },
  'FS-Pndg': { label: 'For Sale (Pending)', color: 'bg-orange-100 text-orange-800' },
  'Not FS': { label: 'Not For Sale', color: 'bg-gray-100 text-gray-800' },
};

export default function Compare() {
  const [comparison, setComparison] = useState<number[]>([1, 2, 3]); // Mock данные для демонстрации
  const [favorites, setFavorites] = useState<number[]>([]);

  const selectedAircraft = aircraftData.filter(aircraft => comparison.includes(aircraft.id));

  const removeFromComparison = (id: number) => {
    setComparison(prev => prev.filter(comp => comp !== id));
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const comparisonCategories = [
    {
      name: 'Основная информация',
      fields: [
        { key: 'manufacturer', label: 'Производитель' },
        { key: 'model', label: 'Модель' },
        { key: 'registration', label: 'Регистрация' },
        { key: 'year', label: 'Год выпуска' },
        { key: 'status', label: 'Статус' },
        { key: 'price', label: 'Цена' },
        { key: 'location', label: 'Местоположение' },
      ]
    },
    {
      name: 'Летные характеристики',
      fields: [
        { key: 'ttaf', label: 'TTAF (часы)' },
        { key: 'landings', label: 'Посадки' },
        { key: 'range', label: 'Дальность полета' },
        { key: 'maxSpeed', label: 'Максимальная скорость' },
        { key: 'fuelCapacity', label: 'Емкость топливных баков' },
      ]
    },
    {
      name: 'Размеры',
      fields: [
        { key: 'length', label: 'Длина' },
        { key: 'wingspan', label: 'Размах крыла' },
        { key: 'height', label: 'Высота' },
        { key: 'mtow', label: 'Максимальная взлетная масса' },
      ]
    },
    {
      name: 'Салон',
      fields: [
        { key: 'passengers', label: 'Пассажиры' },
        { key: 'cabinLength', label: 'Длина салона' },
        { key: 'cabinWidth', label: 'Ширина салона' },
        { key: 'cabinHeight', label: 'Высота салона' },
        { key: 'baggageCapacity', label: 'Объем багажного отделения' },
        { key: 'interior', label: 'Конфигурация салона' },
        { key: 'color', label: 'Цвет' },
      ]
    },
    {
      name: 'Двигатели',
      fields: [
        { key: 'engines', label: 'Количество двигателей' },
        { key: 'engineType', label: 'Тип двигателя' },
        { key: 'maintenancePlan', label: 'План обслуживания' },
      ]
    },
  ];

  const formatValue = (aircraft: any, key: string) => {
    const value = aircraft[key];
    
    if (key === 'status') {
      const status = statusConfig[value as keyof typeof statusConfig];
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
          {status?.label}
        </span>
      );
    }
    
    if (key === 'ttaf' || key === 'landings') {
      return value.toLocaleString();
    }
    
    if (key === 'price' && value === 'Inquire') {
      return <span className="text-primary-600 font-medium">По запросу</span>;
    }
    
    return value;
  };

  if (selectedAircraft.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-gray-400 text-8xl mb-6">✈️</div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Нет самолетов для сравнения
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Добавьте самолеты в список сравнения
            </p>
            <Link
              to="/aircraft"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться к каталогу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                СРАВНЕНИЕ САМОЛЕТОВ
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                Сравните характеристики выбранных самолетов для принятия оптимального решения
              </p>
            </div>
            <Link
              to="/aircraft"
              className="flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Вернуться к каталогу
            </Link>
          </div>
        </div>

        {/* Карточки самолетов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {selectedAircraft.map((aircraft) => (
            <div key={aircraft.id} className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {aircraft.year} {aircraft.manufacturer} {aircraft.model}
                  </h3>
                  <p className="text-sm text-gray-500">{aircraft.registration}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleFavorite(aircraft.id)}
                    className="p-1 text-gray-400 hover:text-yellow-500"
                  >
                    {favorites.includes(aircraft.id) ? (
                      <StarIconSolid className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <StarIcon className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => removeFromComparison(aircraft.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[aircraft.status as keyof typeof statusConfig]?.color}`}>
                  {statusConfig[aircraft.status as keyof typeof statusConfig]?.label}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Цена:</span>
                  <span className="font-medium">{aircraft.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TTAF:</span>
                  <span className="font-medium">{aircraft.ttaf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Пассажиры:</span>
                  <span className="font-medium">{aircraft.passengers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Местоположение:</span>
                  <span className="font-medium">{aircraft.location}</span>
                </div>
              </div>

              <Link
                to={`/aircraft/${aircraft.id}`}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Подробнее
              </Link>
            </div>
          ))}
        </div>

        {/* Таблица сравнения */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Характеристика
                  </th>
                  {selectedAircraft.map((aircraft) => (
                    <th key={aircraft.id} className="px-8 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      {aircraft.year} {aircraft.manufacturer} {aircraft.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {comparisonCategories.map((category) => (
                  <React.Fragment key={category.name}>
                    <tr className="bg-gray-100">
                      <td colSpan={selectedAircraft.length + 1} className="px-8 py-4 text-sm font-semibold text-black">
                        {category.name}
                      </td>
                    </tr>
                    {category.fields.map((field) => (
                      <tr key={field.key} className="hover:bg-gray-50">
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {field.label}
                        </td>
                        {selectedAircraft.map((aircraft) => (
                          <td key={aircraft.id} className="px-8 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatValue(aircraft, field.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Панель действий */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-lg font-medium text-black">
            Сравнивается {selectedAircraft.length} из 5 самолетов
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
              Экспорт в PDF
            </button>
            <button className="px-6 py-3 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors">
              Экспорт в Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 