import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MaintenanceCheck } from '../types/aircraft';
import {
  CalendarIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface MaintenanceScheduleProps {
  checks: MaintenanceCheck[];
  onUpdateCheck?: (checkId: string, updates: Partial<MaintenanceCheck>) => void;
  readOnly?: boolean;
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({
  checks,
  onUpdateCheck,
  readOnly = false
}) => {
  const { t } = useTranslation();
  const [selectedCheck, setSelectedCheck] = useState<MaintenanceCheck | null>(null);

  const getCheckTypeInfo = (checkType: MaintenanceCheck['checkType']) => {
    const checkInfo = {
      'A': {
        name: 'A-Check',
        description: 'Light maintenance check',
        typicalInterval: '600-800 flight hours or 2-3 months',
        duration: '10-20 hours',
        location: 'Line maintenance',
        color: 'blue'
      },
      'B': {
        name: 'B-Check',
        description: 'Intermediate maintenance check',
        typicalInterval: '6-8 months or 1,500-2,000 flight hours',
        duration: '1-3 days',
        location: 'Hangar required',
        color: 'green'
      },
      'C': {
        name: 'C-Check',
        description: 'Heavy maintenance check',
        typicalInterval: '18-24 months or 6,000-8,000 flight hours',
        duration: '1-2 weeks',
        location: 'Maintenance hangar',
        color: 'yellow'
      },
      'D': {
        name: 'D-Check',
        description: 'Structural inspection and overhaul',
        typicalInterval: '6-12 years or 20,000-60,000 flight hours',
        duration: '4-6 weeks',
        location: 'Specialized maintenance facility',
        color: 'red'
      },
      '1A': {
        name: '1A-Check',
        description: 'First level A-check',
        typicalInterval: '500-600 flight hours',
        duration: '8-12 hours',
        location: 'Line maintenance',
        color: 'blue'
      },
      '2A': {
        name: '2A-Check',
        description: 'Second level A-check',
        typicalInterval: '1,000-1,200 flight hours',
        duration: '12-16 hours',
        location: 'Line maintenance',
        color: 'blue'
      },
      '3A': {
        name: '3A-Check',
        description: 'Third level A-check',
        typicalInterval: '1,500-1,800 flight hours',
        duration: '16-20 hours',
        location: 'Line maintenance',
        color: 'blue'
      },
      '4A': {
        name: '4A-Check',
        description: 'Fourth level A-check',
        typicalInterval: '2,000-2,400 flight hours',
        duration: '20-24 hours',
        location: 'Hangar maintenance',
        color: 'green'
      }
    };

    return checkInfo[checkType] || checkInfo['A'];
  };

  const getStatusColor = (status: MaintenanceCheck['status']) => {
    switch (status) {
      case 'current': return 'text-green-700 bg-green-100 border-green-200';
      case 'due': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'overdue': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: MaintenanceCheck['status']) => {
    switch (status) {
      case 'current': return <CheckCircleIcon className="h-5 w-5" />;
      case 'due': return <ClockIcon className="h-5 w-5" />;
      case 'overdue': return <ExclamationTriangleIcon className="h-5 w-5" />;
      default: return <InformationCircleIcon className="h-5 w-5" />;
    }
  };

  const calculateDaysUntilDue = (nextDue?: Date) => {
    if (!nextDue) return null;
    const today = new Date();
    const diffTime = nextDue.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const sortedChecks = [...checks].sort((a, b) => {
    const statusOrder = { 'overdue': 0, 'due': 1, 'current': 2, 'n/a': 3 };
    const aOrder = statusOrder[a.status];
    const bOrder = statusOrder[b.status];
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // Then sort by check type
    const checkOrder = { 'A': 0, '1A': 1, '2A': 2, '3A': 3, '4A': 4, 'B': 5, 'C': 6, 'D': 7 };
    return checkOrder[a.checkType] - checkOrder[b.checkType];
  });

  const getUrgentChecks = () => {
    return checks.filter(check => {
      if (check.status === 'overdue') return true;
      if (check.status === 'due') {
        const daysUntil = calculateDaysUntilDue(check.nextDue);
        return daysUntil !== null && daysUntil <= 30;
      }
      return false;
    });
  };

  const urgentChecks = getUrgentChecks();

  return (
    <div className="space-y-6">
      {/* Alert for urgent checks */}
      {urgentChecks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Urgent Maintenance Required
              </h3>
              <p className="text-sm text-red-800 mb-3">
                {urgentChecks.length} maintenance check{urgentChecks.length > 1 ? 's' : ''} 
                {urgentChecks.some(c => c.status === 'overdue') ? ' overdue or ' : ' '}
                due within 30 days.
              </p>
              <div className="space-y-1">
                {urgentChecks.map((check, index) => (
                  <div key={index} className="text-sm text-red-800">
                    • {getCheckTypeInfo(check.checkType).name} - 
                    <span className="font-medium ml-1">
                      {check.status === 'overdue' ? 'OVERDUE' : `Due ${formatDate(check.nextDue)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedChecks.map((check, index) => {
          const checkInfo = getCheckTypeInfo(check.checkType);
          const daysUntilDue = calculateDaysUntilDue(check.nextDue);
          
          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-md cursor-pointer ${getStatusColor(check.status)}`}
              onClick={() => setSelectedCheck(check)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${checkInfo.color}-100`}>
                    <WrenchScrewdriverIcon className={`h-6 w-6 text-${checkInfo.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{checkInfo.name}</h3>
                    <p className="text-sm opacity-80">{checkInfo.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(check.status)}
                  <span className="font-semibold capitalize">{check.status}</span>
                </div>
              </div>

              {/* Status Details */}
              <div className="space-y-3">
                {check.lastPerformed && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                    <span>Last performed: <strong>{formatDate(check.lastPerformed)}</strong></span>
                    {check.lastPerformedAt && (
                      <span className="text-xs opacity-60">at {check.lastPerformedAt}</span>
                    )}
                  </div>
                )}

                {check.nextDue && (
                  <div className="flex items-center space-x-2 text-sm">
                    <ClockIcon className="h-4 w-4 opacity-60" />
                    <span>Next due: <strong>{formatDate(check.nextDue)}</strong></span>
                    {daysUntilDue !== null && (
                      <span className={`text-xs font-medium ${
                        daysUntilDue < 0 ? 'text-red-600' : 
                        daysUntilDue <= 30 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        ({daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                          daysUntilDue === 0 ? 'Due today' :
                          `${daysUntilDue} days remaining`})
                      </span>
                    )}
                  </div>
                )}

                {(check.hoursRemaining !== undefined || check.cyclesRemaining !== undefined) && (
                  <div className="flex items-center space-x-4 text-sm">
                    {check.hoursRemaining !== undefined && (
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4 opacity-60" />
                        <span>{check.hoursRemaining.toLocaleString()} hrs remaining</span>
                      </div>
                    )}
                    {check.cyclesRemaining !== undefined && (
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">🔄</span>
                        <span>{check.cyclesRemaining.toLocaleString()} cycles remaining</span>
                      </div>
                    )}
                  </div>
                )}

                {check.workOrderNumber && (
                  <div className="flex items-center space-x-2 text-sm">
                    <DocumentTextIcon className="h-4 w-4 opacity-60" />
                    <span>Work Order: <strong>{check.workOrderNumber}</strong></span>
                  </div>
                )}
              </div>

              {/* Interval Information */}
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <div className="text-xs opacity-75">
                  <p><strong>Typical Interval:</strong> {checkInfo.typicalInterval}</p>
                  <p><strong>Duration:</strong> {checkInfo.duration}</p>
                  <p><strong>Location:</strong> {checkInfo.location}</p>
                </div>
              </div>

              {check.remarks && (
                <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
                  <p className="text-sm font-medium">Remarks:</p>
                  <p className="text-sm">{check.remarks}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Check Modal */}
      {selectedCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {getCheckTypeInfo(selectedCheck.checkType).name} Details
                </h2>
                <button
                  onClick={() => setSelectedCheck(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Status Badge */}
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedCheck.status)}`}>
                  {getStatusIcon(selectedCheck.status)}
                  <span className="ml-2 capitalize">{selectedCheck.status}</span>
                </div>

                {/* Check Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Schedule Information</h3>
                    <div className="space-y-2 text-sm">
                      {selectedCheck.intervalHours && (
                        <div>
                          <span className="text-gray-600">Interval (Hours):</span>
                          <span className="ml-2 font-medium">{selectedCheck.intervalHours.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedCheck.intervalCalendar && (
                        <div>
                          <span className="text-gray-600">Interval (Calendar):</span>
                          <span className="ml-2 font-medium">{selectedCheck.intervalCalendar} months</span>
                        </div>
                      )}
                      {selectedCheck.intervalCycles && (
                        <div>
                          <span className="text-gray-600">Interval (Cycles):</span>
                          <span className="ml-2 font-medium">{selectedCheck.intervalCycles.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Performance Details</h3>
                    <div className="space-y-2 text-sm">
                      {selectedCheck.lastPerformed && (
                        <div>
                          <span className="text-gray-600">Last Performed:</span>
                          <span className="ml-2 font-medium">{formatDate(selectedCheck.lastPerformed)}</span>
                        </div>
                      )}
                      {selectedCheck.facility && (
                        <div>
                          <span className="text-gray-600">Facility:</span>
                          <span className="ml-2 font-medium">{selectedCheck.facility}</span>
                        </div>
                      )}
                      {selectedCheck.workOrderNumber && (
                        <div>
                          <span className="text-gray-600">Work Order:</span>
                          <span className="ml-2 font-medium">{selectedCheck.workOrderNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Check Type Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    About {getCheckTypeInfo(selectedCheck.checkType).name}
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Description:</strong> {getCheckTypeInfo(selectedCheck.checkType).description}</p>
                    <p><strong>Typical Interval:</strong> {getCheckTypeInfo(selectedCheck.checkType).typicalInterval}</p>
                    <p><strong>Duration:</strong> {getCheckTypeInfo(selectedCheck.checkType).duration}</p>
                    <p><strong>Location:</strong> {getCheckTypeInfo(selectedCheck.checkType).location}</p>
                  </div>
                </div>

                {selectedCheck.remarks && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Remarks</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedCheck.remarks}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedCheck(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {!readOnly && (
                  <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                    Update Check
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceSchedule;
