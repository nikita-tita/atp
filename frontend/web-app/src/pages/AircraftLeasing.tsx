import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AircraftLeasing: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'dry' | 'wet'>('dry');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: 'All',
    yearFrom: '',
    yearTo: '',
    monthlyMin: '',
    monthlyMax: '',
    location: ''
  });

  // Mock data for dry lease
  const mockDryLease = [
    {
      id: 1,
      manufacturer: 'Boeing',
      model: '737-800',
      year: 2016,
      monthlyRate: 280000,
      hours: 32000,
      cycles: 20500,
      seats: 189,
      location: 'Dublin, Ireland',
      minLeaseTerm: 24,
      maxLeaseTerm: 120,
      availability: '2025-03-01',
      images: [getPublicPath('/images/boeing-737.jpg')]
    },
    {
      id: 2,
      manufacturer: 'Airbus',
      model: 'A320-200',
      year: 2019,
      monthlyRate: 320000,
      hours: 18500,
      cycles: 11200,
      seats: 180,
      location: 'Singapore',
      minLeaseTerm: 36,
      maxLeaseTerm: 144,
      availability: '2025-02-15',
      images: [getPublicPath('/images/airbus-a320.jpg')]
    }
  ];

  // Mock data for wet lease
  const mockWetLease = [
    {
      id: 1,
      manufacturer: 'Boeing',
      model: '737-800',
      year: 2016,
      monthlyRate: 520000,
      hours: 30000,
      cycles: 19500,
      seats: 189,
      location: 'Warsaw, Poland',
      crewIncluded: true,
      maintenanceIncluded: true,
      insuranceIncluded: true,
      minLeaseTerm: 6,
      maxLeaseTerm: 36,
      availability: '2025-01-15',
      images: [getPublicPath('/images/boeing-737.jpg')]
    },
    {
      id: 2,
      manufacturer: 'Airbus',
      model: 'A320-200',
      year: 2018,
      monthlyRate: 560000,
      hours: 20000,
      cycles: 12500,
      seats: 180,
      location: 'Madrid, Spain',
      crewIncluded: true,
      maintenanceIncluded: true,
      insuranceIncluded: true,
      minLeaseTerm: 6,
      maxLeaseTerm: 48,
      availability: '2025-04-01',
      images: [getPublicPath('/images/airbus-a320.jpg')]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              {t('home.categories.leasing.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('home.categories.leasing.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dry')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'dry'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ClockIcon className="h-5 w-5 mr-2" />
              {t('leasing.tabs.dry')}
            </button>
            <button
              onClick={() => setActiveTab('wet')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'wet'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              {t('leasing.tabs.wet')}
            </button>
          </nav>
        </div>
      </div>

      {/* Lease Type Information */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {activeTab === 'dry' ? (
            <div className="text-sm text-blue-800">
              <strong>{t('leasing.info.dryTitle')} </strong>
              {t('leasing.info.dryText')}
            </div>
          ) : (
            <div className="text-sm text-blue-800">
              <strong>{t('leasing.info.wetTitle')} </strong>
              {t('leasing.info.wetText')}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('market.filters.search') as string}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              {t('market.filters.filters')}
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
              {t('market.filters.searchAircraft')}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.manufacturer')}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={filters.manufacturer}
                  onChange={(e) => setFilters((f) => ({ ...f, manufacturer: e.target.value }))}
                >
                  <option value="All">{t('common.all')}</option>
                  <option>Boeing</option>
                  <option>Airbus</option>
                  <option>Comac</option>
                  <option>Mitsubishi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.yearFrom')}</label>
                <input
                  type="number"
                  value={filters.yearFrom}
                  onChange={(e) => setFilters((f) => ({ ...f, yearFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.yearTo')}</label>
                <input
                  type="number"
                  value={filters.yearTo}
                  onChange={(e) => setFilters((f) => ({ ...f, yearTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.monthlyMin')}</label>
                <input
                  type="number"
                  value={filters.monthlyMin}
                  onChange={(e) => setFilters((f) => ({ ...f, monthlyMin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.monthlyMax')}</label>
                <input
                  type="number"
                  value={filters.monthlyMax}
                  onChange={(e) => setFilters((f) => ({ ...f, monthlyMax: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.location')}</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder={t('form.locationPlaceholder') as string}
                />
              </div>
            </div>
          )}
        </div>

        {/* Aircraft Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(activeTab === 'dry' ? mockDryLease : mockWetLease)
            .filter((a) => {
              if (filters.manufacturer !== 'All' && a.manufacturer !== filters.manufacturer) return false;
              if (filters.yearFrom && a.year < Number(filters.yearFrom)) return false;
              if (filters.yearTo && a.year > Number(filters.yearTo)) return false;
              if (filters.monthlyMin && a.monthlyRate < Number(filters.monthlyMin)) return false;
              if (filters.monthlyMax && a.monthlyRate > Number(filters.monthlyMax)) return false;
              if (filters.location && !a.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
              if (search) {
                const s = search.toLowerCase();
                if (!(a.manufacturer.toLowerCase().includes(s) || a.model.toLowerCase().includes(s) || a.location.toLowerCase().includes(s))) {
                  return false;
                }
              }
              return true;
            })
            .map((aircraft) => (
            <div key={aircraft.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={aircraft.images[0]}
                  alt={`${aircraft.manufacturer} ${aircraft.model}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {aircraft.manufacturer} {aircraft.model}
                    </h3>
                    <p className="text-sm text-gray-500">{t('aircraft.card.year')}: {aircraft.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${aircraft.monthlyRate.toLocaleString()}/mo
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t('leasing.card.availableFrom', { date: aircraft.availability })}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">{t('comparePage.flightHours')}:</span> {aircraft.hours.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">{t('aircraft.card.cycles')}:</span> {aircraft.cycles.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">{t('aircraft.card.seats')}:</span> {aircraft.seats}
                  </div>
                  <div>
                    <span className="font-medium">{t('aircraft.card.location')}:</span> {aircraft.location}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('leasing.card.leaseTerm')}:</span>
                    <span>{t('leasing.card.leaseTermRange', { min: aircraft.minLeaseTerm, max: aircraft.maxLeaseTerm })}</span>
                  </div>
                  {activeTab === 'wet' && 'crewIncluded' in aircraft && (
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center text-green-600">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('leasing.card.crewIncluded')}
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('leasing.card.maintenanceIncluded')}
                      </div>
                      <div className="flex items-center text-green-600">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {t('leasing.card.insuranceIncluded')}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to={`/aircraft/${aircraft.id}`}
                    className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t('aircraft.card.viewDetails')}
                  </Link>
                  <button className="flex-1 py-2 px-4 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                    {t('leasing.actions.requestQuote')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AircraftLeasing;
