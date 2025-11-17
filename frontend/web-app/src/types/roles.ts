// User verification levels and access control system

export type UserVerificationLevel = 
  | 'guest'           // No registration - basic info only
  | 'registered'      // Email verified - extended info
  | 'verified'        // KYC completed - technical specs
  | 'mandated';       // With mandate - full confidential access

export type UserRole = 
  | 'buyer'
  | 'seller' 
  | 'broker'
  | 'admin'
  | 'moderator';

export type BusinessType = 
  | 'broker'
  | 'airline'
  | 'leasingCompany'
  | 'individual'
  | 'financialInstitution'
  | 'manufacturer'
  | 'mro'
  | 'other';

export interface UserPermissions {
  // Data access levels
  canViewBasicInfo: boolean;
  canViewExtendedInfo: boolean;
  canViewTechnicalSpecs: boolean;
  canViewConfidentialData: boolean;
  canViewSellerContacts: boolean;
  
  // Aircraft operations
  canListAircraft: boolean;
  canEditListings: boolean;
  canDeleteListings: boolean;
  canContactSellers: boolean;
  canSubmitRequests: boolean;
  
  // Document operations
  canUploadDocuments: boolean;
  canDownloadDocuments: boolean;
  canViewDocumentHistory: boolean;
  
  // Administrative
  canModerateContent: boolean;
  canVerifyUsers: boolean;
  canAccessAnalytics: boolean;
  canManageSystem: boolean;
}

export interface DataVisibilityLevel {
  // Public information (for all users)
  manufacturer: boolean;
  model: boolean;
  year: boolean;
  basicConfiguration: boolean;
  priceRange: boolean;
  generalLocation: boolean;
  status: boolean;
  
  // Limited information (registered users)
  exactPrice: boolean;
  totalFlightHours: boolean;
  totalCycles: boolean;
  basicCharacteristics: boolean;
  maintenanceHistory: boolean;
  
  // Confidential information (verified with mandate)
  serialNumber: boolean;
  registrationNumber: boolean;
  exactLocation: boolean;
  detailedMaintenanceHistory: boolean;
  technicalDocumentation: boolean;
  sellerContactInfo: boolean;
  engineHours: boolean;
}

export class AccessControlService {
  static getUserPermissions(
    verificationLevel: UserVerificationLevel,
    role: UserRole,
    businessType?: BusinessType
  ): UserPermissions {
    const basePermissions: UserPermissions = {
      canViewBasicInfo: true,
      canViewExtendedInfo: false,
      canViewTechnicalSpecs: false,
      canViewConfidentialData: false,
      canViewSellerContacts: false,
      canListAircraft: false,
      canEditListings: false,
      canDeleteListings: false,
      canContactSellers: false,
      canSubmitRequests: false,
      canUploadDocuments: false,
      canDownloadDocuments: false,
      canViewDocumentHistory: false,
      canModerateContent: false,
      canVerifyUsers: false,
      canAccessAnalytics: false,
      canManageSystem: false,
    };

    // Apply verification level permissions
    switch (verificationLevel) {
      case 'guest':
        return basePermissions;
        
      case 'registered':
        return {
          ...basePermissions,
          canViewExtendedInfo: true,
          canContactSellers: true,
          canSubmitRequests: true,
          canUploadDocuments: true,
        };
        
      case 'verified':
        return {
          ...basePermissions,
          canViewExtendedInfo: true,
          canViewTechnicalSpecs: true,
          canContactSellers: true,
          canSubmitRequests: true,
          canUploadDocuments: true,
          canDownloadDocuments: true,
          canViewDocumentHistory: true,
          canListAircraft: role === 'seller' || role === 'broker',
          canEditListings: role === 'seller' || role === 'broker',
          canDeleteListings: role === 'seller' || role === 'broker',
        };
        
      case 'mandated':
        return {
          ...basePermissions,
          canViewExtendedInfo: true,
          canViewTechnicalSpecs: true,
          canViewConfidentialData: true,
          canViewSellerContacts: true,
          canContactSellers: true,
          canSubmitRequests: true,
          canUploadDocuments: true,
          canDownloadDocuments: true,
          canViewDocumentHistory: true,
          canListAircraft: role === 'seller' || role === 'broker',
          canEditListings: role === 'seller' || role === 'broker',
          canDeleteListings: role === 'seller' || role === 'broker',
        };
    }

    // Apply role-specific permissions
    if (role === 'admin') {
      return {
        ...basePermissions,
        canViewExtendedInfo: true,
        canViewTechnicalSpecs: true,
        canViewConfidentialData: true,
        canViewSellerContacts: true,
        canContactSellers: true,
        canSubmitRequests: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canViewDocumentHistory: true,
        canListAircraft: true,
        canEditListings: true,
        canDeleteListings: true,
        canModerateContent: true,
        canVerifyUsers: true,
        canAccessAnalytics: true,
        canManageSystem: true,
      };
    }

    if (role === 'moderator') {
      return {
        ...basePermissions,
        canViewExtendedInfo: true,
        canViewTechnicalSpecs: true,
        canContactSellers: true,
        canSubmitRequests: true,
        canUploadDocuments: true,
        canDownloadDocuments: true,
        canViewDocumentHistory: true,
        canModerateContent: true,
        canVerifyUsers: true,
      };
    }

    return basePermissions;
  }

  static getDataVisibility(
    verificationLevel: UserVerificationLevel,
    isOwner: boolean = false
  ): DataVisibilityLevel {
    const baseVisibility: DataVisibilityLevel = {
      manufacturer: true,
      model: true,
      year: true,
      basicConfiguration: true,
      priceRange: true,
      generalLocation: true,
      status: true,
      exactPrice: false,
      totalFlightHours: false,
      totalCycles: false,
      basicCharacteristics: false,
      maintenanceHistory: false,
      serialNumber: false,
      registrationNumber: false,
      exactLocation: false,
      detailedMaintenanceHistory: false,
      technicalDocumentation: false,
      sellerContactInfo: false,
      engineHours: false,
    };

    // Owner can see everything
    if (isOwner) {
      return Object.keys(baseVisibility).reduce((acc, key) => ({
        ...acc,
        [key]: true
      }), {} as DataVisibilityLevel);
    }

    switch (verificationLevel) {
      case 'guest':
        return baseVisibility;
        
      case 'registered':
        return {
          ...baseVisibility,
          exactPrice: true,
          totalFlightHours: true,
          totalCycles: true,
          basicCharacteristics: true,
          maintenanceHistory: true,
        };
        
      case 'verified':
        return {
          ...baseVisibility,
          exactPrice: true,
          totalFlightHours: true,
          totalCycles: true,
          basicCharacteristics: true,
          maintenanceHistory: true,
          // Technical specs available but not confidential data
        };
        
      case 'mandated':
        return Object.keys(baseVisibility).reduce((acc, key) => ({
          ...acc,
          [key]: true
        }), {} as DataVisibilityLevel);
    }

    return baseVisibility;
  }

  static canAccessFeature(
    feature: keyof UserPermissions,
    verificationLevel: UserVerificationLevel,
    role: UserRole,
    businessType?: BusinessType
  ): boolean {
    const permissions = this.getUserPermissions(verificationLevel, role, businessType);
    return permissions[feature];
  }

  static getRequiredLevel(feature: keyof UserPermissions): UserVerificationLevel {
    const levelMap: Partial<Record<keyof UserPermissions, UserVerificationLevel>> = {
      canViewBasicInfo: 'guest',
      canViewExtendedInfo: 'registered',
      canViewTechnicalSpecs: 'verified',
      canViewConfidentialData: 'mandated',
      canViewSellerContacts: 'mandated',
      canContactSellers: 'registered',
      canSubmitRequests: 'registered',
      canListAircraft: 'verified',
      canEditListings: 'verified',
      canDeleteListings: 'verified',
      canUploadDocuments: 'registered',
      canDownloadDocuments: 'verified',
      canViewDocumentHistory: 'verified',
    };

    return levelMap[feature] || 'mandated';
  }

  static getVerificationSteps(currentLevel: UserVerificationLevel): string[] {
    const allSteps = [
      'Email verification',
      'Phone verification', 
      'Document upload',
      'KYC review',
      'Mandate submission',
      'Final approval'
    ];

    switch (currentLevel) {
      case 'guest':
        return allSteps;
      case 'registered':
        return allSteps.slice(2);
      case 'verified':
        return allSteps.slice(4);
      case 'mandated':
        return [];
      default:
        return allSteps;
    }
  }
}

export default AccessControlService;
