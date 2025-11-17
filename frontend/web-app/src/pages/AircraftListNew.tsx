import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EyeIcon,
  ScaleIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { aircraftData, formatPrice } from '../data/aircraftData';

// Конвертируем данные из aircraftData в формат для AircraftList
const convertedAircraftData = aircraftData.map(aircraft => ({
  id: parseInt(aircraft.id),
  manufacturer: aircraft.manufacturer,
  model: aircraft.model,
  series: aircraft.registration.slice(-3),
  registration: aircraft.registration,
  year: aircraft.year,
  status: aircraft.status === 'active' ? 'FS' : 'FS-Pndg',
  ttaf: aircraft.hours,
  landings: aircraft.cycles,
  price: formatPrice(aircraft.price, aircraft.currency),
  location: aircraft.location,
  mtow: aircraft.specifications.maxTakeoffWeight,
  engines: 2,
  engineType: aircraft.specifications.engines,
  maintenancePlan: 'Standard',
  interior: 'Executive',
  passengers: aircraft.passengers,
  color: 'Standard',
  isFavorite: false,
  isInComparison: false,
  image: aircraft.image,
}));

const statusConfig = {
  'FS': { label: 'For Sale', color: 'bg-green-100 text-green-800' },
  'FS-Unv': { label: 'For Sale (Unverified)', color: 'bg-yellow-100 text-yellow-800' },
  'FS-Pndg': { label: 'For Sale (Pending)', color: 'bg-orange-100 text-orange-800' },
  'Not FS': { label: 'Not For Sale', color: 'bg-gray-100 text-gray-800' },
};

const manufacturers = ['All', 'Boeing', 'Airbus'];
const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014'];
const statuses = ['All', 'FS', 'FS-Unv', 'FS-Pndg', 'Not FS'];

export default function AircraftList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minTtaf, setMinTtaf] = useState('');
  const [maxTtaf, setMaxTtaf] = useState('');
  const [minLandings, setMinLandings] = useState('');
  const [maxLandings, setMaxLandings] = useState('');
  
  // Display states
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  
  // Comparison state
  const [comparisonList, setComparisonList] = useState<number[]>([]);
  
  // Favorite state
  const [favorites, setFavorites] = useState<number[]>([]);

  // Read initial filters from URL
  useEffect(() => {
    const manufacturer = searchParams.get('manufacturer');
    const model = searchParams.get('model');
    const price = searchParams.get('price');
    const year = searchParams.get('year');

    if (manufacturer) setSelectedManufacturer(manufacturer);
    if (model) setSelectedModel(model);
    if (year) setSelectedYear(year);
    if (price) {
      // Parse price range like "10-25" or "25-50"
      if (price === '0-10') {
        setMaxPrice('10000000');
      } else if (price === '10-25') {
        setMinPrice('10000000');
        setMaxPrice('25000000');
      } else if (price === '25-50') {
        setMinPrice('25000000');
        setMaxPrice('50000000');
      } else if (price === '50+') {
        setMinPrice('50000000');
      }
    }
  }, [searchParams]);

  // Get unique models for selected manufacturer
  const getModelsForManufacturer = (manufacturer: string) => {
    if (manufacturer === 'All') return ['All'];
    const models = convertedAircraftData
      .filter(aircraft => aircraft.manufacturer === manufacturer)
      .map(aircraft => aircraft.model);
    return ['All', ...Array.from(new Set(models))];
  };

  // Filter aircraft
  const filteredAircraft = convertedAircraftData.filter(aircraft => {
    const matchesSearch = searchTerm === '' || 
      aircraft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesManufacturer = selectedManufacturer === 'All' || aircraft.manufacturer === selectedManufacturer;
    const matchesModel = selectedModel === 'All' || aircraft.model === selectedModel;
    const matchesYear = selectedYear === 'All' || aircraft.year.toString() === selectedYear;
    const matchesStatus = selectedStatus === 'All' || aircraft.status === selectedStatus;
    
    // Price filtering (convert price string to number for comparison)
    const priceValue = typeof aircraft.price === 'string' && aircraft.price.includes('$') 
      ? parseInt(aircraft.price.replace(/[$,]/g, '')) 
      : 0;
    const matchesMinPrice = minPrice === '' || priceValue >= parseInt(minPrice);
    const matchesMaxPrice = maxPrice === '' || priceValue <= parseInt(maxPrice);
    
    const matchesMinTtaf = minTtaf === '' || aircraft.ttaf >= parseInt(minTtaf);
    const matchesMaxTtaf = maxTtaf === '' || aircraft.ttaf <= parseInt(maxTtaf);
    const matchesMinLandings = minLandings === '' || aircraft.landings >= parseInt(minLandings);
    const matchesMaxLandings = maxLandings === '' || aircraft.landings <= parseInt(maxLandings);

    return matchesSearch && matchesManufacturer && matchesModel && matchesYear && 
           matchesStatus && matchesMinPrice && matchesMaxPrice && 
           matchesMinTtaf && matchesMaxTtaf && matchesMinLandings && matchesMaxLandings;
  });

  // Sort aircraft
  const sortedAircraft = [...filteredAircraft].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'year':
        aValue = a.year;
        bValue = b.year;
        break;
      case 'price':
        aValue = typeof a.price === 'string' && a.price.includes('$') 
          ? parseInt(a.price.replace(/[$,]/g, '')) 
          : 0;
        bValue = typeof b.price === 'string' && b.price.includes('$') 
          ? parseInt(b.price.replace(/[$,]/g, '')) 
          : 0;
        break;
      case 'ttaf':
        aValue = a.ttaf;
        bValue = b.ttaf;
        break;
      case 'manufacturer':
        aValue = a.manufacturer;
        bValue = b.manufacturer;
        break;
      default:
        aValue = a.year;
        bValue = b.year;
    }
    
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Toggle comparison
  const toggleComparison = (id: number) => {
    if (comparisonList.includes(id)) {
      setComparisonList(comparisonList.filter(item => item !== id));
    } else {
      if (comparisonList.length >= 5) {
        alert(t('aircraft.maxCompareLimit'));
        return;
      }
      setComparisonList([...comparisonList, id]);
    }
  };

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('aircraft.title')}</h1>
          <p className="text-xl text-gray-600">
            {filteredAircraft.length} aircraft available
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('aircraft.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="px-6 py-4 border-b border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
              {showFilters ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Manufacturer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('aircraft.filters.manufacturer')}
                  </label>
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => {
                      setSelectedManufacturer(e.target.value);
                      setSelectedModel('All'); // Reset model when manufacturer changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {manufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('aircraft.filters.model')}
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {getModelsForManufacturer(selectedManufacturer).map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('aircraft.filters.year')}
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('aircraft.filters.status')}
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'All' ? t('aircraft.allStatuses') : statusConfig[status as keyof typeof statusConfig]?.label || status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price (USD)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={t('aircraft.fromPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price (USD)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={t('aircraft.toPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min TTAF (hours)
                  </label>
                  <input
                    type="number"
                    value={minTtaf}
                    onChange={(e) => setMinTtaf(e.target.value)}
                    placeholder={t('aircraft.fromPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max TTAF (hours)
                  </label>
                  <input
                    type="number"
                    value={maxTtaf}
                    onChange={(e) => setMaxTtaf(e.target.value)}
                    placeholder={t('aircraft.toPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort and View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="year">Year</option>
                <option value="price">Price</option>
                <option value="ttaf">TTAF</option>
                <option value="manufacturer">Manufacturer</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                {sortOrder === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Comparison Link */}
          {comparisonList.length > 0 && (
            <Link
              to="/compare"
              state={{ aircraftIds: comparisonList }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ScaleIcon className="h-4 w-4 mr-2" />
              Compare ({comparisonList.length})
            </Link>
          )}
        </div>

        {/* Aircraft Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAircraft.map((aircraft) => (
            <div key={aircraft.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Aircraft Image */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={aircraft.image}
                  alt={`${aircraft.manufacturer} ${aircraft.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[aircraft.status as keyof typeof statusConfig]?.color}`}>
                    {statusConfig[aircraft.status as keyof typeof statusConfig]?.label}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(aircraft.id)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    {favorites.includes(aircraft.id) ? 
                      <StarIconSolid className="h-4 w-4 text-yellow-500" /> : 
                      <StarIcon className="h-4 w-4 text-gray-600" />
                    }
                  </button>
                  <button
                    onClick={() => toggleComparison(aircraft.id)}
                    className={`p-2 rounded-full transition-colors ${
                      comparisonList.includes(aircraft.id) 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <ScaleIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Aircraft Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {aircraft.year} {aircraft.manufacturer} {aircraft.model}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">S/N: {aircraft.series}</p>
                <p className="text-sm text-gray-600 mb-4">Registration: {aircraft.registration}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">TTAF:</span>
                    <span className="ml-1 font-medium">{aircraft.ttaf.toLocaleString()} hrs</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cycles:</span>
                    <span className="ml-1 font-medium">{aircraft.landings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Passengers:</span>
                    <span className="ml-1 font-medium">{aircraft.passengers}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-1 font-medium">{aircraft.location}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold text-blue-600">
                    {aircraft.price}
                  </div>
                  <Link
                    to={`/aircraft/${aircraft.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    {t('aircraft.actions.viewDetails')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedAircraft.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">{t('aircraft.noResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
