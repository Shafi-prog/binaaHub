import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Upload, 
  Eye, 
  Download, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  Star,
  Award,
  AlertTriangle
} from 'lucide-react';

interface VendorApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  businessType: string;
  registrationNumber: string;
  taxNumber: string;
  establishedYear: number;
  employeeCount: string;
  products: string[];
  documents: Document[];
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'additional_info_required';
  submissionDate: string;
  reviewDate?: string;
  reviewNotes?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  complianceScore: number;
}

interface Document {
  id: string;
  name: string;
  type: 'commercial_license' | 'tax_certificate' | 'bank_statement' | 'id_copy' | 'other';
  url: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

interface KYCRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  documentType: string;
  icon: React.ElementType;
}

const VendorOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    businessType: '',
    registrationNumber: '',
    taxNumber: '',
    establishedYear: new Date().getFullYear(),
    employeeCount: '',
    products: [] as string[],
    businessDescription: '',
    website: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      iban: ''
    }
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [kycRequirements, setKycRequirements] = useState<KYCRequirement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'>('draft');

  const steps = [
    { id: 1, title: 'Business Information', icon: Building },
    { id: 2, title: 'Contact Details', icon: User },
    { id: 3, title: 'Legal Documents', icon: FileText },
    { id: 4, title: 'KYC Verification', icon: Shield },
    { id: 5, title: 'Review & Submit', icon: CheckCircle }
  ];

  const businessTypes = [
    'Individual/Sole Proprietorship',
    'Limited Liability Company (LLC)',
    'Corporation',
    'Partnership',
    'Cooperative',
    'Non-Profit Organization'
  ];

  const productCategories = [
    'Electronics',
    'Fashion & Apparel',
    'Home & Garden',
    'Sports & Outdoors',
    'Beauty & Personal Care',
    'Books & Media',
    'Automotive',
    'Health & Wellness',
    'Toys & Games',
    'Food & Beverages',
    'Office Supplies',
    'Industrial Equipment'
  ];

  useEffect(() => {
    initializeKYCRequirements();
  }, []);

  const initializeKYCRequirements = () => {
    const requirements: KYCRequirement[] = [
      {
        id: '1',
        name: 'Commercial License',
        description: 'Valid commercial registration license',
        required: true,
        completed: false,
        documentType: 'commercial_license',
        icon: FileText
      },
      {
        id: '2',
        name: 'Tax Certificate',
        description: 'Tax registration certificate',
        required: true,
        completed: false,
        documentType: 'tax_certificate',
        icon: CreditCard
      },
      {
        id: '3',
        name: 'Bank Statement',
        description: 'Recent bank statement (last 3 months)',
        required: true,
        completed: false,
        documentType: 'bank_statement',
        icon: Building
      },
      {
        id: '4',
        name: 'ID Copy',
        description: 'Copy of business owner\'s national ID',
        required: true,
        completed: false,
        documentType: 'id_copy',
        icon: User
      },
      {
        id: '5',
        name: 'Product Samples',
        description: 'Photos or samples of products to be sold',
        required: false,
        completed: false,
        documentType: 'other',
        icon: Award
      }
    ];
    
    setKycRequirements(requirements);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev[parent as keyof typeof prev] && typeof prev[parent as keyof typeof prev] === "object") ? prev[parent as keyof typeof prev] as object : {}),
        [field]: value
      }
    }));
  };

  const handleProductToggle = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product]
    }));
  };

  const handleFileUpload = (file: File, documentType: string) => {
    // Simulate file upload
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: documentType as any,
      url: URL.createObjectURL(file),
      uploadDate: new Date().toISOString(),
      status: 'pending'
    };
    
    setUploadedDocuments(prev => [...prev, newDocument]);
    
    // Update KYC requirements
    setKycRequirements(prev => prev.map(req => 
      req.documentType === documentType 
        ? { ...req, completed: true }
        : req
    ));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplicationStatus('submitted');
      alert('Application submitted successfully! You will receive an email confirmation shortly.');
      
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
            currentStep >= step.id 
              ? 'bg-orange-500 border-orange-500 text-white' 
              : 'border-gray-300 text-gray-400'
          }`}>
            {currentStep > step.id ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <step.icon className="w-6 h-6" />
            )}
          </div>
          
          <div className="ml-3">
            <p className={`text-sm font-medium ${
              currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
            }`}>
              Step {step.id}
            </p>
            <p className={`text-xs ${
              currentStep >= step.id ? 'text-orange-600' : 'text-gray-500'
            }`}>
              {step.title}
            </p>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${
              currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const BusinessInformationStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Business Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            value={formData.businessType}
            onChange={(e) => handleInputChange('businessType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="">Select Business Type</option>
            {businessTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commercial Registration Number *
          </label>
          <input
            type="text"
            value={formData.registrationNumber}
            onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Registration Number *
          </label>
          <input
            type="text"
            value={formData.taxNumber}
            onChange={(e) => handleInputChange('taxNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Established *
          </label>
          <input
            type="number"
            value={formData.establishedYear}
            onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees
          </label>
          <select
            value={formData.employeeCount}
            onChange={(e) => handleInputChange('employeeCount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Range</option>
            <option value="1-5">1-5 employees</option>
            <option value="6-10">6-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-100">51-100 employees</option>
            <option value="100+">100+ employees</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website URL
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Description *
        </label>
        <textarea
          value={formData.businessDescription}
          onChange={(e) => handleInputChange('businessDescription', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Describe your business, products, and services..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Product Categories *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {productCategories.map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.products.includes(category)}
                onChange={() => handleProductToggle(category)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const ContactDetailsStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person Name *
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Address *
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter complete business address..."
          required
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Social Media (Optional)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              value={formData.socialMedia.facebook}
              onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              value={formData.socialMedia.instagram}
              onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://instagram.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              value={formData.socialMedia.twitter}
              onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://twitter.com/yourpage"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">Bank Account Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              value={formData.bankDetails.accountName}
              onChange={(e) => handleNestedInputChange('bankDetails', 'accountName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number *
            </label>
            <input
              type="text"
              value={formData.bankDetails.accountNumber}
              onChange={(e) => handleNestedInputChange('bankDetails', 'accountNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name *
            </label>
            <input
              type="text"
              value={formData.bankDetails.bankName}
              onChange={(e) => handleNestedInputChange('bankDetails', 'bankName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN *
            </label>
            <input
              type="text"
              value={formData.bankDetails.iban}
              onChange={(e) => handleNestedInputChange('bankDetails', 'iban', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const DocumentsStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Legal Documents</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-2 text-blue-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">Important</span>
        </div>
        <p className="text-sm text-blue-600 mt-1">
          Please upload clear, readable copies of all required documents. All documents must be valid and current.
        </p>
      </div>

      <div className="space-y-4">
        {kycRequirements.map(requirement => (
          <div key={requirement.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${requirement.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                <requirement.icon className={`w-5 h-5 ${requirement.completed ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold">{requirement.name}</h4>
                  {requirement.required && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      Required
                    </span>
                  )}
                  {requirement.completed && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Uploaded
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{requirement.description}</p>
                
                <div className="flex items-center space-x-3">
                  <label className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Document
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(file, requirement.documentType);
                        }
                      }}
                    />
                  </label>
                  
                  {requirement.completed && (
                    <span className="text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Document uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {uploadedDocuments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Uploaded Documents</h4>
          <div className="space-y-2">
            {uploadedDocuments.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                    doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doc.status}
                  </span>
                  
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const KYCStep = () => {
    const completedRequirements = kycRequirements.filter(req => req.completed).length;
    const totalRequirements = kycRequirements.filter(req => req.required).length;
    const completionPercentage = Math.round((completedRequirements / totalRequirements) * 100);

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">KYC Verification</h3>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Know Your Customer (KYC) Verification</h4>
              <p className="text-sm text-blue-600">
                We need to verify your identity and business information to ensure compliance with regulations.
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                Verification Progress
              </span>
              <span className="text-sm font-medium text-blue-900">
                {completedRequirements}/{totalRequirements} Required Documents
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-blue-900">Identity Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-blue-900">Business Registration</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-blue-900">Financial Verification</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-blue-900">Compliance Check</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Verification Requirements</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-yellow-700">
            <li>• All documents must be in Arabic or English</li>
            <li>• Documents must be clear and readable</li>
            <li>• Business license must be valid and current</li>
            <li>• Bank statements must be from the last 3 months</li>
            <li>• ID documents must match the contact person information</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <Award className="w-5 h-5" />
            <span className="font-semibold">After Verification</span>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-green-700">
            <li>• Access to BinnaStore seller dashboard</li>
            <li>• Ability to list and sell products</li>
            <li>• Payment processing and settlements</li>
            <li>• Marketing and promotional tools</li>
            <li>• Customer support and analytics</li>
          </ul>
        </div>
      </div>
    );
  };

  const ReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">Application Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium mb-2">Business Information</h5>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {formData.businessName}</p>
              <p><strong>Type:</strong> {formData.businessType}</p>
              <p><strong>Registration:</strong> {formData.registrationNumber}</p>
              <p><strong>Tax Number:</strong> {formData.taxNumber}</p>
              <p><strong>Established:</strong> {formData.establishedYear}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium mb-2">Contact Information</h5>
            <div className="space-y-1 text-sm">
              <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Address:</strong> {formData.address}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h5 className="font-medium mb-2">Product Categories</h5>
          <div className="flex flex-wrap gap-2">
            {formData.products.map(product => (
              <span key={product} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {product}
              </span>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h5 className="font-medium mb-2">Uploaded Documents</h5>
          <div className="space-y-2">
            {uploadedDocuments.map(doc => (
              <div key={doc.id} className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{doc.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-semibold">What happens next?</span>
        </div>
        <ul className="mt-2 space-y-1 text-sm text-blue-600">
          <li>• Your application will be reviewed within 3-5 business days</li>
          <li>• You'll receive email updates about the status</li>
          <li>• Additional information may be requested if needed</li>
          <li>• Once approved, you'll get access to your seller dashboard</li>
        </ul>
      </div>

      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 text-orange-600 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            I confirm that all the information provided is accurate and complete. I understand that 
            providing false information may result in the rejection of my application or termination 
            of my seller account. I agree to the{' '}
            <a href="#" className="text-orange-600 hover:text-orange-800">Terms of Service</a> and{' '}
            <a href="#" className="text-orange-600 hover:text-orange-800">Privacy Policy</a>.
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become a BinnaStore Seller
            </h1>
            <p className="text-gray-600">
              Join thousands of sellers and grow your business with BinnaStore
            </p>
          </div>

          <StepIndicator />

          <div className="mb-8">
            {currentStep === 1 && <BusinessInformationStep />}
            {currentStep === 2 && <ContactDetailsStep />}
            {currentStep === 3 && <DocumentsStep />}
            {currentStep === 4 && <KYCStep />}
            {currentStep === 5 && <ReviewStep />}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Previous</span>
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                <span>Next</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorOnboarding;
