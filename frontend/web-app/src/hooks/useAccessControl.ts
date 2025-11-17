import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  AccessControlService, 
  UserVerificationLevel, 
  UserRole, 
  UserPermissions, 
  DataVisibilityLevel 
} from '../types/roles';

export interface UseAccessControlReturn {
  permissions: UserPermissions;
  dataVisibility: DataVisibilityLevel;
  verificationLevel: UserVerificationLevel;
  role: UserRole;
  canAccess: (feature: keyof UserPermissions) => boolean;
  canViewData: (dataField: keyof DataVisibilityLevel, isOwner?: boolean) => boolean;
  getRequiredLevel: (feature: keyof UserPermissions) => UserVerificationLevel;
  getVerificationSteps: () => string[];
  needsUpgrade: (feature: keyof UserPermissions) => boolean;
  isGuest: boolean;
  isRegistered: boolean;
  isVerified: boolean;
  isMandated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
}

export const useAccessControl = (isOwner: boolean = false): UseAccessControlReturn => {
  const { user, isAuthenticated } = useAuth();

  const verificationLevel: UserVerificationLevel = useMemo(() => {
    if (!isAuthenticated || !user) return 'guest';
    
    // This would typically come from the user object
    // For now, we'll determine based on available data
    if (user.isKYCVerified && user.hasMandateAccess) return 'mandated';
    if (user.isKYCVerified) return 'verified';
    if (user.isEmailVerified) return 'registered';
    return 'guest';
  }, [isAuthenticated, user]);

  const role: UserRole = useMemo(() => {
    if (!user) return 'buyer';
    return (user.role as UserRole) || 'buyer';
  }, [user]);

  const permissions = useMemo(() => {
    return AccessControlService.getUserPermissions(
      verificationLevel, 
      role, 
      user?.businessType
    );
  }, [verificationLevel, role, user?.businessType]);

  const dataVisibility = useMemo(() => {
    return AccessControlService.getDataVisibility(verificationLevel, isOwner);
  }, [verificationLevel, isOwner]);

  const canAccess = (feature: keyof UserPermissions): boolean => {
    return permissions[feature];
  };

  const canViewData = (dataField: keyof DataVisibilityLevel, ownerOverride: boolean = false): boolean => {
    const visibility = AccessControlService.getDataVisibility(
      verificationLevel, 
      isOwner || ownerOverride
    );
    return visibility[dataField];
  };

  const getRequiredLevel = (feature: keyof UserPermissions): UserVerificationLevel => {
    return AccessControlService.getRequiredLevel(feature);
  };

  const getVerificationSteps = (): string[] => {
    return AccessControlService.getVerificationSteps(verificationLevel);
  };

  const needsUpgrade = (feature: keyof UserPermissions): boolean => {
    return !canAccess(feature);
  };

  return {
    permissions,
    dataVisibility,
    verificationLevel,
    role,
    canAccess,
    canViewData,
    getRequiredLevel,
    getVerificationSteps,
    needsUpgrade,
    isGuest: verificationLevel === 'guest',
    isRegistered: verificationLevel === 'registered',
    isVerified: verificationLevel === 'verified',
    isMandated: verificationLevel === 'mandated',
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
  };
};

export default useAccessControl;
