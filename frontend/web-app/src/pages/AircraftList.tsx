import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

// Расширенные данные самолетов
const aircraftData = [
  {
    id: 1,
    manufacturer: 'Gulfstream',
    model: 'G650',
    series: '6062',
    registration: 'OE-LVJ',
    year: 2014,
    status: 'FS', // For Sale
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
    isFavorite: false,
    isInComparison: false,
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
    isFavorite: true,
    isInComparison: false,
  },
  {
    id: 3,
    manufacturer: 'Bombardier',
    model: 'Global 6000',
    series: '7001',
    registration: 'N123AB',
    year: 2016,
    status: 'FS-Unv', // For Sale Unverified
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
    isFavorite: false,
    isInComparison: false,
  },
  {
    id: 4,
    manufacturer: 'Cessna',
    model: 'Citation X',
    series: '750',
    registration: 'N456CD',
    year: 2013,
    status: 'FS-Pndg', // For Sale Pending
    ttaf: 4200,
    landings: 1800,
    price: '$12,500,000',
    location: 'Dallas, TX',
    mtow: '36,100 Lbs',
    engines: 2,
    engineType: 'AE 3007C1',
    maintenancePlan: 'Honeywell MSP',
    interior: 'Executive',
    passengers: 8,
    color: 'White w/Blue',
    isFavorite: false,
    isInComparison: false,
  },
  {
    id: 5,
    manufacturer: 'Dassault',
    model: 'Falcon 7X',
    series: '7001',
    registration: 'F-ABCD',
    year: 2015,
    status: 'Not FS', // Not For Sale
    ttaf: 3100,
    landings: 1400,
    price: 'N/A',
    location: 'Paris, France',
    mtow: '70,000 Lbs',
    engines: 3,
    engineType: 'PW307A',
    maintenancePlan: 'Pratt & Whitney ESP',
    interior: 'Executive',
    passengers: 12,
    color: 'White w/Gray',
    isFavorite: false,
    isInComparison: false,
  },
];

const statusConfig = {
  'FS': { label: 'For Sale', color: 'bg-green-100 text-green-800' },
  'FS-Unv': { label: 'For Sale (Unverified)', color: 'bg-yellow-100 text-yellow-800' },
  'FS-Pndg': { label: 'For Sale (Pending)', color: 'bg-orange-100 text-orange-800' },
  'Not FS': { label: 'Not For Sale', color: 'bg-gray-100 text-gray-800' },
};

const manufacturers = ['All', 'Gulfstream', 'Bombardier', 'Cessna', 'Dassault', 'Embraer', 'Airbus', 'Boeing'];
const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'];
const statuses = ['All', 'FS', 'FS-Unv', 'FS-Pndg', 'Not FS'];

export default function AircraftList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [ttafRange, setTtafRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('year');
  const [sortOrder, setSortOrder] = useState('desc');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparison, setComparison] = useState<number[]>([]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Обработка параметров поиска из главной страницы
    const manufacturer = searchParams.get('manufacturer') || '';
    if (manufacturer) {
      setSelectedManufacturer(manufacturer);
    }

    const model = searchParams.get('model') || '';
    if (model) {
      setSearchTerm(model);
    }

    const price = searchParams.get('price') || '';
    if (price) {
      // Преобразуем диапазон цен в min/max
      switch (price) {
        case '0-10':
          setPriceRange({ min: '0', max: '10000000' });
          break;
        case '10-25':
          setPriceRange({ min: '10000000', max: '25000000' });
          break;
        case '25-50':
          setPriceRange({ min: '25000000', max: '50000000' });
          break;
        case '50+':
          setPriceRange({ min: '50000000', max: '' });
          break;
      }
    }

    const year = searchParams.get('year') || '';
    if (year) {
      setSelectedYear(year);
    }

    // Обработка других параметров фильтрации
    const currentSearchTerm = searchParams.get('search') || '';
    if (!model) { // Не перезаписываем если есть параметр model
      setSearchTerm(currentSearchTerm);
    }

    const currentManufacturer = searchParams.get('manufacturer') || 'All';
    if (!manufacturer) { // Не перезаписываем если есть параметр manufacturer
      setSelectedManufacturer(currentManufacturer);
    }

    const currentYear = searchParams.get('year') || 'All';
    if (!year) { // Не перезаписываем если есть параметр year
      setSelectedYear(currentYear);
    }

    const currentStatus = searchParams.get('status') || 'All';
    setSelectedStatus(currentStatus);

    const currentPriceMin = searchParams.get('priceMin') || '';
    if (!price) { // Не перезаписываем если есть параметр price
      setPriceRange(prev => ({ ...prev, min: currentPriceMin }));
    }

    const currentPriceMax = searchParams.get('priceMax') || '';
    if (!price) { // Не перезаписываем если есть параметр price
      setPriceRange(prev => ({ ...prev, max: currentPriceMax }));
    }

    const currentTtafMin = searchParams.get('ttafMin') || '';
    setTtafRange(prev => ({ ...prev, min: currentTtafMin }));

    const currentTtafMax = searchParams.get('ttafMax') || '';
    setTtafRange(prev => ({ ...prev, max: currentTtafMax }));

    const currentSort = searchParams.get('sort') || 'year-desc';
    const [field, order] = currentSort.split('-');
    setSortBy(field);
    setSortOrder(order);

    const currentFavorites = searchParams.get('favorites')?.split(',').map(Number) || [];
    setFavorites(currentFavorites);

    const currentComparison = searchParams.get('comparison')?.split(',').map(Number) || [];
    setComparison(currentComparison);

  }, [searchParams]);

  // Фильтрация данных
  const filteredAircraft = aircraftData.filter(aircraft => {
    const matchesSearch = 
      aircraft.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aircraft.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesManufacturer = selectedManufacturer === 'All' || aircraft.manufacturer === selectedManufacturer;
    const matchesYear = selectedYear === 'All' || aircraft.year.toString() === selectedYear;
    const matchesStatus = selectedStatus === 'All' || aircraft.status === selectedStatus;
    
    const matchesPrice = !priceRange.min || !priceRange.max || 
      (aircraft.price !== 'Inquire' && aircraft.price !== 'N/A' && 
       parseFloat(aircraft.price.replace(/[$,]/g, '')) >= parseFloat(priceRange.min) &&
       parseFloat(aircraft.price.replace(/[$,]/g, '')) <= parseFloat(priceRange.max));
    
    const matchesTtaf = !ttafRange.min || !ttafRange.max ||
      (aircraft.ttaf >= parseInt(ttafRange.min) && aircraft.ttaf <= parseInt(ttafRange.max));
    
    return matchesSearch && matchesManufacturer && matchesYear && matchesStatus && matchesPrice && matchesTtaf;
  });

  // Сортировка
  const sortedAircraft = [...filteredAircraft].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'year':
        aValue = a.year;
        bValue = b.year;
        break;
      case 'ttaf':
        aValue = a.ttaf;
        bValue = b.ttaf;
        break;
      case 'price':
        aValue = a.price === 'Inquire' || a.price === 'N/A' ? 0 : parseFloat(a.price.replace(/[$,]/g, ''));
        bValue = b.price === 'Inquire' || b.price === 'N/A' ? 0 : parseFloat(b.price.replace(/[$,]/g, ''));
        break;
      case 'manufacturer':
        aValue = a.manufacturer;
        bValue = b.manufacturer;
        break;
      default:
        aValue = a.year;
        bValue = b.year;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Обработчики избранного и сравнения
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleComparison = (id: number) => {
    if (comparison.length >= 5 && !comparison.includes(id)) {
      alert('Максимум 5 самолетов для сравнения');
      return;
    }
    setComparison(prev => 
      prev.includes(id) ? prev.filter(comp => comp !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            КАТАЛОГ САМОЛЕТОВ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Найдите идеальный самолет для ваших потребностей среди верифицированных объявлений
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-black text-white rounded-lg mb-8">
          <div className="p-8">
            {/* Основная строка поиска */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по производителю, модели, регистрации..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 bg-white text-black font-semibold hover:bg-gray-100 transition-colors rounded-md"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Фильтры
                {showFilters ? (
                  <ChevronUpIcon className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 ml-2" />
                )}
              </button>
            </div>

            {/* Расширенные фильтры */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-white/30">
                {/* Производитель */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Производитель
                  </label>
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => setSelectedManufacturer(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {manufacturers.map(manufacturer => (
                      <option key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Год */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Год выпуска
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Статус */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Статус
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'Все статусы' : statusConfig[status as keyof typeof statusConfig]?.label || status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Сортировка */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Сортировка
                  </label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="year-desc">Год (новые)</option>
                    <option value="year-asc">Год (старые)</option>
                    <option value="ttaf-asc">TTAF (низкие)</option>
                    <option value="ttaf-desc">TTAF (высокие)</option>
                    <option value="price-asc">Цена (низкая)</option>
                    <option value="price-desc">Цена (высокая)</option>
                    <option value="manufacturer-asc">Производитель (А-Я)</option>
                  </select>
                </div>

                {/* Диапазон цен */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Цена (млн $)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-1/2 px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-1/2 px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>

                {/* Диапазон TTAF */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    TTAF (часы)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={ttafRange.min}
                      onChange={(e) => setTtafRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-1/2 px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={ttafRange.max}
                      onChange={(e) => setTtafRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-1/2 px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Панель действий */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-lg font-medium text-black">
              Найдено: {sortedAircraft.length} самолетов
            </span>
            {comparison.length > 0 && (
              <Link
                to="/compare"
                className="flex items-center px-4 py-2 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                <ScaleIcon className="h-4 w-4 mr-2" />
                Сравнить ({comparison.length})
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              <EyeIcon className="h-4 w-4 mr-2" />
              Экспорт
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Настройки
            </button>
          </div>
        </div>

        {/* Список самолетов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedAircraft.map((aircraft) => (
            <div key={aircraft.id} className="group cursor-pointer bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Изображение */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/images/Global Express Jet_0.jpg"
                  alt={`${aircraft.manufacturer} ${aircraft.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[aircraft.status as keyof typeof statusConfig]?.color}`}>
                    {statusConfig[aircraft.status as keyof typeof statusConfig]?.label}
                  </span>
                </div>
              </div>

              {/* Информация */}
              <div className="p-6">
                {/* Заголовок и действия */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-black mb-1">
                      {aircraft.year} {aircraft.manufacturer} {aircraft.model}
                    </h3>
                    <p className="text-sm text-gray-500">{aircraft.registration}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(aircraft.id)}
                      className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {favorites.includes(aircraft.id) ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <StarIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleComparison(aircraft.id)}
                      className={`p-2 transition-colors ${comparison.includes(aircraft.id) ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                      <ScaleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Основные характеристики */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Цена</p>
                    <p className="font-semibold text-black">{aircraft.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">TTAF</p>
                    <p className="font-semibold text-black">{aircraft.ttaf.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Местоположение</p>
                    <p className="font-semibold text-black">{aircraft.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Пассажиры</p>
                    <p className="font-semibold text-black">{aircraft.passengers}</p>
                  </div>
                </div>

                {/* Кнопка просмотра */}
                <Link
                  to={`/aircraft/${aircraft.id}`}
                  className="w-full bg-black text-white py-3 px-4 font-semibold hover:bg-gray-800 transition-colors text-center block"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Пустое состояние */}
        {sortedAircraft.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-8xl mb-6">✈️</div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Самолеты не найдены
            </h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Попробуйте изменить критерии поиска или фильтры
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 