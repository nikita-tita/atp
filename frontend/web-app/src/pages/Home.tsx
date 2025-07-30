import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [searchForm, setSearchForm] = useState({
    manufacturer: '',
    model: '',
    price: '',
    year: ''
  });

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
            src="/images/Bombardier-Global-6000-sales-01-1536x771.jpg.webp"
            alt="Bombardier Global 6000"
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
            Верифицированная торговая площадка для авиатехники
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/aircraft"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Найти самолет
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold text-lg hover:bg-white hover:text-black transition-colors"
            >
              Стать участником
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
              ПОИСК АВИАТЕХНИКИ
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Доступ к верифицированным объявлениям о продаже самолетов от проверенных участников рынка
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Производитель
                  </label>
                  <select 
                    name="manufacturer"
                    value={searchForm.manufacturer}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="">Все производители</option>
                    <option value="gulfstream">Gulfstream</option>
                    <option value="bombardier">Bombardier</option>
                    <option value="cessna">Cessna</option>
                    <option value="dassault">Dassault</option>
                    <option value="boeing">Boeing</option>
                    <option value="airbus">Airbus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Модель
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={searchForm.model}
                    onChange={handleSearchChange}
                    placeholder="Любая модель"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Цена
                  </label>
                  <select 
                    name="price"
                    value={searchForm.price}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="">Любая цена</option>
                    <option value="0-10">До $10M</option>
                    <option value="10-25">$10M - $25M</option>
                    <option value="25-50">$25M - $50M</option>
                    <option value="50+">Более $50M</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full px-6 py-3 bg-white text-black font-semibold hover:bg-gray-100 transition-colors rounded-md"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 inline mr-2" />
                    Поиск
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
              <div className="text-xl text-gray-600">Верифицированных самолетов</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">50+</div>
              <div className="text-xl text-gray-600">Проверенных брокеров</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-4">100%</div>
              <div className="text-xl text-gray-600">Безопасность сделок</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              ПОЧЕМУ ATP?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Мы создали закрытую экосистему для профессиональных участников рынка авиатехники
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Верификация</h3>
              <p className="text-gray-600">
                Все участники проходят строгую проверку документов и финансового состояния
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Глобальная сеть</h3>
              <p className="text-gray-600">
                Доступ к самолетам по всему миру от проверенных владельцев и брокеров
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Экономия времени</h3>
              <p className="text-gray-600">
                Прямая связь с владельцами без посредников и лишних переговоров
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Премиум сервис</h3>
              <p className="text-gray-600">
                Персональный менеджер и полная поддержка на всех этапах сделки
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
              ПРЕМИУМ САМОЛЕТЫ
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Изучите нашу коллекцию верифицированных самолетов для продажи
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Aircraft Card 1 */}
            <Link to="/aircraft/1" className="group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src="/images/cff5ba0469b909cc9cfb2b892c13407f8a9435c6.jpeg"
                  alt="Gulfstream G650"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  For Sale
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">2014 Gulfstream G650</h3>
                <p className="text-gray-300 mb-2">TTAF: 5,340 часов</p>
                <p className="text-lg font-semibold">По запросу</p>
              </div>
            </Link>

            {/* Aircraft Card 2 */}
            <Link to="/aircraft/2" className="group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src="/images/Bombardier-Global-6000-sales-01-1536x771.jpg.webp"
                  alt="Bombardier Global 6000"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-yellow-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  Unverified
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">2016 Bombardier Global 6000</h3>
                <p className="text-gray-300 mb-2">TTAF: 2,800 часов</p>
                <p className="text-lg font-semibold">$45,000,000</p>
              </div>
            </Link>

            {/* Aircraft Card 3 */}
            <Link to="/aircraft/3" className="group cursor-pointer">
              <div className="relative overflow-hidden">
                <img
                  src="/images/xjcid1avepox27tm0jxglg33ltpmod0b.jpg"
                  alt="Cessna Citation X"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute top-4 right-4 bg-orange-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  Pending
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">2013 Cessna Citation X</h3>
                <p className="text-gray-300 mb-2">TTAF: 4,200 часов</p>
                <p className="text-lg font-semibold">$12,500,000</p>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/aircraft"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Смотреть все самолеты
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            ГОТОВЫ НАЧАТЬ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к эксклюзивному сообществу профессиональных участников рынка авиатехники
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Зарегистрироваться
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-black text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 