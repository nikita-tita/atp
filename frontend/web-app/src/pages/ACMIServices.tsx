import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  GlobeAltIcon, 
  UserGroupIcon, 
  WrenchScrewdriverIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const ACMIServices: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: 'All',
    yearFrom: '',
    yearTo: '',
    monthlyMin: '',
    monthlyMax: '',
    base: ''
  });

  // Mock data for ACMI services
  const mockACMIServices = [
    {
      id: 1,
      manufacturer: 'Boeing',
      model: '737-800',
      year: 2017,
      monthlyRate: 580000,
      hours: 25000,
      cycles: 16500,
      seats: 189,
      baseLocation: 'Frankfurt, Germany',
      operationalRegions: ['Europe', 'Middle East', 'North Africa'],
      crewNationalities: ['German', 'British', 'French'],
      minLeaseTerm: 6,
      maxLeaseTerm: 60,
      availability: '2025-02-01',
      certifications: ['EASA', 'FAA'],
      images: [getPublicPath('/images/boeing-737.jpg')]
    },
    {
      id: 2,
      manufacturer: 'Airbus',
      model: 'A320-200',
      year: 2019,
      monthlyRate: 620000,
      hours: 18000,
      cycles: 11800,
      seats: 180,
      baseLocation: 'Dubai, UAE',
      operationalRegions: ['Middle East', 'Asia', 'Africa'],
      crewNationalities: ['UAE', 'British', 'Indian'],
      minLeaseTerm: 12,
      maxLeaseTerm: 72,
      availability: '2025-03-15',
      certifications: ['GCAA', 'EASA'],
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
              {t('home.categories.acmi.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('home.categories.acmi.description')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <GlobeAltIcon className="h-12 w-12 mx-auto mb-3 text-blue-400" />
                <h3 className="font-semibold">{t('acmi.cards.aircraft')}</h3>
                <p className="text-sm text-gray-300">{t('acmi.cards.aircraftDesc')}</p>
              </div>
              <div className="text-center">
                <UserGroupIcon className="h-12 w-12 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold">{t('acmi.cards.crew')}</h3>
                <p className="text-sm text-gray-300">{t('acmi.cards.crewDesc')}</p>
              </div>
              <div className="text-center">
                <WrenchScrewdriverIcon className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                <h3 className="font-semibold">{t('acmi.cards.maintenance')}</h3>
                <p className="text-sm text-gray-300">{t('acmi.cards.maintenanceDesc')}</p>
              </div>
              <div className="text-center">
                <ShieldCheckIcon className="h-12 w-12 mx-auto mb-3 text-red-400" />
                <h3 className="font-semibold">{t('acmi.cards.insurance')}</h3>
                <p className="text-sm text-gray-300">{t('acmi.cards.insuranceDesc')}</p>
              </div>
            </div>
          </div>
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
              {t('market.filters.searchACMI')}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.base')}</label>
                <input
                  type="text"
                  value={filters.base}
                  onChange={(e) => setFilters((f) => ({ ...f, base: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="City, Country"
                />
              </div>
            </div>
          )}
        </div>

        {/* ACMI Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockACMIServices
            .filter((s) => {
              if (filters.manufacturer !== 'All' && s.manufacturer !== filters.manufacturer) return false;
              if (filters.yearFrom && s.year < Number(filters.yearFrom)) return false;
              if (filters.yearTo && s.year > Number(filters.yearTo)) return false;
              if (filters.monthlyMin && s.monthlyRate < Number(filters.monthlyMin)) return false;
              if (filters.monthlyMax && s.monthlyRate > Number(filters.monthlyMax)) return false;
              if (filters.base && !s.baseLocation.toLowerCase().includes(filters.base.toLowerCase())) return false;
              if (search) {
                const q = search.toLowerCase();
                if (!(s.manufacturer.toLowerCase().includes(q) || s.model.toLowerCase().includes(q) || s.baseLocation.toLowerCase().includes(q))) return false;
              }
              return true;
            })
            .map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={service.images[0]}
                  alt={`${service.manufacturer} ${service.model}`}
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
                      {service.manufacturer} {service.model}
                    </h3>
                    <p className="text-sm text-gray-500">{t('aircraft.card.year')}: {service.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${service.monthlyRate.toLocaleString()}/mo
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {t('leasing.card.availableFrom', { date: service.availability })}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">{t('comparePage.flightHours')}:</span> {service.hours.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">{t('aircraft.card.cycles')}:</span> {service.cycles.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">{t('aircraft.card.seats')}:</span> {service.seats}
                  </div>
                  <div>
                    <span className="font-medium">{t('market.filters.base')}:</span> {service.baseLocation}
                  </div>
                </div>

                {/* Operational Regions */}
                <div className="mb-4">
                  <span className="font-medium text-gray-700 text-sm">{t('acmi.card.operationalRegions')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.operationalRegions.map((region, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {region}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Crew Nationalities */}
                <div className="mb-4">
                  <span className="font-medium text-gray-700 text-sm">{t('acmi.card.crewNationalities')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.crewNationalities.map((nationality, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {nationality}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-4">
                  <span className="font-medium text-gray-700 text-sm">{t('acmi.card.certifications')}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('leasing.card.leaseTerm')}:</span>
                    <span>{t('leasing.card.leaseTermRange', { min: service.minLeaseTerm, max: service.maxLeaseTerm })}</span>
                  </div>
                </div>

                {/* ACMI Inclusions */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{t('acmi.card.packageIncludes')}</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('acmi.cards.aircraft')}
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('acmi.card.flightCrew')}
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('acmi.card.cabinCrew')}
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('acmi.cards.maintenance')}
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('acmi.cards.insurance')}
                    </div>
                    <div className="flex items-center text-green-600">
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {t('acmi.card.training')}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    to={`/aircraft/${service.id}`}
                    className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t('aircraft.card.viewDetails')}
                  </Link>
                  <button className="flex-1 py-2 px-4 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                    {t('acmi.actions.requestQuote')}
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

export default ACMIServices;
