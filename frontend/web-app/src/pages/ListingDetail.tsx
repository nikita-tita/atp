import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ListingData {
  id: string;
  title: string;
  status: string;
  views: number;
  inquiries: number;
  price: number;
  currency: string;
  image: string;
  complianceRequests: number;
  reservations: number;
  manufacturer: string;
  model: string;
  year: number;
  ttaf: number;
  location: string;
  description: string;
}

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock данные для объявлений
  const mockListings: ListingData[] = [
    {
      id: '1',
      title: 'Boeing 737-800 for Sale',
      status: 'active',
      views: 156,
      inquiries: 8,
      price: 25000000,
      currency: 'USD',
      image: getPublicPath('/images/boeing-737.jpg'),
      complianceRequests: 3,
      reservations: 2,
      manufacturer: 'Boeing',
      model: '737-800',
      year: 2015,
      ttaf: 25000,
      location: 'Moscow, Russia',
      description: 'Excellent condition, full documentation, ready for sale.'
    },
    {
      id: '2',
      title: 'Airbus A320neo',
      status: 'pending',
      views: 89,
      inquiries: 3,
      price: 35000000,
      currency: 'USD',
      image: getPublicPath('/images/boeing-777.jpg'),
      complianceRequests: 1,
      reservations: 0,
      manufacturer: 'Airbus',
      model: 'A320neo',
      year: 2018,
      ttaf: 12000,
      location: 'Saint Petersburg, Russia',
      description: 'Almost new aircraft with minimal hours.'
    },
  ];

  useEffect(() => {
    // Имитируем загрузку данных
    setTimeout(() => {
      const foundListing = mockListings.find(l => l.id === id);
      if (foundListing) {
        setListing(foundListing);
      } else {
        toast.error('Объявление не найдено');
        navigate('/dashboard');
      }
      setIsLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleEdit = () => {
    navigate('/dashboard?tab=listings');
    // В реальном приложении здесь будет открытие модального окна редактирования
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      toast.success('Объявление удалено');
      navigate('/dashboard?tab=listings');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активно';
      case 'pending':
        return 'На модерации';
      case 'inactive':
        return 'Неактивно';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Объявление не найдено</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              Вернуться в личный кабинет
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard?tab=listings')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Listings
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                  {getStatusText(listing.status)}
                </span>
                <span className="text-gray-600">ID: {listing.id}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-64 object-cover"
              />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600">{listing.description}</p>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Manufacturer</span>
                  <p className="text-gray-900">{listing.manufacturer}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Model</span>
                  <p className="text-gray-900">{listing.model}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Year</span>
                  <p className="text-gray-900">{listing.year}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">TTAF</span>
                  <p className="text-gray-900">{listing.ttaf.toLocaleString()} hours</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <p className="text-gray-900">{listing.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price</h3>
              <div className="text-3xl font-bold text-black mb-2">
                {formatPrice(listing.price, listing.currency)}
              </div>
              <p className="text-sm text-gray-600">Current listing price</p>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <EyeIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Views</span>
                  </div>
                  <span className="font-medium text-gray-900">{listing.views}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Inquiries</span>
                  </div>
                  <span className="font-medium text-gray-900">{listing.inquiries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ChartBarIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Compliance Requests</span>
                  </div>
                  <span className="font-medium text-gray-900">{listing.complianceRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Reservations</span>
                  </div>
                  <span className="font-medium text-gray-900">{listing.reservations}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium">
                  View on Site
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium">
                  Share
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail; 