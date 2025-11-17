import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    manufacturer: 'Boeing',
    model: '737-800',
    series: 'NG',
    registration: 'N737BA',
    year: 2015,
    status: 'FS',
    ttaf: 15000,
    landings: 8500,
    price: '$25,000,000',
    location: 'Miami, USA',
    mtow: '174,200 Lbs',
    engines: 2,
    engineType: 'CFM56-7B',
    maintenancePlan: 'Boeing GoldCare',
    interior: 'Economy',
    passengers: 189,
    color: 'White w/Blue Livery',
    range: '3,060 nm',
    maxSpeed: 'Mach 0.82',
    fuelCapacity: '26,020 liters',
    length: '129.5 ft',
    wingspan: '117.5 ft',
    height: '41.2 ft',
    cabinLength: '105.7 ft',
    cabinWidth: '11.7 ft',
    cabinHeight: '7.1 ft',
    baggageCapacity: '1,555 cu ft',
  },
  {
    id: 2,
    manufacturer: 'Airbus',
    model: 'A320neo',
    series: 'neo',
    registration: 'F-A320N',
    year: 2020,
    status: 'FS',
    ttaf: 5000,
    landings: 3200,
    price: '$35,000,000',
    location: 'Paris, France',
    mtow: '174,165 Lbs',
    engines: 2,
    engineType: 'LEAP-1A',
    maintenancePlan: 'Airbus FHS',
    interior: 'Economy',
    passengers: 180,
    color: 'White w/Red Accents',
    range: '3,700 nm',
    maxSpeed: 'Mach 0.82',
    fuelCapacity: '26,730 liters',
    length: '123.3 ft',
    wingspan: '117.5 ft',
    height: '38.7 ft',
    cabinLength: '106.0 ft',
    cabinWidth: '12.1 ft',
    cabinHeight: '7.4 ft',
    baggageCapacity: '1,430 cu ft',
  },
  {
    id: 3,
    manufacturer: 'Comac',
    model: 'C919',
    series: 'C919-100',
    registration: 'B-919A',
    year: 2023,
    status: 'FS-Unv',
    ttaf: 500,
    landings: 250,
    price: '$65,000,000',
    location: 'Shanghai, China',
    mtow: '170,330 Lbs',
    engines: 2,
    engineType: 'LEAP-1C',
    maintenancePlan: 'COMAC Care',
    interior: 'Economy',
    passengers: 168,
    color: 'White w/Red Flag',
    range: '3,000 nm',
    maxSpeed: 'Mach 0.82',
    fuelCapacity: '26,100 liters',
    length: '127.5 ft',
    wingspan: '117.5 ft',
    height: '39.4 ft',
    cabinLength: '106.0 ft',
    cabinWidth: '12.3 ft',
    cabinHeight: '7.5 ft',
    baggageCapacity: '1,500 cu ft',
  },
];

const statusConfig = {
  'FS': { label: 'For Sale', color: 'bg-green-100 text-green-800' },
  'FS-Unv': { label: 'For Sale (Unverified)', color: 'bg-yellow-100 text-yellow-800' },
  'FS-Pndg': { label: 'For Sale (Pending)', color: 'bg-orange-100 text-orange-800' },
  'Not FS': { label: 'Not For Sale', color: 'bg-gray-100 text-gray-800' },
};

export default function Compare() {
  const { t } = useTranslation();
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
      name: t('comparePage.mainCharacteristics'),
      fields: [
        { key: 'manufacturer', label: t('comparePage.manufacturer') },
        { key: 'model', label: t('comparePage.model') },
        { key: 'registration', label: t('common.registration') },
        { key: 'year', label: t('comparePage.year') },
        { key: 'status', label: t('comparePage.status') },
        { key: 'price', label: t('comparePage.price') },
        { key: 'location', label: t('comparePage.location') },
      ]
    },
    {
      name: t('comparePage.performance'),
      fields: [
        { key: 'ttaf', label: t('comparePage.flightHours') },
        { key: 'landings', label: t('comparePage.cycles') },
        { key: 'range', label: t('comparePage.maxRange') },
        { key: 'maxSpeed', label: t('comparePage.maxSpeed') },
        { key: 'fuelCapacity', label: t('comparePage.fuelCapacity') },
      ]
    },
    {
      name: t('comparePage.dimensions'),
      fields: [
        { key: 'length', label: t('comparePage.length') },
        { key: 'wingspan', label: t('comparePage.wingspan') },
        { key: 'height', label: t('comparePage.height') },
        { key: 'mtow', label: t('comparePage.mtow') },
      ]
    },
    {
      name: t('comparePage.cabinConfiguration'),
      fields: [
        { key: 'passengers', label: t('comparePage.passengers') },
        { key: 'cabinLength', label: t('comparePage.cabinLength') },
        { key: 'cabinWidth', label: t('comparePage.cabinWidth') },
        { key: 'cabinHeight', label: t('comparePage.cabinHeight') },
        { key: 'baggageCapacity', label: t('common.baggageCapacity') },
        { key: 'interior', label: t('comparePage.interior') },
        { key: 'color', label: t('common.color') },
      ]
    },
    {
      name: t('comparePage.engines'),
      fields: [
        { key: 'engines', label: t('common.quantity') },
        { key: 'engineType', label: t('comparePage.engineType') },
        { key: 'maintenancePlan', label: t('comparePage.maintenancePlan') },
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
              {t('comparePage.emptyState.title')}
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              {t('comparePage.emptyState.subtitle')}
            </p>
            <Link
              to="/aircraft"
              className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('comparePage.backToCatalog')}
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
                {t('comparePage.title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                {t('comparePage.subtitle')}
              </p>
            </div>
            <Link
              to="/aircraft"
              className="flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              {t('comparePage.backToCatalog')}
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
                  <span className="text-gray-500">{t('comparePage.price')}:</span>
                  <span className="font-medium">{aircraft.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('comparePage.flightHours')}:</span>
                  <span className="font-medium">{aircraft.ttaf.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('comparePage.passengers')}:</span>
                  <span className="font-medium">{aircraft.passengers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('comparePage.location')}:</span>
                  <span className="font-medium">{aircraft.location}</span>
                </div>
              </div>

              <Link
                to={`/aircraft/${aircraft.id}`}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                {t('comparePage.viewDetails')}
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
                    {t('comparePage.specifications')}
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
            {t('comparePage.comparingAircraft', { count: selectedAircraft.length })}
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors">
              {t('comparePage.exportPDF')}
            </button>
            <button className="px-6 py-3 border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-colors">
              {t('comparePage.exportExcel')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 