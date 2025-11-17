import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  type: string;
  name: string;
  file?: File;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  rejectReason?: string;
  uploadedAt?: Date;
}

interface KYCVerificationProps {
  userType: 'individual' | 'company';
  onComplete?: (documents: Document[]) => void;
  existingDocuments?: Document[];
}

const KYCVerification: React.FC<KYCVerificationProps> = ({ 
  userType, 
  onComplete, 
  existingDocuments = [] 
}) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>(existingDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const requiredDocuments = {
    individual: [
      { type: 'passport', name: 'Passport/ID Document', required: true },
      { type: 'proofOfAddress', name: 'Proof of Address', required: true },
      { type: 'bankStatement', name: 'Bank Statement', required: false },
      { type: 'proofOfFunds', name: 'Proof of Funds', required: false },
    ],
    company: [
      { type: 'corporateRegistry', name: 'Corporate Registration Documents', required: true },
      { type: 'businessLicense', name: 'Business License', required: true },
      { type: 'taxDocuments', name: 'Tax Registration Documents', required: true },
      { type: 'directorId', name: 'Director ID/Passport', required: true },
      { type: 'powerOfAttorney', name: 'Power of Attorney (if applicable)', required: false },
      { type: 'companyProofOfAddress', name: 'Company Proof of Address', required: true },
      { type: 'bankReference', name: 'Bank Reference Letter', required: false },
      { type: 'aviationLicense', name: 'Aviation License/Permits', required: false },
      { type: 'insuranceDocuments', name: 'Insurance Documents', required: false },
    ]
  };

  const currentRequiredDocs = requiredDocuments[userType];

  // Initialize documents if not already present
  React.useEffect(() => {
    if (documents.length === 0) {
      const initialDocs = currentRequiredDocs.map(doc => ({
        id: doc.type,
        type: doc.type,
        name: doc.name,
        status: 'pending' as const
      }));
      setDocuments(initialDocs);
    }
  }, [userType, documents.length, currentRequiredDocs]);

  const handleFileSelect = async (docType: string, file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only PDF, JPEG, or PNG files');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload (replace with actual upload logic)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setDocuments(prev => prev.map(doc => 
        doc.type === docType 
          ? { 
              ...doc, 
              file, 
              status: 'uploaded' as const, 
              uploadedAt: new Date() 
            }
          : doc
      ));

      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = (docType: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.type === docType 
        ? { 
            ...doc, 
            file: undefined, 
            status: 'pending' as const, 
            uploadedAt: undefined 
          }
        : doc
    ));
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return <DocumentTextIcon className="h-6 w-6 text-gray-400" />;
      case 'uploaded':
        return <CloudArrowUpIcon className="h-6 w-6 text-blue-500" />;
      case 'verified':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return 'Required';
      case 'uploaded':
        return 'Under Review';
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'uploaded':
        return 'text-blue-600 bg-blue-100';
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const requiredDocsCount = currentRequiredDocs.filter(doc => doc.required).length;
  const uploadedRequiredDocs = documents.filter(doc => {
    const docConfig = currentRequiredDocs.find(config => config.type === doc.type);
    return docConfig?.required && doc.status === 'uploaded';
  }).length;

  const completionPercentage = Math.round((uploadedRequiredDocs / requiredDocsCount) * 100);

  const handleSubmitForReview = () => {
    const missingRequired = currentRequiredDocs
      .filter(config => config.required)
      .filter(config => !documents.find(doc => doc.type === config.type && doc.status === 'uploaded'));

    if (missingRequired.length > 0) {
      toast.error('Please upload all required documents before submitting for review');
      return;
    }

    onComplete?.(documents);
    toast.success('Documents submitted for verification. You will be notified within 1-2 business days.');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            KYC Document Verification
          </h2>
          <p className="text-gray-600 mb-4">
            Upload the required documents to verify your identity and comply with international regulations.
          </p>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-600">
            {uploadedRequiredDocs} of {requiredDocsCount} required documents uploaded ({completionPercentage}% complete)
          </div>
        </div>

        {/* Information Banner */}
        <div className="p-6 bg-blue-50 border-b border-gray-200">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <h3 className="font-semibold mb-2">Important Information:</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>All documents must be clear, legible, and in color</li>
                <li>Accepted formats: PDF, JPEG, PNG (max 10MB per file)</li>
                <li>Documents must be valid and not expired</li>
                <li>Processing time: 1-2 business days for standard verification</li>
                <li>Additional documents may be requested if needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="p-6">
          <div className="space-y-6">
            {documents.map((doc) => {
              const docConfig = currentRequiredDocs.find(config => config.type === doc.type);
              const isRequired = docConfig?.required || false;

              return (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(doc.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {doc.name}
                          {isRequired && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {getStatusText(doc.status)}
                          </span>
                          {!isRequired && (
                            <span className="text-xs text-gray-500">(Optional)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {doc.status === 'rejected' && (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  {doc.status === 'rejected' && doc.rejectReason && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {doc.rejectReason}
                      </p>
                    </div>
                  )}

                  {doc.file ? (
                    <div className="bg-gray-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-900">{doc.file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(doc.file.size / 1024 / 1024).toFixed(1)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(doc.type)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      {doc.uploadedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded: {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={el => fileInputRefs.current[doc.type] = el}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileSelect(doc.type, file);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRefs.current[doc.type]?.click()}
                        disabled={isUploading}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          {isUploading ? 'Uploading...' : 'Upload Document'}
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          PDF, JPEG, PNG up to 10MB
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {uploadedRequiredDocs < requiredDocsCount ? (
                  <span>Upload {requiredDocsCount - uploadedRequiredDocs} more required documents to submit for review</span>
                ) : (
                  <span className="text-green-600 font-medium">All required documents uploaded!</span>
                )}
              </div>
              <button
                onClick={handleSubmitForReview}
                disabled={uploadedRequiredDocs < requiredDocsCount || isUploading}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;
