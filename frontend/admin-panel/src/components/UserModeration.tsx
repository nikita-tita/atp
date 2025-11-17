import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  FlagIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  businessType: string;
  country: string;
  registrationDate: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'under-review';
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  documentsUploaded: number;
  totalDocuments: number;
  riskScore: number; // 0-100, higher = more risk
  lastActivity: Date;
  flagReason?: string;
  rejectionReason?: string;
}

interface Document {
  id: string;
  userId: string;
  type: string;
  fileName: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: Date;
  comments?: string;
  fileUrl: string;
}

const UserModeration: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'verification' | 'documents' | 'flagged'>('verification');
  const [loading, setLoading] = useState(true);

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@aviationbrokers.com',
      company: 'Global Aviation Brokers',
      businessType: 'broker',
      country: 'United States',
      registrationDate: new Date('2024-09-10'),
      verificationStatus: 'pending',
      kycStatus: 'submitted',
      documentsUploaded: 6,
      totalDocuments: 8,
      riskScore: 25,
      lastActivity: new Date('2024-09-14')
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      email: 'maria.rodriguez@iberiaair.com',
      company: 'Iberia Airlines',
      businessType: 'airline',
      country: 'Spain',
      registrationDate: new Date('2024-09-08'),
      verificationStatus: 'under-review',
      kycStatus: 'submitted',
      documentsUploaded: 8,
      totalDocuments: 8,
      riskScore: 15,
      lastActivity: new Date('2024-09-15')
    },
    {
      id: '3',
      firstName: 'Ahmed',
      lastName: 'Al-Rashid',
      email: 'ahmed@suspiciouscompany.ae',
      company: 'Quick Air Trading',
      businessType: 'broker',
      country: 'UAE',
      registrationDate: new Date('2024-09-12'),
      verificationStatus: 'pending',
      kycStatus: 'pending',
      documentsUploaded: 2,
      totalDocuments: 8,
      riskScore: 85,
      lastActivity: new Date('2024-09-13'),
      flagReason: 'Suspicious registration details, multiple accounts detected'
    }
  ];

  const mockDocuments: Document[] = [
    {
      id: 'doc1',
      userId: '1',
      type: 'Corporate Registration',
      fileName: 'corp_registration_global_aviation.pdf',
      uploadDate: new Date('2024-09-10'),
      status: 'pending',
      fileUrl: '/mock/documents/corp_reg.pdf'
    },
    {
      id: 'doc2',
      userId: '1',
      type: 'Business License',
      fileName: 'business_license_2024.pdf',
      uploadDate: new Date('2024-09-10'),
      status: 'approved',
      reviewedBy: 'admin@atp.com',
      reviewDate: new Date('2024-09-11'),
      comments: 'Valid license, expires 2026',
      fileUrl: '/mock/documents/business_license.pdf'
    },
    {
      id: 'doc3',
      userId: '2',
      type: 'Aviation License',
      fileName: 'iberia_aoc_certificate.pdf',
      uploadDate: new Date('2024-09-08'),
      status: 'approved',
      reviewedBy: 'admin@atp.com',
      reviewDate: new Date('2024-09-09'),
      comments: 'Valid AOC certificate',
      fileUrl: '/mock/documents/aoc_cert.pdf'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(mockUsers);
      setDocuments(mockDocuments);
      setLoading(false);
    };
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'verified':
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'under-review':
      case 'submitted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'flag', reason?: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'approve':
            return { ...user, verificationStatus: 'verified' as const, kycStatus: 'verified' as const };
          case 'reject':
            return { ...user, verificationStatus: 'rejected' as const, rejectionReason: reason };
          case 'flag':
            return { ...user, flagReason: reason, riskScore: Math.max(user.riskScore, 75) };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const handleDocumentAction = async (docId: string, action: 'approve' | 'reject', comments?: string) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: action === 'approve' ? 'approved' as const : 'rejected' as const,
          reviewedBy: 'current.admin@atp.com',
          reviewDate: new Date(),
          comments
        };
      }
      return doc;
    }));
  };

  const pendingUsers = users.filter(u => u.verificationStatus === 'pending' || u.kycStatus === 'submitted');
  const flaggedUsers = users.filter(u => u.flagReason || u.riskScore >= 70);
  const pendingDocuments = documents.filter(d => d.status === 'pending');

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
            <h1 className="text-2xl font-bold text-gray-900">User Moderation</h1>
            <p className="mt-1 text-sm text-gray-600">
              Review and moderate user registrations, documents, and compliance
            </p>
          </div>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{flaggedUsers.length}</div>
              <div className="text-sm text-gray-600">Flagged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pendingDocuments.length}</div>
              <div className="text-sm text-gray-600">Docs Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'verification', name: 'User Verification', icon: UserGroupIcon, count: pendingUsers.length },
              { id: 'documents', name: 'Document Review', icon: DocumentTextIcon, count: pendingDocuments.length },
              { id: 'flagged', name: 'Flagged Users', icon: FlagIcon, count: flaggedUsers.length }
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
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Pending User Verifications</h2>
              
              {pendingUsers.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
                  <p className="mt-1 text-sm text-gray-500">All users are up to date!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(user.riskScore)}`}>
                              Risk: {user.riskScore}%
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Email:</span>
                              <span className="ml-2">{user.email}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Company:</span>
                              <span className="ml-2">{user.company}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Business Type:</span>
                              <span className="ml-2 capitalize">{user.businessType}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Country:</span>
                              <span className="ml-2">{user.country}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Registered:</span>
                              <span className="ml-2">{user.registrationDate.toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Documents:</span>
                              <span className="ml-2">{user.documentsUploaded}/{user.totalDocuments}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-4">
                            <span className={getStatusBadge(user.verificationStatus)}>
                              {user.verificationStatus}
                            </span>
                            <span className={getStatusBadge(user.kycStatus)}>
                              KYC: {user.kycStatus}
                            </span>
                          </div>

                          {user.flagReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                              <div className="flex items-start">
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                                <div>
                                  <h4 className="font-medium text-red-800">Flagged</h4>
                                  <p className="text-sm text-red-700">{user.flagReason}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-6">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                          
                          <button
                            onClick={() => handleUserAction(user.id, 'approve')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          
                          <button
                            onClick={() => {
                              const reason = prompt('Rejection reason:');
                              if (reason) handleUserAction(user.id, 'reject', reason);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                          
                          <button
                            onClick={() => {
                              const reason = prompt('Flag reason:');
                              if (reason) handleUserAction(user.id, 'flag', reason);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                          >
                            <FlagIcon className="h-4 w-4 mr-1" />
                            Flag
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Document Review Queue</h2>
              
              {pendingDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending documents</h3>
                  <p className="mt-1 text-sm text-gray-500">All documents have been reviewed!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingDocuments.map((doc) => {
                    const user = users.find(u => u.id === doc.userId);
                    return (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-medium text-gray-900">{doc.type}</h3>
                              <span className={getStatusBadge(doc.status)}>
                                {doc.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">User:</span>
                                <span className="ml-2">{user?.firstName} {user?.lastName}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Company:</span>
                                <span className="ml-2">{user?.company}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">File:</span>
                                <span className="ml-2 font-mono text-xs">{doc.fileName}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Uploaded:</span>
                                <span className="ml-2">{doc.uploadDate.toLocaleDateString()}</span>
                              </div>
                            </div>

                            {doc.comments && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                <p className="text-sm text-gray-700">{doc.comments}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2 ml-6">
                            <button
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View Document
                            </button>
                            
                            <button
                              onClick={() => {
                                const comments = prompt('Approval comments (optional):');
                                handleDocumentAction(doc.id, 'approve', comments || undefined);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Approve
                            </button>
                            
                            <button
                              onClick={() => {
                                const comments = prompt('Rejection reason:');
                                if (comments) handleDocumentAction(doc.id, 'reject', comments);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'flagged' && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Flagged Users</h2>
              
              {flaggedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No flagged users</h3>
                  <p className="mt-1 text-sm text-gray-500">All users are in good standing!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flaggedUsers.map((user) => (
                    <div key={user.id} className="border-l-4 border-red-400 bg-red-50 p-6 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-medium text-red-900">
                              {user.firstName} {user.lastName}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(user.riskScore)}`}>
                              High Risk: {user.riskScore}%
                            </span>
                          </div>
                          
                          <div className="text-sm text-red-800 space-y-1">
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Company:</strong> {user.company}</div>
                            <div><strong>Country:</strong> {user.country}</div>
                            {user.flagReason && (
                              <div className="mt-2">
                                <strong>Flag Reason:</strong> {user.flagReason}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-6">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Investigate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  User Details: {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Company:</strong> {selectedUser.company}</div>
                  <div><strong>Business Type:</strong> {selectedUser.businessType}</div>
                  <div><strong>Country:</strong> {selectedUser.country}</div>
                  <div><strong>Registration Date:</strong> {selectedUser.registrationDate.toLocaleDateString()}</div>
                  <div><strong>Last Activity:</strong> {selectedUser.lastActivity.toLocaleDateString()}</div>
                  <div><strong>Documents:</strong> {selectedUser.documentsUploaded}/{selectedUser.totalDocuments}</div>
                  <div><strong>Risk Score:</strong> <span className={getRiskColor(selectedUser.riskScore).split(' ')[0]}>{selectedUser.riskScore}%</span></div>
                </div>

                <div className="flex space-x-2">
                  <span className={getStatusBadge(selectedUser.verificationStatus)}>
                    Verification: {selectedUser.verificationStatus}
                  </span>
                  <span className={getStatusBadge(selectedUser.kycStatus)}>
                    KYC: {selectedUser.kycStatus}
                  </span>
                </div>

                {selectedUser.flagReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="font-medium text-red-800">Flag Reason:</h4>
                    <p className="text-sm text-red-700">{selectedUser.flagReason}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">User Documents</h4>
                  <div className="space-y-2">
                    {documents.filter(d => d.userId === selectedUser.id).map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{doc.type}</span>
                        <span className={getStatusBadge(doc.status)}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserModeration;
