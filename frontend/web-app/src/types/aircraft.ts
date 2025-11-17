// Enhanced aircraft data types according to detailed specifications

export interface EngineDetails {
  id: string;
  position: 'left' | 'right' | 'center' | '1' | '2' | '3' | '4';
  model: string;
  serialNumber?: string;
  manufacturer: string;
  totalHours: number;
  totalCycles: number;
  hoursSinceOverhaul: number;
  cyclesSinceOverhaul: number;
  lastOverhaulDate?: Date;
  nextOverhaulDue?: Date;
  thrustRating: string; // e.g., "24,500 lbf"
  status: 'serviceable' | 'unserviceable' | 'on-condition' | 'overhaul-due';
  remarks?: string;
}

export interface APUDetails {
  model: string;
  serialNumber?: string;
  manufacturer: string;
  totalHours: number;
  totalCycles: number;
  hoursSinceOverhaul: number;
  cyclesSinceOverhaul: number;
  lastOverhaulDate?: Date;
  nextOverhaulDue?: Date;
  status: 'serviceable' | 'unserviceable' | 'on-condition';
  remarks?: string;
}

export interface LandingGearDetails {
  component: 'nose' | 'main-left' | 'main-right';
  totalCycles: number;
  cyclesSinceOverhaul: number;
  lastOverhaulDate?: Date;
  nextOverhaulDue?: Date;
  tiresCondition: 'new' | 'good' | 'fair' | 'replacement-due';
  brakesCondition: 'new' | 'good' | 'fair' | 'replacement-due';
  status: 'serviceable' | 'unserviceable';
  remarks?: string;
}

export interface MaintenanceCheck {
  checkType: 'A' | 'B' | 'C' | 'D' | '1A' | '2A' | '3A' | '4A';
  intervalHours?: number; // e.g., A-Check every 600 hours
  intervalCalendar?: number; // e.g., B-Check every 6 months
  intervalCycles?: number; // e.g., C-Check every 6000 cycles
  lastPerformed?: Date;
  lastPerformedAt?: string; // Location/MRO facility
  nextDue?: Date;
  hoursRemaining?: number;
  cyclesRemaining?: number;
  status: 'current' | 'due' | 'overdue' | 'n/a';
  facility?: string; // Where performed
  workOrderNumber?: string;
  remarks?: string;
}

export interface AirworthinessDirective {
  adNumber: string;
  title: string;
  applicableToAircraft: boolean;
  status: 'complied' | 'not-applicable' | 'due' | 'overdue';
  complianceDate?: Date;
  complianceMethod: 'inspection' | 'modification' | 'replacement' | 'life-limit';
  nextAction?: Date;
  remarks?: string;
}

export interface ServiceBulletin {
  sbNumber: string;
  title: string;
  manufacturer: string;
  status: 'complied' | 'not-applicable' | 'planned' | 'not-complied';
  complianceDate?: Date;
  mandatory: boolean;
  remarks?: string;
}

export interface Modification {
  modNumber: string;
  title: string;
  description: string;
  installedDate: Date;
  stcNumber?: string; // Supplemental Type Certificate
  weight?: number; // Weight change in lbs/kg
  centerOfGravityChange?: string;
  status: 'installed' | 'removed' | 'deferred';
  remarks?: string;
}

export interface CabinConfiguration {
  totalSeats: number;
  firstClass?: number;
  businessClass?: number;
  premiumEconomy?: number;
  economy?: number;
  seatPitch?: {
    firstClass?: string;
    businessClass?: string;
    premiumEconomy?: string;
    economy?: string;
  };
  seatWidth?: {
    firstClass?: string;
    businessClass?: string;
    premiumEconomy?: string;
    economy?: string;
  };
  galleys: number;
  lavatories: number;
  configurationNotes?: string;
  interiorRefurbDate?: Date;
  seatManufacturer?: string;
  entertainmentSystem?: string;
  wifiCapability: boolean;
}

export interface PerformanceData {
  maxTakeoffWeight: number; // MTOW in lbs/kg
  maxLandingWeight: number; // MLW in lbs/kg
  maxZeroFuelWeight: number; // MZFW in lbs/kg
  basicEmptyWeight: number; // BEW in lbs/kg
  maxRange: number; // in nautical miles
  maxCruiseSpeed: number; // in knots
  serviceceiling: number; // in feet
  maxFuelCapacity: number; // in gallons/liters
  typicalCruiseAltitude: number; // in feet
  takeoffDistance?: number; // in feet
  landingDistance?: number; // in feet
}

export interface AvionicsPackage {
  category: 'flight-management' | 'navigation' | 'communication' | 'surveillance' | 'weather';
  system: string;
  manufacturer: string;
  partNumber?: string;
  softwareVersion?: string;
  installationDate?: Date;
  nextUpdate?: Date;
  certification: string[]; // e.g., ['FAA', 'EASA']
  status: 'serviceable' | 'unserviceable' | 'deferred';
  remarks?: string;
}

export interface InsuranceDetails {
  provider: string;
  policyNumber: string;
  coverage: {
    hull: number; // Agreed value
    liability: number; // Per occurrence
    passengers: number; // Per passenger
    cargo?: number;
  };
  expiryDate: Date;
  territory: string; // Geographic coverage
  deductible: number;
  additionalCoverage?: string[];
  status: 'active' | 'expired' | 'pending-renewal';
}

export interface ComplianceStatus {
  registrationExpiry: Date;
  airworthinessExpiry: Date;
  annualInspectionDue: Date;
  radioLicenseExpiry?: Date;
  noiseComplianceStage: '3' | '4' | '5';
  emissionCompliance: 'ICAO-CAEP/6' | 'ICAO-CAEP/8' | 'ICAO-CAEP/10';
  etopsApproval?: string; // e.g., "ETOPS-180"
  rvsm: boolean; // Reduced Vertical Separation Minimum
  adsb: boolean; // ADS-B compliance
  cpdlc: boolean; // Controller-Pilot Data Link Communications
}

export interface DetailedAircraftSpecification {
  // Basic Information (from existing types)
  id: string;
  manufacturer: string;
  model: string;
  variant?: string;
  serialNumber?: string; // MSN - Manufacturer Serial Number
  registrationNumber?: string;
  yearOfManufacture: number;
  firstFlightDate?: Date;
  deliveryDate?: Date;
  
  // Flight Hours and Cycles
  totalFlightHours: number;
  totalCycles: number;
  totalLandings: number;
  averageFlightTime?: number; // Average hours per flight
  
  // Engines
  engines: EngineDetails[];
  engineModel: string;
  engineCount: number;
  
  // APU
  apu?: APUDetails;
  
  // Landing Gear
  landingGear: LandingGearDetails[];
  
  // Maintenance
  maintenanceChecks: MaintenanceCheck[];
  maintenanceProgram: 'MSG-3' | 'Hard Time' | 'On Condition' | 'Condition Monitoring';
  lastMajorCheck?: Date;
  nextMajorCheckDue?: Date;
  maintenanceProvider?: string;
  
  // Airworthiness Directives
  airworthinessDirectives: AirworthinessDirective[];
  
  // Service Bulletins
  serviceBulletins: ServiceBulletin[];
  
  // Modifications
  modifications: Modification[];
  
  // Configuration
  cabinConfiguration: CabinConfiguration;
  
  // Performance
  performanceData: PerformanceData;
  
  // Avionics
  avionicsPackages: AvionicsPackage[];
  
  // Location and Status
  currentLocation: {
    country: string;
    city: string;
    airport?: string;
    hangar?: string;
  };
  operationalStatus: 'in-service' | 'stored' | 'maintenance' | 'retired' | 'available-for-lease';
  
  // Ownership and Operation
  ownerOperator?: string;
  operatingCertificate?: string;
  homeBase?: string;
  typicalRoutes?: string[];
  
  // Insurance and Compliance
  insurance?: InsuranceDetails;
  compliance: ComplianceStatus;
  
  // Documentation
  documentsAvailable: {
    techLog: boolean;
    flightRecords: boolean;
    maintenanceRecords: boolean;
    weightAndBalance: boolean;
    paintRecords: boolean;
    interiorRecords: boolean;
    adCompliance: boolean;
    serviceHistory: boolean;
  };
  
  // Financials (if accessible)
  pricing?: {
    askingPrice?: number;
    currency: string;
    priceType: 'asking' | 'negotiable' | 'auction' | 'lease-rate';
    monthlyLeaseRate?: number;
    terms?: string;
  };
  
  // Inspection and Condition
  lastInspectionDate?: Date;
  nextInspectionDue?: Date;
  overallCondition: 'excellent' | 'very-good' | 'good' | 'fair' | 'needs-work';
  paintCondition: 'excellent' | 'very-good' | 'good' | 'fair' | 'needs-work';
  interiorCondition: 'excellent' | 'very-good' | 'good' | 'fair' | 'needs-work';
  
  // Notes and Remarks
  remarks?: string;
  sellerNotes?: string;
  inspectionNotes?: string;
  
  // Metadata
  lastUpdated: Date;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  dataSource: 'owner' | 'operator' | 'broker' | 'third-party';
}

// Utility types for filtering and searching
export type MaintenanceCheckType = 'A' | 'B' | 'C' | 'D' | '1A' | '2A' | '3A' | '4A';
export type AircraftCondition = 'excellent' | 'very-good' | 'good' | 'fair' | 'needs-work';
export type OperationalStatus = 'in-service' | 'stored' | 'maintenance' | 'retired' | 'available-for-lease';
export type ComplianceItem = 'registration' | 'airworthiness' | 'annual' | 'noise' | 'emission' | 'etops' | 'rvsm' | 'adsb';

export interface AircraftSearchFilters {
  manufacturer?: string[];
  model?: string[];
  yearRange?: { min: number; max: number };
  hoursRange?: { min: number; max: number };
  cyclesRange?: { min: number; max: number };
  priceRange?: { min: number; max: number };
  location?: string[];
  operationalStatus?: OperationalStatus[];
  overallCondition?: AircraftCondition[];
  maintenanceStatus?: ('current' | 'due' | 'overdue')[];
  engineModel?: string[];
  seatingCapacity?: { min: number; max: number };
  hasEtops?: boolean;
  hasWifi?: boolean;
  lastCheckWithin?: number; // days
  nextCheckDue?: number; // days
}

export default DetailedAircraftSpecification;
