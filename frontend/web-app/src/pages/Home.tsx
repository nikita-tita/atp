import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getRandomAircraft, formatPrice } from '../data/aircraftData';
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchForm, setSearchForm] = useState({
    manufacturer: '',
    model: '',
    price: '',
    year: ''
  });

  // Получаем случайные самолеты для показа
  const featuredAircraft = getRandomAircraft(3);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Создаем URL с параметрами поиска
    const searchParams = new URLSearchParams();
    if (searchForm.manufacturer) searchParams.append('manufacturer', searchForm.manufacturer);
    if (searchForm.model) searchParams.append('model', searchForm.model);
    if (searchForm.price) searchParams.append('price', searchForm.price);
    if (searchForm.year) searchParams.append('year', searchForm.year);
    
    // Переходим на страницу поиска с параметрами
    const searchUrl = searchParams.toString() ? `/aircraft?${searchParams.toString()}` : '/aircraft';
    navigate(searchUrl);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}images/airbus-a350.jpg`}
            alt="Airbus A350"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            ATP PLATFORM
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/aircraft"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {t('home.hero.findAircraft')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-black transition-colors"
            >
              {t('navigation.register')}
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.search.search').toUpperCase()}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('home.search.manufacturer')}
                  </label>
                  <select 
                    name="manufacturer"
                    value={searchForm.manufacturer}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="">{t('home.search.selectManufacturer')}</option>
                    <option value="boeing">Boeing</option>
                    <option value="airbus">Airbus</option>
                    <option value="comac">Comac</option>
                    <option value="mitsubishi">Mitsubishi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('home.search.model')}
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={searchForm.model}
                    onChange={handleSearchChange}
                    placeholder={t('home.search.selectModel')}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {t('home.search.price')}
                  </label>
                  <select 
                    name="price"
                    value={searchForm.price}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="">{t('home.search.selectPrice')}</option>
                    <option value="0-10">{t('home.search.priceRanges.under10')}</option>
                    <option value="10-25">{t('home.search.priceRanges.10to25')}</option>
                    <option value="25-50">{t('home.search.priceRanges.25to50')}</option>
                    <option value="50+">{t('home.search.priceRanges.over50')}</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-white text-black font-semibold hover:bg-gray-100 transition-colors rounded-md"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
                    {t('home.search.search')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-black mb-4">500+</div>
              <div className="text-xl text-gray-600">{t('home.stats.verifiedAircraft')}</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">50+</div>
              <div className="text-xl text-gray-600">{t('home.stats.trustedBrokers')}</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">100%</div>
              <div className="text-xl text-gray-600">{t('home.stats.secureTrans')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.whyAtp.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.whyAtp.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.whyAtp.verification.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyAtp.verification.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.whyAtp.globalNetwork.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyAtp.globalNetwork.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.whyAtp.timeSaving.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyAtp.timeSaving.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('home.whyAtp.premiumService.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyAtp.premiumService.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aircraft Showcase */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {t('home.premiumAircraft.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('home.premiumAircraft.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAircraft.map((aircraft) => (
              <Link key={aircraft.id} to={`/aircraft/${aircraft.id}`} className="group cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={aircraft.image}
                    alt={`${aircraft.manufacturer} ${aircraft.model}`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {aircraft.status === 'active' ? 'For Sale' : 'Pending'}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {aircraft.year} {aircraft.manufacturer} {aircraft.model}
                  </h3>
                  <p className="text-gray-300 mb-2">
                    TTAF: {aircraft.hours.toLocaleString()} hours | Cycles: {aircraft.cycles.toLocaleString()}
                  </p>
                  <p className="text-lg font-semibold">
                    {formatPrice(aircraft.price, aircraft.currency)}
                  </p>
                </div>
              </Link>
            ))}

          </div>

          <div className="text-center mt-12">
            <Link
              to="/aircraft"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {t('home.viewAllAircraft')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            {t('home.readyToStart.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('home.readyToStart.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              {t('home.readyToStart.register')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-black text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors"
            >
              {t('home.readyToStart.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 