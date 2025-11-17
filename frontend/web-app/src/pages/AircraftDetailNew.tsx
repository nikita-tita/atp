import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAircraftById, formatPrice } from '../data/aircraftData';
import { 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import ComplianceModal from '../components/ComplianceModal';
import ReserveClientModal from '../components/ReserveClientModal';

const AircraftDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [compliancePassed, setCompliancePassed] = useState(false);

  // Получаем данные самолета из нашего источника данных
  const aircraft = id ? getAircraftById(id) : null;

  const handleComplianceCheck = () => {
    if (compliancePassed) {
      // Если комплаенс уже пройден, открываем форму связи с продавцом
      // В реальном приложении здесь будет модальное окно связи
      toast.success('Opening contact form...');
    } else {
      setIsComplianceModalOpen(true);
    }
  };

  const handleReserveClient = () => {
    setIsReserveModalOpen(true);
  };

  const handleComplianceSuccess = () => {
    setCompliancePassed(true);
    toast.success(t('aircraft.detail.notifications.complianceCompleted'));
  };

  const handleReserveSuccess = () => {
    toast.success(t('aircraft.detail.notifications.clientReserved'));
  };

  if (!aircraft) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aircraft Not Found</h1>
            <p className="text-gray-600 mb-6">The aircraft you're looking for doesn't exist.</p>
            <Link
              to="/aircraft"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Aircraft List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link to="/aircraft" className="hover:text-gray-700">Aircraft</Link>
          <span>/</span>
          <span className="text-gray-900">{aircraft.manufacturer} {aircraft.model}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Aircraft Details */}
          <div className="lg:col-span-2">
            
            {/* Aircraft Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {aircraft.year} {aircraft.manufacturer} {aircraft.model}
                </h1>
                <p className="text-lg text-gray-600 mb-4">Registration: {aircraft.registration}</p>
                <p className="text-gray-700">{aircraft.description}</p>
              </div>
            </div>

            {/* Aircraft Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={aircraft.image}
                  alt={`${aircraft.manufacturer} ${aircraft.model}`}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: t('aircraft.detail.tabs.overview') },
                    { id: 'specifications', name: t('aircraft.detail.tabs.specifications') },
                    { id: 'maintenance', name: t('aircraft.detail.tabs.maintenance') },
                    { id: 'documents', name: t('aircraft.detail.tabs.documents') },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-aviation-500 text-aviation-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Aircraft Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500">Manufacturer:</span>
                          <span className="ml-2 font-medium">{aircraft.manufacturer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Model:</span>
                          <span className="ml-2 font-medium">{aircraft.model}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Year:</span>
                          <span className="ml-2 font-medium">{aircraft.year}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Registration:</span>
                          <span className="ml-2 font-medium">{aircraft.registration}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <span className="ml-2 font-medium">{aircraft.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Hours:</span>
                          <span className="ml-2 font-medium">{aircraft.hours.toLocaleString()} TTAF</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cycles:</span>
                          <span className="ml-2 font-medium">{aircraft.cycles.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Passengers:</span>
                          <span className="ml-2 font-medium">{aircraft.passengers}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technical Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-500">Max Range:</span>
                          <span className="ml-2 font-medium">{aircraft.specifications.maxRange}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Max Speed:</span>
                          <span className="ml-2 font-medium">{aircraft.specifications.maxSpeed}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Engines:</span>
                          <span className="ml-2 font-medium">{aircraft.specifications.engines}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Wingspan:</span>
                          <span className="ml-2 font-medium">{aircraft.specifications.wingspan}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Length:</span>
                          <span className="ml-2 font-medium">{aircraft.specifications.length}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">MTOW:</span>
                          <span className="ml-2 font-medium">{aircraft.specifications.maxTakeoffWeight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Maintenance Information</h3>
                      <p className="text-gray-600">Maintenance records and history will be available after compliance verification.</p>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Aircraft Documents</h3>
                      <p className="text-gray-600">Complete aircraft documentation will be available after compliance verification.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions and Seller Info */}
          <div className="lg:col-span-1">
            
            {/* Price and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-3xl font-bold text-aviation-600 mb-2">
                {formatPrice(aircraft.price, aircraft.currency)}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                {aircraft.status === 'active' && t('aircraft.detail.status.availableForPurchase')}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleComplianceCheck}
                  className="w-full bg-aviation-600 hover:bg-aviation-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {compliancePassed ? t('aircraft.detail.actions.contactSeller') : t('aircraft.detail.actions.passCompliance')}
                </button>
                <button
                  onClick={handleReserveClient}
                  className="w-full bg-white hover:bg-gray-50 text-aviation-600 border border-aviation-600 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {t('aircraft.detail.actions.reserveClient')}
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Premium Seller</div>
                    <div className="text-sm text-green-600">✓ Verified</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  ••••••••••••<br />
                  ••••••••••••<br />
                  Contact information will be available after compliance check
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Modal */}
      <ComplianceModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
        onSuccess={handleComplianceSuccess}
        aircraftId={aircraft.id}
      />

      {/* Reserve Client Modal */}
      <ReserveClientModal
        isOpen={isReserveModalOpen}
        onClose={() => setIsReserveModalOpen(false)}
        onSuccess={handleReserveSuccess}
        aircraftId={aircraft.id}
      />
    </div>
  );
};

export default AircraftDetail;
