import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('about.subtitle')}
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
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.mission.description1')}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {t('about.mission.description2')}
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                {t('about.mission.joinPlatform')}
              </Link>
            </div>
            <div className="relative">
              <img
                src="/images/airbus-a330.jpg"
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
              {t('about.values.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.security.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.security.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <GlobeAltIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.global.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.global.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.efficiency.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.efficiency.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.quality.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.quality.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.community.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.community.description')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t('about.values.transparency.title')}</h3>
              <p className="text-gray-600">
                {t('about.values.transparency.description')}
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
              {t('about.stats.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">{t('about.stats.aircraft')}</div>
              <div className="text-xl text-gray-300">{t('about.stats.aircraftLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">{t('about.stats.brokers')}</div>
              <div className="text-xl text-gray-300">{t('about.stats.brokersLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">{t('about.stats.countries')}</div>
              <div className="text-xl text-gray-300">{t('about.stats.countriesLabel')}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-4">100%</div>
              <div className="text-xl text-gray-300">{t('about.stats.secureDeals')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('about.team.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.team.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">{t('about.team.ceo.name')}</h3>
              <p className="text-gray-600 mb-2">{t('about.team.ceo.position')}</p>
              <p className="text-sm text-gray-500">
                {t('about.team.ceo.experience')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">{t('about.team.coo.name')}</h3>
              <p className="text-gray-600 mb-2">{t('about.team.coo.position')}</p>
              <p className="text-sm text-gray-500">
                {t('about.team.coo.experience')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold mb-2">{t('about.team.cto.name')}</h3>
              <p className="text-gray-600 mb-2">{t('about.team.cto.position')}</p>
              <p className="text-sm text-gray-500">
                {t('about.team.cto.experience')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {t('about.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              {t('about.cta.register')}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-black text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors"
            >
              {t('about.cta.contact')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 