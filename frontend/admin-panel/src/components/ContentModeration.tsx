import React, { useState, useEffect } from 'react';
import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FlagIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

interface AircraftListing {
  id: string;
  title: string;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  seller: {
    name: string;
    company: string;
    verified: boolean;
  };
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  submissionDate: Date;
  lastModified: Date;
  images: string[];
  description: string;
  specifications: {
    hours: number;
    cycles: number;
    seats: number;
  };
  flags: {
    suspiciousPrice: boolean;
    duplicateContent: boolean;
    poorQuality: boolean;
    missingInfo: boolean;
  };
  moderationNotes?: string;
  autoCheckResults: {
    priceCheck: 'pass' | 'warning' | 'fail';
    duplicateCheck: 'pass' | 'warning' | 'fail';
    qualityCheck: 'pass' | 'warning' | 'fail';
    completenessCheck: 'pass' | 'warning' | 'fail';
  };
}

interface ModerationQueue {
  pending: AircraftListing[];
  flagged: AircraftListing[];
  rejected: AircraftListing[];
}

const ContentModeration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'flagged' | 'rejected'>('pending');
  const [selectedListing, setSelectedListing] = useState<AircraftListing | null>(null);
  const [moderationQueue, setModerationQueue] = useState<ModerationQueue>({
    pending: [],
    flagged: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockListings: AircraftListing[] = [
    {
      id: '1',
      title: 'Pristine Boeing 737-800 - Low Hours',
      manufacturer: 'Boeing',
      model: '737-800',
      year: 2015,
      price: 45000000,
      currency: 'USD',
      seller: {
        name: 'John Smith',
        company: 'Global Aviation Brokers',
        verified: true
      },
      location: 'Miami, FL, USA',
      status: 'pending',
      submissionDate: new Date('2024-09-14'),
      lastModified: new Date('2024-09-14'),
      images: ['/mock/aircraft1.jpg', '/mock/aircraft2.jpg'],
      description: 'Excellent condition Boeing 737-800 with comprehensive maintenance records. Perfect for immediate commercial operations.',
      specifications: {
        hours: 28500,
        cycles: 18200,
        seats: 189
      },
      flags: {
        suspiciousPrice: false,
        duplicateContent: false,
        poorQuality: false,
        missingInfo: false
      },
      autoCheckResults: {
        priceCheck: 'pass',
        duplicateCheck: 'pass',
        qualityCheck: 'pass',
        completenessCheck: 'pass'
      }
    },
    {
      id: '2',
      title: 'URGENT SALE - Airbus A320 - Must Sell!',
      manufacturer: 'Airbus',
      model: 'A320-200',
      year: 2018,
      price: 25000000,
      currency: 'USD',
      seller: {
        name: 'Quick Sales Corp',
        company: 'Fast Aircraft Sales',
        verified: false
      },
      location: 'Unknown',
      status: 'flagged',
      submissionDate: new Date('2024-09-13'),
      lastModified: new Date('2024-09-13'),
      images: ['/mock/aircraft3.jpg'],
      description: 'Need to sell fast! Great plane, no issues, contact immediately for best deal!!!',
      specifications: {
        hours: 15600,
        cycles: 9800,
        seats: 180
      },
      flags: {
        suspiciousPrice: true,
        duplicateContent: false,
        poorQuality: true,
        missingInfo: true
      },
      autoCheckResults: {
        priceCheck: 'fail',
        duplicateCheck: 'pass',
        qualityCheck: 'fail',
        completenessCheck: 'warning'
      },
      moderationNotes: 'Price 52% below market average. Poor quality description. Seller not verified.'
    },
    {
      id: '3',
      title: 'Boeing 777-300ER - Premium Aircraft',
      manufacturer: 'Boeing',
      model: '777-300ER',
      year: 2010,
      price: 85000000,
      currency: 'USD',
      seller: {
        name: 'Emirates Trading',
        company: 'Emirates Aircraft Trading',
        verified: true
      },
      location: 'Dubai, UAE',
      status: 'pending',
      submissionDate: new Date('2024-09-12'),
      lastModified: new Date('2024-09-14'),
      images: ['/mock/aircraft4.jpg', '/mock/aircraft5.jpg', '/mock/aircraft6.jpg'],
      description: 'Well-maintained Boeing 777-300ER with full service history. Recently completed C-check. ETOPS-180 certified.',
      specifications: {
        hours: 45600,
        cycles: 12800,
        seats: 396
      },
      flags: {
        suspiciousPrice: false,
        duplicateContent: false,
        poorQuality: false,
        missingInfo: false
      },
      autoCheckResults: {
        priceCheck: 'pass',
        duplicateCheck: 'pass',
        qualityCheck: 'pass',
        completenessCheck: 'pass'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setModerationQueue({
        pending: mockListings.filter(l => l.status === 'pending'),
        flagged: mockListings.filter(l => l.status === 'flagged'),
        rejected: mockListings.filter(l => l.status === 'rejected')
      });
      
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatusBadge = (status: AircraftListing['status']) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'flagged':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCheckResult = (result: 'pass' | 'warning' | 'fail') => {
    switch (result) {
      case 'pass':
        return { icon: CheckCircleIcon, color: 'text-green-600', bg: 'bg-green-100' };
      case 'warning':
        return { icon: ExclamationTriangleIcon, color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'fail':
        return { icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-100' };
    }
  };

  const handleListingAction = async (listingId: string, action: 'approve' | 'reject' | 'flag', reason?: string) => {
    // Update listing status
    const updateQueue = (queue: AircraftListing[]) => 
      queue.map(listing => {
        if (listing.id === listingId) {
          return {
            ...listing,
            status: action === 'approve' ? 'approved' as const : 
                   action === 'reject' ? 'rejected' as const : 
                   'flagged' as const,
            moderationNotes: reason
          };
        }
        return listing;
      });

    setModerationQueue(prev => ({
      pending: updateQueue(prev.pending).filter(l => l.status === 'pending'),
      flagged: updateQueue(prev.flagged).filter(l => l.status === 'flagged'),
      rejected: updateQueue(prev.rejected).filter(l => l.status === 'rejected')
    }));

    setSelectedListing(null);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(price);
  };

  const getCurrentListings = () => {
    return moderationQueue[activeTab] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Review and moderate aircraft listings for quality and compliance
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{moderationQueue.pending.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{moderationQueue.flagged.length}</div>
              <div className="text-sm text-gray-600">Flagged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{moderationQueue.rejected.length}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'pending', name: 'Pending Review', icon: ClockIcon, count: moderationQueue.pending.length },
              { id: 'flagged', name: 'Flagged', icon: FlagIcon, count: moderationQueue.flagged.length },
              { id: 'rejected', name: 'Rejected', icon: XCircleIcon, count: moderationQueue.rejected.length }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                  {tab.count > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {getCurrentListings().length === 0 ? (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No listings in {activeTab}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'pending' ? 'All listings have been reviewed!' : 
                 activeTab === 'flagged' ? 'No flagged listings at this time.' : 
                 'No rejected listings.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {getCurrentListings().map((listing) => (
                <div key={listing.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{listing.title}</h3>
                        <span className={getStatusBadge(listing.status)}>
                          {listing.status}
                        </span>
                        {Object.values(listing.flags).some(flag => flag) && (
                          <FlagIcon className="h-5 w-5 text-red-500" />
                        )}
                      </div>

                      {/* Aircraft Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {listing.manufacturer} {listing.model} ({listing.year})
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatPrice(listing.price, listing.currency)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{listing.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {listing.submissionDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div className="mb-4">
                        <span className="text-sm font-medium text-gray-700">Seller: </span>
                        <span className="text-sm text-gray-600">{listing.seller.name}</span>
                        <span className="text-sm text-gray-500"> ({listing.seller.company})</span>
                        {listing.seller.verified ? (
                          <CheckCircleIcon className="inline h-4 w-4 text-green-500 ml-1" />
                        ) : (
                          <ExclamationTriangleIcon className="inline h-4 w-4 text-yellow-500 ml-1" />
                        )}
                      </div>

                      {/* Auto Check Results */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {Object.entries(listing.autoCheckResults).map(([check, result]) => {
                          const { icon: Icon, color, bg } = getCheckResult(result);
                          return (
                            <div key={check} className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${bg}`}>
                              <Icon className={`h-4 w-4 ${color}`} />
                              <span className="text-xs font-medium capitalize">
                                {check.replace('Check', '')}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Description Preview */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                      </div>

                      {/* Flags */}
                      {Object.entries(listing.flags).some(([_, flag]) => flag) && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-red-700 mb-2">Issues Detected:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(listing.flags).map(([flag, isActive]) => 
                              isActive && (
                                <span key={flag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {flag.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Moderation Notes */}
                      {listing.moderationNotes && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <h4 className="text-sm font-medium text-yellow-800">Moderation Notes:</h4>
                          <p className="text-sm text-yellow-700 mt-1">{listing.moderationNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <button
                        onClick={() => setSelectedListing(listing)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Full
                      </button>
                      
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleListingAction(listing.id, 'approve')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) handleListingAction(listing.id, 'reject', reason);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                          
                          <button
                            onClick={() => {
                              const reason = prompt('Flag reason:');
                              if (reason) handleListingAction(listing.id, 'flag', reason);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                          >
                            <FlagIcon className="h-4 w-4 mr-1" />
                            Flag
                          </button>
                        </>
                      )}

                      {listing.status === 'flagged' && (
                        <>
                          <button
                            onClick={() => handleListingAction(listing.id, 'approve')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) handleListingAction(listing.id, 'reject', reason);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedListing.title}
                </h3>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Aircraft Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Aircraft Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Aircraft:</strong> {selectedListing.manufacturer} {selectedListing.model}</div>
                    <div><strong>Year:</strong> {selectedListing.year}</div>
                    <div><strong>Price:</strong> {formatPrice(selectedListing.price, selectedListing.currency)}</div>
                    <div><strong>Location:</strong> {selectedListing.location}</div>
                    <div><strong>Hours:</strong> {selectedListing.specifications.hours.toLocaleString()}</div>
                    <div><strong>Cycles:</strong> {selectedListing.specifications.cycles.toLocaleString()}</div>
                    <div><strong>Seats:</strong> {selectedListing.specifications.seats}</div>
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedListing.description}</p>
                </div>

                {/* Seller Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Seller Information</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Name:</strong> {selectedListing.seller.name}</div>
                    <div><strong>Company:</strong> {selectedListing.seller.company}</div>
                    <div><strong>Verified:</strong> {selectedListing.seller.verified ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {/* Auto Check Results */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Automated Checks</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedListing.autoCheckResults).map(([check, result]) => {
                      const { icon: Icon, color, bg } = getCheckResult(result);
                      return (
                        <div key={check} className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${bg}`}>
                          <Icon className={`h-4 w-4 ${color}`} />
                          <span className="text-sm font-medium capitalize">
                            {check.replace('Check', '')}: {result}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {selectedListing.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleListingAction(selectedListing.id, 'approve');
                          setSelectedListing(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) {
                            handleListingAction(selectedListing.id, 'reject', reason);
                            setSelectedListing(null);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;
