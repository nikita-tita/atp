import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import KYCVerification from '../components/KYCVerification';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline';

const KYCVerificationPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'individual' | 'company'>('company');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Determine user type based on business type
    if (user?.businessType === 'individual') {
      setUserType('individual');
    } else {
      setUserType('company');
    }
  }, [isAuthenticated, user, navigate]);

  const handleKYCComplete = (documents: any[]) => {
    // Handle KYC completion
    console.log('KYC documents submitted:', documents);
    // You can redirect to dashboard or show success message
    navigate('/dashboard?kyc=submitted');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Document Verification
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete your KYC verification to access all platform features and ensure compliance with international regulations.
            </p>
          </div>
        </div>
      </div>

      {/* User Information */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-gray-900">{user.firstName} {user.lastName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-gray-900">{user.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Company:</span>
              <span className="ml-2 text-gray-900">{user.company || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Business Type:</span>
              <span className="ml-2 text-gray-900 capitalize">{user.businessType}</span>
            </div>
          </div>
        </div>

        {/* Benefits Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6 mb-6">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Benefits of Verification
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Access to detailed aircraft specifications and technical data
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  View confidential seller contact information
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Participate in private aircraft deals and negotiations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Submit and respond to aircraft purchase mandates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Enhanced trust and credibility in the marketplace
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <h4 className="font-semibold mb-1">Regulatory Compliance</h4>
              <p>
                This verification process ensures compliance with international Know Your Customer (KYC) 
                and Anti-Money Laundering (AML) regulations. All information is securely encrypted and 
                handled according to GDPR and other applicable privacy laws.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Component */}
      <KYCVerification 
        userType={userType}
        onComplete={handleKYCComplete}
      />

      {/* Footer Information */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our compliance team is available to assist you with the verification process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:compliance@atp-platform.com"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Email Support
            </a>
            <a 
              href="tel:+1-555-123-4567"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Call Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationPage;
