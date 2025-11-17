import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  CurrencyDollarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const ServiceCategories: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    {
      id: 'sales',
      title: t('home.categories.sales.title'),
      description: t('home.categories.sales.description'),
      icon: CurrencyDollarIcon,
      href: '/sales',
      color: 'blue',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'leasing',
      title: t('home.categories.leasing.title'),
      description: t('home.categories.leasing.description'),
      icon: ClockIcon,
      href: '/leasing',
      color: 'green',
      image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'acmi',
      title: t('home.categories.acmi.title'),
      description: t('home.categories.acmi.description'),
      icon: UserGroupIcon,
      href: '/acmi',
      color: 'purple',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-600',
          hover: 'hover:bg-blue-700',
          text: 'text-blue-600',
          ring: 'ring-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-600',
          hover: 'hover:bg-green-700',
          text: 'text-green-600',
          ring: 'ring-green-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-600',
          hover: 'hover:bg-purple-700',
          text: 'text-purple-600',
          ring: 'ring-purple-600'
        };
      default:
        return {
          bg: 'bg-gray-600',
          hover: 'hover:bg-gray-700',
          text: 'text-gray-600',
          ring: 'ring-gray-600'
        };
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive aviation solutions for airlines, operators, and aircraft owners worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const colors = getColorClasses(category.color);
            const IconComponent = category.icon;
            
            return (
              <div key={category.id} className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  {/* Image */}
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Icon */}
                  <div className={`absolute top-4 left-4 p-3 rounded-xl ${colors.bg} text-white shadow-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {category.description}
                    </p>
                    
                    <Link
                      to={category.href}
                      className={`inline-flex items-center text-sm font-semibold ${colors.text} hover:${colors.text} transition-colors`}
                    >
                      Explore {category.title}
                      <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-black rounded-2xl px-8 py-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of aviation professionals who trust ATP Platform for their aircraft transactions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-semibold text-lg rounded-lg hover:bg-gray-100 transition-colors"
              >
                {t('navigation.register')}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                {t('navigation.about')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
