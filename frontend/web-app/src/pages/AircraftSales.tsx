import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const AircraftSales: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'listings' | 'requests'>('listings');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: 'All',
    yearFrom: '',
    yearTo: '',
    priceMin: '',
    priceMax: '',
    location: ''
  });

  // Mock data for listings
  const mockListings = [
    {
      id: 1,
      manufacturer: 'Boeing',
      model: '737-800',
      year: 2015,
      price: 45000000,
      hours: 28500,
      cycles: 18200,
      seats: 189,
      location: 'Miami, FL, USA',
      status: 'available',
      images: [getPublicPath('/images/boeing-737.jpg')]
    },
    {
      id: 2,
      manufacturer: 'Airbus',
      model: 'A320-200',
      year: 2018,
      price: 52000000,
      hours: 15600,
      cycles: 9800,
      seats: 180,
      location: 'London, UK',
      status: 'available',
      images: [getPublicPath('/images/airbus-a320.jpg')]
    }
  ];

  // Mock data for requests
  const mockRequests = [
    {
      id: 1,
      buyer: 'Atlantic Airways',
      manufacturer: 'Boeing',
      model: '777-300ER',
      yearRange: '2010-2020',
      maxPrice: 150000000,
      maxHours: 50000,
      deliveryDate: '2025-Q2',
      requirements: 'ETOPS certified, cargo configuration preferred'
    },
    {
      id: 2,
      buyer: 'European Regional Airlines',
      manufacturer: 'Airbus',
      model: 'A320-200',
      yearRange: '2014-2021',
      maxPrice: 52000000,
      maxHours: 30000,
      deliveryDate: '2025-Q1',
      requirements: 'High-density seating, European operations ready'
    }
  ];

  const filteredListings = mockListings.filter((a) => {
    if (filters.manufacturer !== 'All' && a.manufacturer !== filters.manufacturer) return false;
    if (filters.yearFrom && a.year < Number(filters.yearFrom)) return false;
    if (filters.yearTo && a.year > Number(filters.yearTo)) return false;
    if (filters.priceMin && a.price < Number(filters.priceMin)) return false;
    if (filters.priceMax && a.price > Number(filters.priceMax)) return false;
    if (filters.location && !a.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!(a.manufacturer.toLowerCase().includes(s) || a.model.toLowerCase().includes(s) || a.location.toLowerCase().includes(s))) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light mb-6">
              {t('home.categories.sales.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              {t('home.categories.sales.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('listings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'listings'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('sales.tabs.listings')}
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('sales.tabs.requests')}
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'listings' && (
          <div>
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
                      <option>All</option>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.priceMin')}</label>
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('market.filters.priceMax')}</label>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
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
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Aircraft Listings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredListings.map((aircraft) => (
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
                        <p className="text-sm text-gray-500">Year: {aircraft.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${aircraft.price.toLocaleString()}
                        </p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {aircraft.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Flight Hours:</span> {aircraft.hours.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Cycles:</span> {aircraft.cycles.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Seats:</span> {aircraft.seats}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {aircraft.location}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link
                        to={`/aircraft/${aircraft.id}`}
                        className="flex-1 text-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 py-2 px-4 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                        Contact Seller
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            {/* Buyer Requests */}
            <div className="space-y-6">
              {mockRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.buyer}</h3>
                      <p className="text-sm text-gray-500">Looking for: {request.manufacturer} {request.model}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {t('sales.requests.active')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">{t('sales.requests.yearRange')}:</span>
                      <p className="text-gray-600">{request.yearRange}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('sales.requests.maxPrice')}:</span>
                      <p className="text-gray-600">${request.maxPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('sales.requests.maxHours')}:</span>
                      <p className="text-gray-600">{request.maxHours.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('sales.requests.delivery')}:</span>
                      <p className="text-gray-600">{request.deliveryDate}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="font-medium text-gray-700">{t('sales.requests.specialRequirements')}:</span>
                    <p className="text-gray-600 mt-1">{request.requirements}</p>
                  </div>
                  
                  <button className="w-full sm:w-auto py-2 px-6 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                    {t('sales.requests.submitProposal')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AircraftSales;
