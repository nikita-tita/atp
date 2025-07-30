import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              О ATP PLATFORM
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ведущая верифицированная торговая площадка для авиатехники, 
              объединяющая профессиональных участников рынка
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Наша миссия
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Создать безопасную и эффективную экосистему для торговли авиатехникой, 
                где каждый участник проходит строгую верификацию и может быть уверен 
                в надежности партнеров.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Мы стремимся упростить процесс покупки и продажи самолетов, 
                предоставляя доступ к качественной информации и прямым контактам 
                с проверенными владельцами и брокерами.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                Присоединиться к платформе
              </Link>
            </div>
            <div className="relative">
              <img
                src="/images/Bombardier-Global-6000-sales-01-1536x771.jpg.webp"
                alt="ATP Platform"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Наши ценности
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Принципы, которые лежат в основе нашей работы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Безопасность</h3>
              <p className="text-gray-600">
                Строгая верификация всех участников и защита конфиденциальной информации
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Глобальность</h3>
              <p className="text-gray-600">
                Доступ к самолетам по всему миру и международная сеть партнеров
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Эффективность</h3>
              <p className="text-gray-600">
                Быстрые сделки без лишних посредников и бюрократических процедур
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Качество</h3>
              <p className="text-gray-600">
                Только проверенные самолеты с полной документацией и историей
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Сообщество</h3>
              <p className="text-gray-600">
                Закрытое сообщество профессионалов с общими стандартами качества
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Прозрачность</h3>
              <p className="text-gray-600">
                Открытая информация о ценах, состоянии и истории самолетов
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              ATP PLATFORM В ЦИФРАХ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">500+</div>
              <div className="text-xl text-gray-300">Верифицированных самолетов</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">50+</div>
              <div className="text-xl text-gray-300">Проверенных брокеров</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">25+</div>
              <div className="text-xl text-gray-300">Стран присутствия</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">100%</div>
              <div className="text-xl text-gray-300">Безопасность сделок</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Наша команда
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Эксперты с многолетним опытом в авиационной индустрии
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Александр Петров</h3>
              <p className="text-gray-600 mb-2">CEO & Founder</p>
              <p className="text-sm text-gray-500">
                15+ лет опыта в авиационной индустрии, бывший пилот и владелец авиакомпании
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Мария Сидорова</h3>
              <p className="text-gray-600 mb-2">CTO</p>
              <p className="text-sm text-gray-500">
                Эксперт в области авиационных технологий и систем безопасности
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">Дмитрий Козлов</h3>
              <p className="text-gray-600 mb-2">Head of Compliance</p>
              <p className="text-sm text-gray-500">
                Специалист по комплаенсу и международному авиационному праву
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ГОТОВЫ ПРИСОЕДИНИТЬСЯ?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Станьте частью эксклюзивного сообщества профессиональных участников рынка авиатехники
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Зарегистрироваться
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
};

export default About; 