import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccessControl } from '../hooks/useAccessControl';
import AccessGuard from '../components/AccessGuard';
import DetailedAircraftSpecs from '../components/DetailedAircraftSpecs';
import MaintenanceSchedule from '../components/MaintenanceSchedule';
import { DetailedAircraftSpecification } from '../types/aircraft';
import { 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EnhancedAircraftDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const accessControl = useAccessControl();
  const [activeTab, setActiveTab] = useState('overview');
  const [aircraft, setAircraft] = useState<DetailedAircraftSpecification | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestingMandate, setRequestingMandate] = useState(false);

  // Mock detailed aircraft data
  const mockAircraft: DetailedAircraftSpecification = {
    id: id || '1',
    manufacturer: 'Boeing',
    model: '737-800',
    variant: 'NG',
    serialNumber: 'MSN-32847',
    registrationNumber: 'N8737K',
    yearOfManufacture: 2015,
    firstFlightDate: new Date('2015-03-15'),
    deliveryDate: new Date('2015-04-10'),
    
    totalFlightHours: 28500,
    totalCycles: 18200,
    totalLandings: 18200,
    averageFlightTime: 1.57,
    
    engines: [
      {
        id: 'eng-left',
        position: 'left',
        model: 'CFM56-7B26',
        serialNumber: 'ENG123456',
        manufacturer: 'CFM International',
        totalHours: 28500,
        totalCycles: 18200,
        hoursSinceOverhaul: 12500,
        cyclesSinceOverhaul: 8200,
        lastOverhaulDate: new Date('2022-06-15'),
        nextOverhaulDue: new Date('2026-06-15'),
        thrustRating: '26,300 lbf',
        status: 'serviceable',
        remarks: 'Engine in excellent condition'
      },
      {
        id: 'eng-right',
        position: 'right',
        model: 'CFM56-7B26',
        serialNumber: 'ENG789012',
        manufacturer: 'CFM International',
        totalHours: 28500,
        totalCycles: 18200,
        hoursSinceOverhaul: 12500,
        cyclesSinceOverhaul: 8200,
        lastOverhaulDate: new Date('2022-06-15'),
        nextOverhaulDue: new Date('2026-06-15'),
        thrustRating: '26,300 lbf',
        status: 'serviceable',
        remarks: 'Engine in excellent condition'
      }
    ],
    
    engineModel: 'CFM56-7B26',
    engineCount: 2,
    
    apu: {
      model: 'GTCP131-9B',
      serialNumber: 'APU456789',
      manufacturer: 'Honeywell',
      totalHours: 15200,
      totalCycles: 12800,
      hoursSinceOverhaul: 3200,
      cyclesSinceOverhaul: 2800,
      lastOverhaulDate: new Date('2023-08-20'),
      nextOverhaulDue: new Date('2028-08-20'),
      status: 'serviceable',
      remarks: 'APU recently overhauled'
    },
    
    landingGear: [
      {
        component: 'nose',
        totalCycles: 18200,
        cyclesSinceOverhaul: 8200,
        lastOverhaulDate: new Date('2022-03-10'),
        nextOverhaulDue: new Date('2027-03-10'),
        tiresCondition: 'good',
        brakesCondition: 'good',
        status: 'serviceable'
      },
      {
        component: 'main-left',
        totalCycles: 18200,
        cyclesSinceOverhaul: 8200,
        lastOverhaulDate: new Date('2022-03-10'),
        nextOverhaulDue: new Date('2027-03-10'),
        tiresCondition: 'good',
        brakesCondition: 'fair',
        status: 'serviceable',
        remarks: 'Brakes due for replacement at next C-check'
      },
      {
        component: 'main-right',
        totalCycles: 18200,
        cyclesSinceOverhaul: 8200,
        lastOverhaulDate: new Date('2022-03-10'),
        nextOverhaulDue: new Date('2027-03-10'),
        tiresCondition: 'good',
        brakesCondition: 'fair',
        status: 'serviceable',
        remarks: 'Brakes due for replacement at next C-check'
      }
    ],
    
    maintenanceChecks: [
      {
        checkType: 'A',
        intervalHours: 750,
        lastPerformed: new Date('2024-08-15'),
        lastPerformedAt: 'Delta TechOps - Atlanta',
        nextDue: new Date('2024-11-20'),
        hoursRemaining: 450,
        status: 'current',
        facility: 'Delta TechOps',
        workOrderNumber: 'WO-2024-08-1234'
      },
      {
        checkType: 'B',
        intervalCalendar: 6,
        lastPerformed: new Date('2024-05-10'),
        lastPerformedAt: 'Lufthansa Technik - Hamburg',
        nextDue: new Date('2024-11-10'),
        status: 'due',
        facility: 'Lufthansa Technik',
        workOrderNumber: 'WO-2024-05-5678'
      },
      {
        checkType: 'C',
        intervalHours: 6000,
        intervalCalendar: 18,
        lastPerformed: new Date('2023-02-20'),
        lastPerformedAt: 'ST Engineering - Singapore',
        nextDue: new Date('2025-08-20'),
        hoursRemaining: 3500,
        status: 'current',
        facility: 'ST Engineering',
        workOrderNumber: 'WO-2023-02-9012'
      },
      {
        checkType: 'D',
        intervalCalendar: 120,
        lastPerformed: new Date('2020-01-15'),
        lastPerformedAt: 'Boeing - Seattle',
        nextDue: new Date('2030-01-15'),
        status: 'current',
        facility: 'Boeing Service Center',
        workOrderNumber: 'WO-2020-01-3456',
        remarks: 'Major structural inspection completed'
      }
    ],
    
    maintenanceProgram: 'MSG-3',
    lastMajorCheck: new Date('2023-02-20'),
    nextMajorCheckDue: new Date('2025-08-20'),
    maintenanceProvider: 'ST Engineering',
    
    airworthinessDirectives: [
      {
        adNumber: 'AD 2023-08-15',
        title: 'Engine Fan Blade Inspection',
        applicableToAircraft: true,
        status: 'complied',
        complianceDate: new Date('2023-09-10'),
        complianceMethod: 'inspection',
        remarks: 'Complied during last C-check'
      },
      {
        adNumber: 'AD 2024-01-20',
        title: 'Wing Bolt Replacement',
        applicableToAircraft: true,
        status: 'complied',
        complianceDate: new Date('2024-02-15'),
        complianceMethod: 'replacement',
        remarks: 'All affected bolts replaced'
      }
    ],
    
    serviceBulletins: [],
    modifications: [],
    
    cabinConfiguration: {
      totalSeats: 189,
      businessClass: 12,
      economy: 177,
      seatPitch: {
        businessClass: '36 inches',
        economy: '30-31 inches'
      },
      galleys: 4,
      lavatories: 6,
      configurationNotes: 'Standard two-class configuration',
      interiorRefurbDate: new Date('2022-01-15'),
      seatManufacturer: 'Recaro',
      entertainmentSystem: 'Panasonic eX3',
      wifiCapability: true
    },
    
    performanceData: {
      maxTakeoffWeight: 174200,
      maxLandingWeight: 146300,
      maxZeroFuelWeight: 138300,
      basicEmptyWeight: 91300,
      maxRange: 3115,
      maxCruiseSpeed: 842,
      serviceceiling: 41000,
      maxFuelCapacity: 6875,
      typicalCruiseAltitude: 39000,
      takeoffDistance: 8400,
      landingDistance: 4900
    },
    
    avionicsPackages: [
      {
        category: 'flight-management',
        system: 'FMC (Flight Management Computer)',
        manufacturer: 'Honeywell',
        certification: ['FAA', 'EASA'],
        status: 'serviceable'
      },
      {
        category: 'navigation',
        system: 'GPS/WAAS',
        manufacturer: 'Honeywell',
        certification: ['FAA', 'EASA'],
        status: 'serviceable'
      },
      {
        category: 'surveillance',
        system: 'ADS-B Out',
        manufacturer: 'Honeywell',
        certification: ['FAA', 'EASA'],
        status: 'serviceable'
      }
    ],
    
    currentLocation: {
      country: 'United States',
      city: 'Miami',
      airport: 'MIA',
      hangar: 'Hangar 7'
    },
    
    operationalStatus: 'available-for-lease',
    
    ownerOperator: 'Atlas Aviation Leasing',
    homeBase: 'Miami International Airport',
    typicalRoutes: ['MIA-JFK', 'MIA-LAX', 'MIA-DFW'],
    
    compliance: {
      registrationExpiry: new Date('2025-12-31'),
      airworthinessExpiry: new Date('2025-03-15'),
      annualInspectionDue: new Date('2025-03-15'),
      radioLicenseExpiry: new Date('2026-01-31'),
      noiseComplianceStage: '4',
      emissionCompliance: 'ICAO-CAEP/8',
      etopsApproval: 'ETOPS-180',
      rvsm: true,
      adsb: true,
      cpdlc: true
    },
    
    documentsAvailable: {
      techLog: true,
      flightRecords: true,
      maintenanceRecords: true,
      weightAndBalance: true,
      paintRecords: true,
      interiorRecords: true,
      adCompliance: true,
      serviceHistory: true
    },
    
    pricing: {
      askingPrice: 45000000,
      currency: 'USD',
      priceType: 'negotiable',
      monthlyLeaseRate: 280000,
      terms: 'Dry lease, minimum 24 months'
    },
    
    lastInspectionDate: new Date('2024-08-15'),
    nextInspectionDue: new Date('2024-11-15'),
    overallCondition: 'very-good',
    paintCondition: 'good',
    interiorCondition: 'very-good',
    
    remarks: 'Well-maintained aircraft with comprehensive maintenance records. Recent interior refurbishment. Suitable for immediate commercial operations.',
    sellerNotes: 'Priced to sell. Open to reasonable offers. Can arrange viewing in Miami.',
    
    lastUpdated: new Date(),
    verificationStatus: 'verified',
    dataSource: 'owner'
  };

  useEffect(() => {
    // Simulate API call
    const loadAircraft = async () => {
      setLoading(true);
      try {
        // In real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAircraft(mockAircraft);
      } catch (error) {
        toast.error('Failed to load aircraft details');
      } finally {
        setLoading(false);
      }
    };

    loadAircraft();
  }, [id]);

  const handleRequestMandate = async () => {
    setRequestingMandate(true);
    try {
      // Simulate API call for mandate request
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Mandate request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit mandate request');
    } finally {
      setRequestingMandate(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
    { id: 'specifications', name: 'Detailed Specs', icon: DocumentTextIcon },
    { id: 'maintenance', name: 'Maintenance', icon: ShieldCheckIcon },
    { id: 'documentation', name: 'Documentation', icon: DocumentTextIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading aircraft details...</p>
        </div>
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Aircraft Not Found</h2>
          <p className="text-gray-600 mb-6">The aircraft you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/aircraft"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
          >
            Back to Aircraft List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {aircraft.manufacturer} {aircraft.model} {aircraft.variant}
              </h1>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {aircraft.yearOfManufacture}
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {aircraft.currentLocation.city}, {aircraft.currentLocation.country}
                </div>
                <AccessGuard permission="canViewConfidentialData" showUpgradePrompt={false}>
                  <div className="flex items-center">
                    <span className="font-mono">{aircraft.registrationNumber}</span>
                  </div>
                </AccessGuard>
              </div>
              
              {/* Status Badges */}
              <div className="mt-4 flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  aircraft.operationalStatus === 'available-for-lease' ? 'bg-green-100 text-green-800' :
                  aircraft.operationalStatus === 'in-service' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {aircraft.operationalStatus.replace('-', ' ').toUpperCase()}
                </span>
                
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  {aircraft.verificationStatus.toUpperCase()}
                </span>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  aircraft.overallCondition === 'excellent' ? 'bg-green-100 text-green-800' :
                  aircraft.overallCondition === 'very-good' ? 'bg-blue-100 text-blue-800' :
                  aircraft.overallCondition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {aircraft.overallCondition.replace('-', ' ').toUpperCase()} CONDITION
                </span>
              </div>
            </div>
            
            {/* Pricing */}
            <AccessGuard permission="canViewExtendedInfo">
              <div className="text-right">
                {aircraft.pricing && (
                  <>
                    <div className="text-3xl font-bold text-gray-900">
                      ${aircraft.pricing.askingPrice?.toLocaleString()}
                    </div>
                    {aircraft.pricing.monthlyLeaseRate && (
                      <div className="text-sm text-gray-600">
                        or ${aircraft.pricing.monthlyLeaseRate.toLocaleString()}/month lease
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-1">
                      {aircraft.pricing.priceType}
                    </div>
                  </>
                )}
              </div>
            </AccessGuard>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Aircraft Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Flight Hours</label>
                  <p className="text-2xl font-bold text-gray-900">{aircraft.totalFlightHours.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Cycles</label>
                  <p className="text-2xl font-bold text-gray-900">{aircraft.totalCycles.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Landings</label>
                  <p className="text-2xl font-bold text-gray-900">{aircraft.totalLandings.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                  <p className="text-2xl font-bold text-gray-900">{aircraft.cabinConfiguration.totalSeats}</p>
                </div>
              </div>

              {aircraft.remarks && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{aircraft.remarks}</p>
                </div>
              )}
            </div>

            {/* Quick Access Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AccessGuard 
                  permission="canContactSellers"
                  fallback={
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-2">Contact Seller</p>
                      <p className="text-xs text-gray-400">Registration required</p>
                    </div>
                  }
                >
                  <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Contact Seller
                  </button>
                </AccessGuard>

                <AccessGuard 
                  permission="canViewConfidentialData"
                  fallback={
                    <button
                      onClick={handleRequestMandate}
                      disabled={requestingMandate}
                      className="w-full flex items-center justify-center px-4 py-3 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      {requestingMandate ? 'Requesting...' : 'Request Full Access'}
                    </button>
                  }
                >
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                    <UserIcon className="h-4 w-4 mr-2" />
                    View Seller Details
                  </button>
                </AccessGuard>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Download Specs
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <DetailedAircraftSpecs aircraft={aircraft} />
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Maintenance Schedule</h2>
              <AccessGuard permission="canViewTechnicalSpecs">
                <MaintenanceSchedule checks={aircraft.maintenanceChecks} readOnly />
              </AccessGuard>
            </div>
          </div>
        )}

        {activeTab === 'documentation' && (
          <AccessGuard permission="canViewTechnicalSpecs">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Documentation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(aircraft.documentsAvailable).map(([key, available]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className={`w-3 h-3 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {available ? 'Available for download' : 'Not available'}
                    </p>
                    {available && (
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AccessGuard>
        )}
      </div>
    </div>
  );
};

export default EnhancedAircraftDetail;
