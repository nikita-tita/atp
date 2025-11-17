import React from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, UserIcon, BuildingOfficeIcon, DocumentTextIcon, CalendarIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface ComplianceRequest {
  id: string;
  aircraftId: string;
  aircraftTitle: string;
  aircraftPrice: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  createdAt: string;
  updatedAt: string;
  
  // Информация о покупателе
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCompany: string;
  buyerPosition: string;
  
  // Информация о брокере
  brokerName: string;
  brokerEmail: string;
  brokerPhone: string;
  brokerCompany: string;
  brokerLicense: string;
  brokerExperience: string;
  
  // Финансовая информация
  budget: string;
  financing: boolean;
  cashAvailable: boolean;
  letterOfIntent: boolean;
  proofOfFunds: boolean;
  
  // Дополнительная информация
  timeline: string;
  inspection: boolean;
  nda: boolean;
  terms: boolean;
  
  // Документы
  documents: {
    name: string;
    type: string;
    uploadedAt: string;
  }[];
  
  // Комментарии
  comments: {
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }[];
}

interface ComplianceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  compliance: ComplianceRequest;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

const ComplianceDetailModal: React.FC<ComplianceDetailModalProps> = ({
  isOpen,
  onClose,
  compliance,
  onStatusChange
}) => {
  const { t } = useTranslation();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return t('dashboard.status.approved');
      case 'rejected': return t('dashboard.status.rejected');
      case 'in_review': return t('dashboard.status.underReview');
      default: return t('dashboard.status.pending');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t('compliance.detailsTitle')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ID: {compliance.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Aircraft Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2" />
              {t('compliance.aircraftInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('compliance.aircraft')}</p>
                <p className="font-medium text-gray-900">{compliance.aircraftTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('compliance.price')}</p>
                <p className="font-medium text-gray-900">{compliance.aircraftPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('compliance.requestDate')}</p>
                <p className="font-medium text-gray-900">{formatDate(compliance.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('compliance.status')}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(compliance.status)}`}>
                  {getStatusText(compliance.status)}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to={`/aircraft/${compliance.aircraftId}`}
                className="text-black hover:text-gray-700 font-medium text-sm"
              >
                {t('compliance.viewListing')}
              </Link>
            </div>
          </div>

          {/* Buyer Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              {t('compliance.buyerInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.fullName')}</p>
                  <p className="font-medium text-gray-900">{compliance.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.email')}</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {compliance.buyerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.phone')}</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {compliance.buyerPhone}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.company')}</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                    {compliance.buyerCompany}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.position')}</p>
                  <p className="font-medium text-gray-900">{compliance.buyerPosition}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Broker Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2" />
              {t('compliance.brokerInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.brokerName')}</p>
                  <p className="font-medium text-gray-900">{compliance.brokerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.email')}</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    {compliance.brokerEmail}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.phone')}</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    {compliance.brokerPhone}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.company')}</p>
                  <p className="font-medium text-gray-900">{compliance.brokerCompany}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.license')}</p>
                  <p className="font-medium text-gray-900">{compliance.brokerLicense}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.experience')}</p>
                  <p className="font-medium text-gray-900">{compliance.brokerExperience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('compliance.financialInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.budget')}</p>
                  <p className="font-medium text-gray-900">{compliance.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.timeline')}</p>
                  <p className="font-medium text-gray-900">{compliance.timeline}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">{t('compliance.financing')}</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={compliance.financing}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm">{t('compliance.requiresFinancing')}</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={compliance.cashAvailable}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm">{t('compliance.cashAvailable')}</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={compliance.letterOfIntent}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm">{t('compliance.letterOfIntent')}</span>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={compliance.proofOfFunds}
                        readOnly
                        className="mr-2"
                      />
                      <span className="text-sm">{t('compliance.proofOfFunds')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('compliance.additionalRequirements')}</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={compliance.inspection}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">{t('compliance.requiresInspection')}</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={compliance.nda}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">{t('compliance.nda')}</span>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={compliance.terms}
                  readOnly
                  className="mr-2"
                />
                <span className="text-sm">{t('compliance.platformTerms')}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          {compliance.documents.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('compliance.uploadedDocuments')}</h3>
              <div className="space-y-2">
                {compliance.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DocumentTextIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(doc.uploadedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {compliance.comments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('compliance.comments')}</h3>
              <div className="space-y-4">
                {compliance.comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {compliance.status === 'pending' && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => onStatusChange(compliance.id, 'rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {t('compliance.reject')}
              </button>
              <button
                onClick={() => onStatusChange(compliance.id, 'approved')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {t('compliance.approve')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDetailModal; 