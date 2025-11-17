import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccessControl } from '../hooks/useAccessControl';
import { UserPermissions, UserVerificationLevel } from '../types/roles';
import { 
  LockClosedIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface AccessGuardProps {
  permission?: keyof UserPermissions;
  minimumLevel?: UserVerificationLevel;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
}

interface UpgradePromptProps {
  requiredLevel: UserVerificationLevel;
  currentLevel: UserVerificationLevel;
  feature?: string;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  requiredLevel, 
  currentLevel, 
  feature 
}) => {
  const { t } = useTranslation();

  const getLevelInfo = (level: UserVerificationLevel) => {
    switch (level) {
      case 'guest':
        return {
          name: 'Guest',
          icon: LockClosedIcon,
          color: 'gray',
          description: 'Limited access to basic information'
        };
      case 'registered':
        return {
          name: 'Registered',
          icon: DocumentTextIcon,
          color: 'blue',
          description: 'Email verified, extended information access'
        };
      case 'verified':
        return {
          name: 'Verified',
          icon: ShieldCheckIcon,
          color: 'green',
          description: 'KYC completed, technical specifications access'
        };
      case 'mandated':
        return {
          name: 'Mandated',
          icon: ShieldCheckIcon,
          color: 'purple',
          description: 'Full access with mandate, confidential data'
        };
    }
  };

  const currentInfo = getLevelInfo(currentLevel);
  const requiredInfo = getLevelInfo(requiredLevel);
  const CurrentIcon = currentInfo.icon;
  const RequiredIcon = requiredInfo.icon;

  const getUpgradeAction = () => {
    switch (requiredLevel) {
      case 'registered':
        return {
          text: 'Register Now',
          link: '/register-enhanced',
          description: 'Create an account to access this feature'
        };
      case 'verified':
        return {
          text: 'Complete Verification',
          link: '/kyc-verification',
          description: 'Upload documents to verify your identity'
        };
      case 'mandated':
        return {
          text: 'Submit Mandate',
          link: '/dashboard',
          description: 'Provide proof of funds and client authorization'
        };
      default:
        return {
          text: 'Upgrade Account',
          link: '/dashboard',
          description: 'Enhance your account to access this feature'
        };
    }
  };

  const action = getUpgradeAction();

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Verification Required
          </h3>
        </div>
      </div>

      <div className="p-6">
        {feature && (
          <p className="text-sm text-gray-600 mb-4">
            To access <strong>{feature}</strong>, you need a higher verification level.
          </p>
        )}

        {/* Current Level */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <CurrentIcon className={`h-5 w-5 text-${currentInfo.color}-600`} />
            <span className="font-medium text-gray-900">
              Current: {currentInfo.name}
            </span>
          </div>
          <p className="text-sm text-gray-600 ml-8">
            {currentInfo.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-4">
          <div className="h-8 w-0.5 bg-gray-300"></div>
          <div className="absolute">
            <svg className="h-4 w-4 text-gray-400 mt-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Required Level */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <RequiredIcon className={`h-5 w-5 text-${requiredInfo.color}-600`} />
            <span className="font-medium text-gray-900">
              Required: {requiredInfo.name}
            </span>
          </div>
          <p className="text-sm text-gray-600 ml-8">
            {requiredInfo.description}
          </p>
        </div>

        {/* Action */}
        <div className="space-y-3">
          <Link
            to={action.link}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            {action.text}
          </Link>
          <p className="text-xs text-gray-500 text-center">
            {action.description}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-50 px-6 py-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Benefits of {requiredInfo.name} level:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          {requiredLevel === 'registered' && (
            <>
              <li>• Access to detailed aircraft information</li>
              <li>• Direct contact with sellers</li>
              <li>• Submit purchase requests</li>
            </>
          )}
          {requiredLevel === 'verified' && (
            <>
              <li>• View technical specifications</li>
              <li>• Access maintenance history</li>
              <li>• Post aircraft listings</li>
              <li>• Enhanced credibility</li>
            </>
          )}
          {requiredLevel === 'mandated' && (
            <>
              <li>• Full confidential data access</li>
              <li>• Seller contact information</li>
              <li>• Serial numbers and registration</li>
              <li>• Participate in private deals</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

const AccessGuard: React.FC<AccessGuardProps> = ({
  permission,
  minimumLevel,
  children,
  fallback,
  showUpgradePrompt = true,
}) => {
  const accessControl = useAccessControl();

  // Check permission-based access
  if (permission) {
    const hasPermission = accessControl.canAccess(permission);
    
    if (!hasPermission) {
      if (fallback) return <>{fallback}</>;
      
      if (showUpgradePrompt) {
        const requiredLevel = accessControl.getRequiredLevel(permission);
        return (
          <UpgradePrompt
            requiredLevel={requiredLevel}
            currentLevel={accessControl.verificationLevel}
            feature={permission}
          />
        );
      }
      
      return null;
    }
  }

  // Check level-based access
  if (minimumLevel) {
    const levelHierarchy: UserVerificationLevel[] = ['guest', 'registered', 'verified', 'mandated'];
    const currentLevelIndex = levelHierarchy.indexOf(accessControl.verificationLevel);
    const requiredLevelIndex = levelHierarchy.indexOf(minimumLevel);
    
    if (currentLevelIndex < requiredLevelIndex) {
      if (fallback) return <>{fallback}</>;
      
      if (showUpgradePrompt) {
        return (
          <UpgradePrompt
            requiredLevel={minimumLevel}
            currentLevel={accessControl.verificationLevel}
          />
        );
      }
      
      return null;
    }
  }

  return <>{children}</>;
};

export default AccessGuard;
