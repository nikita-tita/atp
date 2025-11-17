import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface EnhancedFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  
  // Company Information
  companyName: string;
  position: string;
  country: string;
  businessType: 'broker' | 'airline' | 'leasingCompany' | 'individual' | 'financialInstitution' | 'manufacturer' | 'mro' | 'other';
  
  // Additional Information
  companyWebsite?: string;
  linkedinProfile?: string;
  yearsInBusiness?: string;
  
  // Agreements
  agreedToTerms: boolean;
  agreedToMarketing: boolean;
}

const EnhancedRegister: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnhancedFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    position: '',
    country: '',
    businessType: 'broker',
    companyWebsite: '',
    linkedinProfile: '',
    yearsInBusiness: '',
    agreedToTerms: false,
    agreedToMarketing: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia',
    'Netherlands', 'Switzerland', 'Singapore', 'UAE', 'Hong Kong', 'Ireland',
    'Spain', 'Italy', 'Brazil', 'Mexico', 'India', 'China', 'Japan', 'South Korea',
    'Russia', 'Norway', 'Sweden', 'Denmark', 'Finland', 'Austria', 'Belgium',
    'Luxembourg', 'Portugal', 'Greece', 'Turkey', 'Israel', 'South Africa',
    'Argentina', 'Chile', 'Colombia', 'Other'
  ];

  const businessTypes = [
    { value: 'broker', label: 'Aircraft Broker', description: 'Buy/sell aircraft on behalf of clients' },
    { value: 'airline', label: 'Airline', description: 'Commercial airline operations' },
    { value: 'leasingCompany', label: 'Leasing Company', description: 'Aircraft leasing and financing' },
    { value: 'individual', label: 'Private Individual', description: 'Private aircraft owner or buyer' },
    { value: 'financialInstitution', label: 'Financial Institution', description: 'Banks, funds, and financial services' },
    { value: 'manufacturer', label: 'Aircraft Manufacturer', description: 'OEM or aircraft manufacturing' },
    { value: 'mro', label: 'MRO Provider', description: 'Maintenance, repair, and overhaul services' },
    { value: 'other', label: 'Other', description: 'Other aviation-related business' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone);
      case 2:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 8);
      case 3:
        return !!(formData.companyName && formData.position && formData.country && formData.businessType);
      case 4:
        return formData.agreedToTerms;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast.error(t('auth.register.validation.fillRequired'));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      toast.error(t('auth.register.validation.agreeTerms'));
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        company: formData.companyName,
        position: formData.position,
        country: formData.country,
        businessType: formData.businessType,
        companyWebsite: formData.companyWebsite,
        linkedinProfile: formData.linkedinProfile,
        yearsInBusiness: formData.yearsInBusiness,
        agreedToMarketing: formData.agreedToMarketing,
      });
      
      setEmailVerificationSent(true);
      toast.success(t('auth.register.enhanced.notifications.success'));
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(t('auth.register.enhanced.notifications.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step 
                ? 'bg-black border-black text-white' 
                : 'border-gray-300 text-gray-500'
            }`}>
              {currentStep > step ? (
                <CheckCircleIcon className="w-6 h-6" />
              ) : (
                step
              )}
            </div>
            {step < 4 && (
              <div className={`h-1 w-16 ${
                currentStep > step ? 'bg-black' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="text-sm text-gray-600">
          Step {currentStep} of 4: {
            currentStep === 1 ? 'Personal Information' :
            currentStep === 2 ? 'Account Security' :
            currentStep === 3 ? 'Company Details' :
            'Review & Complete'
          }
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
        <p className="text-gray-600 mt-2">Let's start with your basic information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Enter your first name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="Enter your business email"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="+1 (555) 123-4567"
          required
        />
        <p className="text-xs text-gray-500 mt-1">SMS verification will be required</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Account Security</h3>
        <p className="text-gray-600 mt-2">Create a secure password for your account</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black pr-12"
            placeholder="Create a strong password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-2 space-y-1">
          <div className={`text-xs flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
            {formData.password.length >= 8 ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />}
            At least 8 characters
          </div>
          <div className={`text-xs flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
            {/[A-Z]/.test(formData.password) ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />}
            One uppercase letter
          </div>
          <div className={`text-xs flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
            {/[0-9]/.test(formData.password) ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />}
            One number
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black pr-12"
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {formData.confirmPassword && (
          <div className={`text-xs flex items-center mt-2 ${
            formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
          }`}>
            {formData.password === formData.confirmPassword ? 
              <CheckCircleIcon className="w-4 h-4 mr-1" /> : 
              <XCircleIcon className="w-4 h-4 mr-1" />
            }
            {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Company Information</h3>
        <p className="text-gray-600 mt-2">Tell us about your business</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="Enter your company name"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="e.g., CEO, Aircraft Broker, Fleet Manager"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            required
          >
            <option value="">Select country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Type *
        </label>
        <div className="space-y-3">
          {businessTypes.map((type) => (
            <label key={type.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="businessType"
                value={type.value}
                checked={formData.businessType === type.value}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-black border-gray-300 focus:ring-black"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <input
            type="url"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            placeholder="https://yourcompany.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years in Business
          </label>
          <select
            name="yearsInBusiness"
            value={formData.yearsInBusiness}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          >
            <option value="">Select range</option>
            <option value="0-1">Less than 1 year</option>
            <option value="1-5">1-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10-20">10-20 years</option>
            <option value="20+">20+ years</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn Profile
        </label>
        <input
          type="url"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Review & Complete</h3>
        <p className="text-gray-600 mt-2">Review your information and accept our terms</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Registration Summary</h4>
        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>
          <div><span className="font-medium">Email:</span> {formData.email}</div>
          <div><span className="font-medium">Phone:</span> {formData.phone}</div>
          <div><span className="font-medium">Company:</span> {formData.companyName}</div>
          <div><span className="font-medium">Position:</span> {formData.position}</div>
          <div><span className="font-medium">Country:</span> {formData.country}</div>
          <div><span className="font-medium">Business Type:</span> {businessTypes.find(t => t.value === formData.businessType)?.label}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            required
          />
          <div className="text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-black hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-black hover:underline">Privacy Policy</Link>
            {' '}*
          </div>
        </label>
        
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreedToMarketing"
            checked={formData.agreedToMarketing}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
          />
          <div className="text-sm text-gray-700">
            I would like to receive marketing communications and updates about ATP Platform
          </div>
        </label>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Next Steps:</strong>
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Email verification will be sent to your email address</li>
              <li>SMS verification will be required for your phone number</li>
              <li>You can start browsing aircraft immediately</li>
              <li>Document verification will be required for full access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (emailVerificationSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a verification email to <strong>{formData.email}</strong>. 
              Please check your inbox and click the verification link to activate your account.
            </p>
            <div className="space-y-4">
              <Link
                to="/dashboard"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Continue to Dashboard
              </Link>
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Join ATP Platform</h2>
          <p className="mt-2 text-gray-600">Create your professional aviation account</p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex justify-center py-3 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Previous
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !validateStep(4)}
                    className="flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-black hover:underline">
                Sign in here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRegister;
