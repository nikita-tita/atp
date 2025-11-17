import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessControl } from '../hooks/useAccessControl';
import AccessGuard from './AccessGuard';
import { 
  DetailedAircraftSpecification, 
  MaintenanceCheck, 
  EngineDetails,
  AirworthinessDirective 
} from '../types/aircraft';
import {
  ClockIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface DetailedAircraftSpecsProps {
  aircraft: DetailedAircraftSpecification;
  isOwner?: boolean;
}

const DetailedAircraftSpecs: React.FC<DetailedAircraftSpecsProps> = ({ 
  aircraft, 
  isOwner = false 
}) => {
  const { t } = useTranslation();
  const accessControl = useAccessControl(isOwner);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    maintenance: false,
    engines: false,
    avionics: false,
    compliance: false,
    documentation: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getMaintenanceStatusColor = (status: MaintenanceCheck['status']) => {
    switch (status) {
      case 'current': return 'text-green-600 bg-green-100';
      case 'due': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMaintenanceStatusIcon = (status: MaintenanceCheck['status']) => {
    switch (status) {
      case 'current': return <CheckCircleIcon className="h-4 w-4" />;
      case 'due': return <ClockIcon className="h-4 w-4" />;
      case 'overdue': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <InformationCircleIcon className="h-4 w-4" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const SectionHeader: React.FC<{ 
    title: string; 
    sectionKey: string; 
    icon: React.ReactNode;
    count?: number;
  }> = ({ title, sectionKey, icon, count }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border-b border-gray-200 transition-colors"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {count !== undefined && (
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {count}
          </span>
        )}
      </div>
      {expandedSections[sectionKey] ? 
        <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : 
        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
      }
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Basic Information - Always Visible */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Aircraft Specifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft</label>
            <p className="text-lg font-semibold text-gray-900">
              {aircraft.manufacturer} {aircraft.model} {aircraft.variant}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <p className="text-lg text-gray-900">{aircraft.yearOfManufacture}</p>
          </div>
          
          <AccessGuard permission="canViewConfidentialData" showUpgradePrompt={false}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <p className="text-lg font-mono text-gray-900">{aircraft.serialNumber || 'N/A'}</p>
            </div>
          </AccessGuard>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
            <p className="text-lg text-gray-900">{formatNumber(aircraft.totalFlightHours)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Cycles</label>
            <p className="text-lg text-gray-900">{formatNumber(aircraft.totalCycles)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Landings</label>
            <p className="text-lg text-gray-900">{formatNumber(aircraft.totalLandings)}</p>
          </div>
        </div>

        {/* Performance Data */}
        <AccessGuard permission="canViewTechnicalSpecs">
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Data</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MTOW</label>
                <p className="text-sm text-gray-900">{formatNumber(aircraft.performanceData.maxTakeoffWeight)} lbs</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Range</label>
                <p className="text-sm text-gray-900">{formatNumber(aircraft.performanceData.maxRange)} nm</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Ceiling</label>
                <p className="text-sm text-gray-900">{formatNumber(aircraft.performanceData.serviceceiling)} ft</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cruise Speed</label>
                <p className="text-sm text-gray-900">{formatNumber(aircraft.performanceData.maxCruiseSpeed)} kts</p>
              </div>
            </div>
          </div>
        </AccessGuard>
      </div>

      {/* Maintenance Checks Section */}
      <AccessGuard permission="canViewTechnicalSpecs">
        <div>
          <SectionHeader 
            title="Maintenance Checks" 
            sectionKey="maintenance" 
            icon={<WrenchScrewdriverIcon className="h-5 w-5 text-gray-600" />}
            count={aircraft.maintenanceChecks.length}
          />
          
          {expandedSections.maintenance && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aircraft.maintenanceChecks.map((check, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{check.checkType}-Check</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMaintenanceStatusColor(check.status)}`}>
                        {getMaintenanceStatusIcon(check.status)}
                        <span className="ml-1 capitalize">{check.status}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      {check.lastPerformed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Performed:</span>
                          <span className="font-medium">{formatDate(check.lastPerformed)}</span>
                        </div>
                      )}
                      
                      {check.nextDue && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Due:</span>
                          <span className={`font-medium ${check.status === 'overdue' ? 'text-red-600' : check.status === 'due' ? 'text-yellow-600' : 'text-gray-900'}`}>
                            {formatDate(check.nextDue)}
                          </span>
                        </div>
                      )}
                      
                      {check.hoursRemaining !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hours Remaining:</span>
                          <span className="font-medium">{formatNumber(check.hoursRemaining)}</span>
                        </div>
                      )}
                      
                      {check.facility && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Facility:</span>
                          <span className="font-medium">{check.facility}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccessGuard>

      {/* Engines Section */}
      <AccessGuard permission="canViewTechnicalSpecs">
        <div>
          <SectionHeader 
            title="Engine Details" 
            sectionKey="engines" 
            icon={<WrenchScrewdriverIcon className="h-5 w-5 text-gray-600" />}
            count={aircraft.engines.length}
          />
          
          {expandedSections.engines && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {aircraft.engines.map((engine, index) => (
                  <div key={engine.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">
                        Engine {engine.position.toUpperCase()}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        engine.status === 'serviceable' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {engine.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{engine.model}</span>
                      </div>
                      
                      <AccessGuard permission="canViewConfidentialData" showUpgradePrompt={false}>
                        {engine.serialNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Serial:</span>
                            <span className="font-mono text-sm">{engine.serialNumber}</span>
                          </div>
                        )}
                      </AccessGuard>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hours:</span>
                        <span className="font-medium">{formatNumber(engine.totalHours)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cycles:</span>
                        <span className="font-medium">{formatNumber(engine.totalCycles)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hours Since OH:</span>
                        <span className="font-medium">{formatNumber(engine.hoursSinceOverhaul)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thrust Rating:</span>
                        <span className="font-medium">{engine.thrustRating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* APU */}
              {aircraft.apu && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">APU (Auxiliary Power Unit)</h4>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{aircraft.apu.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hours:</span>
                        <span className="font-medium">{formatNumber(aircraft.apu.totalHours)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cycles:</span>
                        <span className="font-medium">{formatNumber(aircraft.apu.totalCycles)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          aircraft.apu.status === 'serviceable' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {aircraft.apu.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AccessGuard>

      {/* Avionics Section */}
      <AccessGuard permission="canViewTechnicalSpecs">
        <div>
          <SectionHeader 
            title="Avionics & Equipment" 
            sectionKey="avionics" 
            icon={<DocumentTextIcon className="h-5 w-5 text-gray-600" />}
            count={aircraft.avionicsPackages.length}
          />
          
          {expandedSections.avionics && (
            <div className="p-6">
              <div className="space-y-4">
                {aircraft.avionicsPackages.map((avionics, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {avionics.category.replace('-', ' ')}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        avionics.status === 'serviceable' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {avionics.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">System:</span>
                        <span className="ml-2 font-medium">{avionics.system}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Manufacturer:</span>
                        <span className="ml-2 font-medium">{avionics.manufacturer}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccessGuard>

      {/* Compliance Section */}
      <AccessGuard permission="canViewTechnicalSpecs">
        <div>
          <SectionHeader 
            title="Compliance & Certification" 
            sectionKey="compliance" 
            icon={<ShieldCheckIcon className="h-5 w-5 text-gray-600" />}
          />
          
          {expandedSections.compliance && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Certifications</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration Expiry:</span>
                      <span className="font-medium">{formatDate(aircraft.compliance.registrationExpiry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Airworthiness Expiry:</span>
                      <span className="font-medium">{formatDate(aircraft.compliance.airworthinessExpiry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Inspection Due:</span>
                      <span className="font-medium">{formatDate(aircraft.compliance.annualInspectionDue)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Equipment Compliance</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Noise Stage:</span>
                      <span className="font-medium">Stage {aircraft.compliance.noiseComplianceStage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RVSM:</span>
                      <span className={`font-medium ${aircraft.compliance.rvsm ? 'text-green-600' : 'text-red-600'}`}>
                        {aircraft.compliance.rvsm ? 'Compliant' : 'Not Compliant'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ADS-B:</span>
                      <span className={`font-medium ${aircraft.compliance.adsb ? 'text-green-600' : 'text-red-600'}`}>
                        {aircraft.compliance.adsb ? 'Compliant' : 'Not Compliant'}
                      </span>
                    </div>
                    {aircraft.compliance.etopsApproval && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETOPS:</span>
                        <span className="font-medium">{aircraft.compliance.etopsApproval}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Airworthiness Directives */}
              {aircraft.airworthinessDirectives.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Airworthiness Directives ({aircraft.airworthinessDirectives.length})
                  </h4>
                  <div className="space-y-2">
                    {aircraft.airworthinessDirectives.slice(0, 5).map((ad, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{ad.adNumber}</span>
                          <p className="text-sm text-gray-600">{ad.title}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ad.status === 'complied' ? 'text-green-600 bg-green-100' : 
                          ad.status === 'not-applicable' ? 'text-gray-600 bg-gray-100' :
                          'text-red-600 bg-red-100'
                        }`}>
                          {ad.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </AccessGuard>

      {/* Documentation Section */}
      <AccessGuard permission="canViewTechnicalSpecs">
        <div>
          <SectionHeader 
            title="Available Documentation" 
            sectionKey="documentation" 
            icon={<DocumentTextIcon className="h-5 w-5 text-gray-600" />}
          />
          
          {expandedSections.documentation && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(aircraft.documentsAvailable).map(([key, available]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
              
              <AccessGuard permission="canViewConfidentialData">
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Request Documentation Package
                  </button>
                </div>
              </AccessGuard>
            </div>
          )}
        </div>
      </AccessGuard>
    </div>
  );
};

export default DetailedAircraftSpecs;
