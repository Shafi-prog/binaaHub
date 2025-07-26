'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/core/shared/utils';
import { 
  Book, 
  ExternalLink, 
  Home, 
  Users, 
  Store, 
  Shield, 
  Globe,
  FileText,
  Search,
  ChevronDown,
  Copy,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

// Base URLs
const LOCAL_BASE_URL = 'http://localhost:3000';
const VERCEL_BASE_URL = 'https://binaa-hub-shafi-projs-projects.vercel.app';

// Page evaluation status type
type PageStatus = 'working' | 'needFix' | 'delete' | 'duplicate' | 'merge' | null;

// Local storage key for evaluations
const EVALUATIONS_STORAGE_KEY = 'platform-pages-evaluations';

// Pages data organized by sections
const pagesSections = {
  auth: {
    title: 'Authentication Pages',
    emoji: '🔐',
    description: 'User authentication and account management pages.',
    pages: [
      { path: '/auth/login', name: 'Login', description: 'User login page' },
      { path: '/auth/signup', name: 'Signup', description: 'User registration page' },
      { path: '/auth/forgot-password', name: 'Forgot Password', description: 'Password recovery page' },
      { path: '/auth/reset-password-confirm', name: 'Reset Password', description: 'Password reset confirmation' },
      { path: '/login', name: 'Alternative Login', description: 'Alternative login entry point' }
    ]
  },
  user: {
    title: 'User Portal Pages',
    emoji: '👤',
    description: 'Complete user portal with dashboard, projects, AI tools, warranties, social features, and comprehensive personal management.',
    pages: [
      { path: '/user/dashboard', name: 'User Dashboard', description: 'Main user dashboard with stats and overview' },
      { path: '/user/dashboard/construction-data', name: 'Construction Data Dashboard', description: 'Construction-specific data dashboard' },
      { path: '/user/profile', name: 'User Profile', description: 'User profile management and settings' },
      { path: '/user/projects', name: 'Projects Dashboard', description: 'Project management dashboard' },
      { path: '/user/projects/new', name: 'Create New Project', description: 'Create new construction project' },
      { path: '/user/projects/list', name: 'Projects List', description: 'List and manage all projects' },
      { path: '/user/projects/calculator', name: 'Project Calculator', description: 'Project cost calculation tools' },
      { path: '/user/projects/notebook', name: 'Project Notebook', description: 'Project notes and documentation' },
      { path: '/user/projects/settings', name: 'Project Settings', description: 'Configure project settings' },
      { path: '/user/projects/suppliers', name: 'Project Suppliers', description: 'Manage project suppliers' },
      { path: '/user/projects/subscription', name: 'Project Subscriptions', description: 'Manage project-related subscriptions' },
      { path: '/user/projects/create', name: 'Project Creation Wizard', description: 'Step-by-step project creation' },
      { path: '/user/comprehensive-construction-calculator', name: 'Construction Calculator', description: 'Advanced construction cost calculator' },
      { path: '/user/individual-home-calculator', name: 'Home Calculator', description: 'Individual home construction calculator' },
      { path: '/user/company-bulk-optimizer', name: 'Company Bulk Optimizer', description: 'Bulk purchase optimization for companies' },
      { path: '/user/ai-hub', name: 'AI Hub', description: 'Central AI tools and services' },
      { path: '/user/ai-assistant', name: 'AI Assistant', description: 'Personal AI construction assistant' },
      { path: '/user/ai-smart-features-test', name: 'AI Smart Features Test', description: 'Test AI-powered smart features' },
      { path: '/user/smart-construction-advisor', name: 'Smart Construction Advisor', description: 'AI-powered construction advice' },
      { path: '/user/smart-insights', name: 'Smart Insights', description: 'AI-driven project insights and analytics' },
      { path: '/user/projects-marketplace', name: 'Projects Marketplace', description: 'Browse and purchase completed projects' },
      { path: '/user/projects-marketplace/for-sale', name: 'Projects For Sale', description: 'Projects available for purchase' },
      { path: '/user/building-advice', name: 'Construction Advice', description: 'Construction tips and professional advice' },
      { path: '/user/expenses', name: 'Expense Tracking', description: 'Personal expense tracking and management' },
      { path: '/user/warranty-expense-tracking', name: 'Warranty & Expense Tracking', description: 'Combined warranty and expense management' },
      { path: '/user/warranties', name: 'Warranty Management', description: 'Product warranty tracking and claims' },
      { path: '/user/warranties/new', name: 'Add New Warranty', description: 'Register new product warranty' },
      { path: '/user/warranties/tracking', name: 'Warranty Tracking', description: 'Track warranty status and claims' },
      { path: '/user/warranties/ai-extract', name: 'AI Warranty Extraction', description: 'AI-powered warranty information extraction' },
      { path: '/user/orders', name: 'Order History', description: 'Order history and tracking' },
      { path: '/user/cart', name: 'Shopping Cart', description: 'Shopping cart management' },
      { path: '/user/favorites', name: 'Favorites', description: 'Saved items and favorites' },
      { path: '/user/balance', name: 'Account Balance', description: 'Account balance and transactions' },
      { path: '/user/payment-channels', name: 'Payment Methods', description: 'Manage payment methods and channels' },
      { path: '/user/payment/success', name: 'Payment Success', description: 'Payment success confirmation page' },
      { path: '/user/payment/error', name: 'Payment Error', description: 'Payment error handling page' },
      { path: '/user/invoices', name: 'Invoices', description: 'Invoice management and history' },
      { path: '/user/subscriptions', name: 'Subscriptions', description: 'Manage active subscriptions' },
      { path: '/user/social-community', name: 'Social Community', description: 'Community features and social interactions' },
      { path: '/user/chat', name: 'Chat & Messaging', description: 'Real-time chat and messaging' },
      { path: '/user/gamification', name: 'Gamification', description: 'Achievements, points, and gamification features' },
      { path: '/user/stores-browse', name: 'Browse Stores', description: 'Browse and discover stores' },
      { path: '/user/support', name: 'Customer Support', description: 'Help and customer support' },
      { path: '/user/help-center', name: 'Help Center', description: 'Self-service help and documentation' },
      { path: '/user/feedback', name: 'Feedback', description: 'Submit feedback and suggestions' },
      { path: '/user/settings', name: 'User Settings', description: 'Account settings and preferences' },
      { path: '/user/documents', name: 'Documents', description: 'Personal document management' }
    ]
  },
  store: {
    title: 'Store Management Pages',
    emoji: '🏪',
    description: '🎉 ENHANCED: Comprehensive e-commerce store management with IDURAR-style enhanced sidebar, blue gradient header, professional navigation across products, orders, customers, POS, inventory, analytics, and business operations.',
    pages: [
      { path: '/store/dashboard', name: '✅ Store Dashboard', description: '✅ ENHANCED SIDEBAR: Store management dashboard with key metrics and professional navigation' },
      { path: '/store/pos', name: '✅ POS System', description: '✅ ENHANCED SIDEBAR: Point of sale system with enhanced store layout' },
      { path: '/store/pos/arabic', name: 'Arabic POS', description: 'Arabic language POS system' },
      { path: '/store/pos/offline', name: 'Offline POS', description: 'Offline-capable POS system' },
      { path: '/store/construction-products', name: 'Construction Products', description: 'Construction product catalog and management' },
      { path: '/store/construction-products/new', name: 'Add Construction Product', description: 'Add new construction products' },
      { path: '/store/products', name: '✅ Products Management', description: '✅ ENHANCED SIDEBAR: Product catalog with enhanced store navigation' },
      { path: '/store/products/construction/new', name: 'New Construction Product', description: 'Create new construction product listing' },
      { path: '/store/orders', name: '✅ Order Management', description: '✅ ENHANCED SIDEBAR: Order processing with professional store layout' },
      { path: '/store/order-management', name: 'Advanced Order Management', description: 'Advanced order processing and management' },
      { path: '/store/customers', name: '✅ Customer Database', description: '✅ ENHANCED SIDEBAR: Customer management with enhanced navigation' },
      { path: '/store/customer-segmentation', name: 'Customer Segmentation', description: 'Customer segmentation and targeting' },
      { path: '/store/customer-groups', name: 'Customer Groups', description: 'Manage customer groups and categories' },
      { path: '/store/inventory', name: '✅ Inventory Management', description: '✅ ENHANCED SIDEBAR: Inventory tracking with professional store layout' },
      { path: '/store/analytics', name: 'Store Analytics', description: 'Store analytics, reports, and performance metrics' },
      { path: '/store/reports', name: 'Reports', description: 'Detailed business reports and analytics' },
      { path: '/store/financial-management', name: 'Financial Management', description: 'Financial overview, revenue, and expense tracking' },
      { path: '/store/expenses', name: '✅ Expense Management', description: '✅ ENHANCED SIDEBAR: Store expense tracking with enhanced layout' },
      { path: '/store/payments', name: '✅ Payment Management', description: '✅ ENHANCED SIDEBAR: Payment processing with professional navigation' },
      { path: '/store/promotions', name: 'Promotions & Discounts', description: 'Promotional campaigns, discounts, and offers' },
      { path: '/store/campaigns', name: 'Marketing Campaigns', description: 'Marketing campaign management' },
      { path: '/store/email-campaigns', name: 'Email Campaigns', description: 'Email marketing and campaigns' },
      { path: '/store/suppliers', name: 'Supplier Management', description: 'Supplier relationship and procurement management' },
      { path: '/store/purchase-orders', name: '✅ Purchase Orders', description: '✅ ENHANCED SIDEBAR: Purchase order management with enhanced store layout' },
      { path: '/store/warehouses', name: 'Warehouse Management', description: 'Warehouse operations and management' },
      { path: '/store/delivery', name: 'Delivery Management', description: 'Delivery and logistics management' },
      { path: '/store/shipping', name: '✅ Shipping Management', description: '✅ ENHANCED SIDEBAR: Shipping options with professional navigation' },
      { path: '/store/collections', name: 'Product Collections', description: 'Product collections and categorization' },
      { path: '/store/categories/construction', name: 'Construction Categories', description: 'Construction product categories' },
      { path: '/store/product-bundles', name: 'Product Bundles', description: 'Product bundling and package deals' },
      { path: '/store/product-bundles/create', name: 'Create Product Bundle', description: 'Create new product bundles' },
      { path: '/store/product-variants', name: 'Product Variants', description: 'Product variants and options management' },
      { path: '/store/pricing', name: 'Pricing Management', description: 'Price management and strategies' },
      { path: '/store/pricing/create', name: 'Create Pricing Rule', description: 'Create new pricing rules' },
      { path: '/store/marketplace', name: '✅ Marketplace Integration', description: '✅ ENHANCED SIDEBAR: Marketplace listings with enhanced layout' },
      { path: '/store/marketplace-vendors', name: 'Marketplace Vendors', description: 'Vendor management for marketplace' },
      { path: '/store/storefront', name: 'Storefront Customization', description: 'Customize store appearance and layout' },
      { path: '/store/warranty-management', name: '✅ Warranty Management', description: '✅ ENHANCED SIDEBAR: Product warranty tracking with professional navigation' },
      { path: '/store/cash-registers', name: '✅ Cash Registers', description: '✅ ENHANCED SIDEBAR: Cash register management with enhanced store layout' },
      { path: '/store/barcode-scanner', name: 'Barcode Scanner', description: 'Barcode scanning functionality' },
      { path: '/store/currency-region', name: 'Currency & Region', description: 'Multi-currency and regional settings' },
      { path: '/store/erp', name: '✅ ERP Integration', description: '✅ ENHANCED SIDEBAR: Enterprise resource planning with enhanced navigation' },
      { path: '/store/admin', name: 'Store Admin', description: 'Store administration and management tools' },
      { path: '/store/permissions', name: 'User Permissions', description: 'Staff permissions and role management' },
      { path: '/store/notifications', name: 'Notifications', description: 'Store notification management' },
      { path: '/store/search', name: 'Product Search', description: 'Product search and discovery features' },
      { path: '/store/settings', name: 'Store Settings', description: 'Store configuration and preferences' }
    ]
  },
  admin: {
    title: 'Admin Portal Pages',
    emoji: '👑',
    description: 'Complete platform administration with analytics, store management, financial oversight, and system settings.',
    pages: [
      { path: '/admin/dashboard', name: 'Admin Dashboard', description: 'Platform administration dashboard with comprehensive overview' },
      { path: '/admin/analytics', name: 'Platform Analytics', description: 'Comprehensive platform analytics and performance metrics' },
      { path: '/admin/stores', name: 'Store Management', description: 'Manage and monitor all stores on the platform' },
      { path: '/admin/finance', name: 'Finance & Commissions', description: 'Financial management and commission tracking' },
      { path: '/admin/construction', name: 'Construction Ecosystem', description: 'Advanced construction module administration' },
      { path: '/admin/gcc-markets', name: 'GCC Markets Management', description: 'Gulf Cooperation Council markets oversight' },
      { path: '/admin/ai-analytics', name: 'AI Analytics Dashboard', description: 'AI-powered analytics and insights' },
      { path: '/admin/settings', name: 'System Settings', description: 'Platform-wide settings and configuration' },
      { path: '/admin/global', name: 'Global Settings', description: 'Global platform settings and configurations' }
    ]
  },
  public: {
    title: 'Public Access Pages',
    emoji: '🌍',
    description: 'Public pages accessible without authentication including marketplace, forums, information services, and financial services.',
    pages: [
      { path: '/marketplace', name: 'Public Marketplace', description: 'Public marketplace browsing and product discovery' },
      { path: '/construction-data', name: 'Public Construction Data', description: 'Public construction data and insights' },
      { path: '/material-prices', name: 'Public Material Prices', description: 'Public material price information and trends' },
      { path: '/forum', name: 'Public Forum', description: 'Community forum and discussions' },
      { path: '/projects', name: 'Public Projects', description: 'Public project showcase and inspiration' },
      { path: '/supervisors', name: 'Supervisors Directory', description: 'Find and connect with construction supervisors' },
      { path: '/banking', name: 'Banking Services', description: 'Banking and financial services integration' },
      { path: '/insurance', name: 'Insurance Services', description: 'Insurance services and products for construction' },
      { path: '/loans', name: 'Loan Services', description: 'Construction loan and financing services' }
    ]
  },
  constructionServices: {
    title: 'Construction Services Platform',
    emoji: '🏗️',
    description: '🆕 NEW: Comprehensive construction service ecosystem with equipment rental, waste management, concrete supply, unified booking, AI assistant, and specialized provider dashboards.',
    pages: [
      { path: '/dashboard/bookings', name: '🆕 Unified Booking Calendar', description: 'NEW: Multi-service booking calendar for all construction services' },
      { path: '/ai-assistant', name: '🆕 AI Construction Assistant', description: 'NEW: Intelligent construction advisory system with recommendations' },
      { path: '/register/service-provider', name: '🆕 Service Provider Registration', description: 'NEW: Multi-role registration portal for construction service providers' },
      { path: '/dashboard/equipment-rental', name: '🆕 Equipment Rental Dashboard', description: 'NEW: Equipment rental company dashboard with booking management' },
      { path: '/dashboard/waste-management', name: '🆕 Waste Management Dashboard', description: 'NEW: Waste management company dashboard with collection scheduling' },
      { path: '/dashboard/concrete-supplier', name: '🆕 Concrete Supplier Dashboard', description: 'NEW: Concrete supplier dashboard with order and delivery management' },
      { path: '/dashboard/service-provider', name: '🆕 General Service Provider Dashboard', description: 'NEW: Multi-purpose service provider dashboard' }
    ]
  },
  utility: {
    title: 'Utility & Development Pages',
    emoji: '🔧',
    description: 'Development utilities, testing pages, and specialized tools for platform management.',
    pages: [
      { path: '/platform-pages', name: 'Platform Pages Directory', description: 'This comprehensive page directory and navigation hub' },
      { path: '/test-button', name: 'Test Button', description: 'UI component testing and button functionality tests' }
    ]
  }
};

interface PageData {
  path: string;
  name: string;
  description: string;
}

interface PageLinkProps extends PageData {
  evaluations: Record<string, PageStatus>;
  updateEvaluation: (pagePath: string, status: PageStatus) => void;
}

function PageLink({ path, name, description, evaluations, updateEvaluation }: PageLinkProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (url: string, type: 'local' | 'vercel') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(`${path}-${type}`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback method for older browsers or when clipboard access is denied
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(`${path}-${type}`);
        setTimeout(() => setCopied(null), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case 'working':
        return 'border-green-300 bg-green-50';
      case 'needFix':
        return 'border-yellow-300 bg-yellow-50';
      case 'delete':
        return 'border-red-300 bg-red-50';
      case 'duplicate':
        return 'border-orange-300 bg-orange-50';
      case 'merge':
        return 'border-purple-300 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const localUrl = `${LOCAL_BASE_URL}${path}`;
  const vercelUrl = `${VERCEL_BASE_URL}${path}`;
  const currentStatus = evaluations[path];

  return (
    <div className={`rounded-lg p-4 border hover:border-blue-300 transition-colors ${getStatusColor(currentStatus)}`}>
      {/* Header with name and current status */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-800 flex-1">{name}</h4>
        {currentStatus && (
          <div className="ml-2">
            {currentStatus === 'working' && <Check className="w-4 h-4 text-green-600" />}
            {currentStatus === 'needFix' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
            {currentStatus === 'delete' && <Trash2 className="w-4 h-4 text-red-600" />}
            {currentStatus === 'duplicate' && <Copy className="w-4 h-4 text-orange-600" />}
            {currentStatus === 'merge' && <FileText className="w-4 h-4 text-purple-600" />}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3">{description}</p>
      
      {/* Evaluation Options */}
      <div className="mb-4 p-3 bg-white rounded border">
        <p className="text-xs font-medium text-gray-700 mb-2">تقييم الصفحة:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateEvaluation(path, currentStatus === 'working' ? null : 'working')}
            className="flex items-center gap-2 text-sm hover:bg-green-50 p-1 rounded"
            title="Mark as Working"
          >
            {currentStatus === 'working' ? 
              <CheckSquare className="w-4 h-4 text-green-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-green-700">يعمل</span>
          </button>
          
          <button
            onClick={() => updateEvaluation(path, currentStatus === 'needFix' ? null : 'needFix')}
            className="flex items-center gap-2 text-sm hover:bg-yellow-50 p-1 rounded"
            title="Mark as Need Fix"
          >
            {currentStatus === 'needFix' ? 
              <CheckSquare className="w-4 h-4 text-yellow-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-yellow-700">يحتاج إصلاح</span>
          </button>
          
          <button
            onClick={() => updateEvaluation(path, currentStatus === 'delete' ? null : 'delete')}
            className="flex items-center gap-2 text-sm hover:bg-red-50 p-1 rounded"
            title="Mark for Deletion"
          >
            {currentStatus === 'delete' ? 
              <CheckSquare className="w-4 h-4 text-red-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-red-700">حذف</span>
          </button>

          <button
            onClick={() => updateEvaluation(path, currentStatus === 'duplicate' ? null : 'duplicate')}
            className="flex items-center gap-2 text-sm hover:bg-orange-50 p-1 rounded"
            title="Mark as Duplicate"
          >
            {currentStatus === 'duplicate' ? 
              <CheckSquare className="w-4 h-4 text-orange-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-orange-700">مكرر</span>
          </button>

          <button
            onClick={() => updateEvaluation(path, currentStatus === 'merge' ? null : 'merge')}
            className="flex items-center gap-2 text-sm hover:bg-purple-50 p-1 rounded"
            title="Mark for Merge"
          >
            {currentStatus === 'merge' ? 
              <CheckSquare className="w-4 h-4 text-purple-600" /> : 
              <Square className="w-4 h-4 text-gray-400" />
            }
            <span className="text-purple-700">دمج</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {/* Local Development Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-600" />
            <Link 
              href={localUrl}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              localhost:3000{path}
            </Link>
          </div>
          <button
            onClick={() => copyToClipboard(localUrl, 'local')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Copy localhost URL"
          >
            {copied === `${path}-local` ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Vercel Production Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            <Link 
              href={vercelUrl}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel{path}
            </Link>
          </div>
          <button
            onClick={() => copyToClipboard(vercelUrl, 'vercel')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Copy Vercel URL"
          >
            {copied === `${path}-vercel` ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  emoji: string;
  description: string;
  pages: PageData[];
  defaultExpanded?: boolean;
  evaluations: Record<string, PageStatus>;
  updateEvaluation: (pagePath: string, status: PageStatus) => void;
}

function Section({ title, emoji, description, pages, defaultExpanded = false, evaluations, updateEvaluation }: SectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    console.log(`Toggling section: ${title}, current state: ${isExpanded}`);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
              <p className="text-xs text-blue-600 mt-1">{pages.length} pages</p>
            </div>
          </div>
          <ChevronDown 
            className={cn("w-5 h-5 text-gray-400 transition-transform duration-200", 
              isExpanded && "rotate-180"
            )} 
          />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <PageLink 
                key={page.path} 
                {...page} 
                evaluations={evaluations}
                updateEvaluation={updateEvaluation}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PagesDocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [evaluations, setEvaluations] = useState<Record<string, PageStatus>>({});

  // Load evaluations from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(EVALUATIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEvaluations(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved evaluations:', error);
      // Clear corrupted data
      localStorage.removeItem(EVALUATIONS_STORAGE_KEY);
    }
  }, []);

  // Get all page paths for statistics
  const allPagePaths = Object.values(pagesSections).flatMap(section => 
    section.pages.map(page => page.path)
  );

  // Calculate statistics
  const stats = {
    total: allPagePaths.length,
    working: allPagePaths.filter(path => evaluations[path] === 'working').length,
    needFix: allPagePaths.filter(path => evaluations[path] === 'needFix').length,
    delete: allPagePaths.filter(path => evaluations[path] === 'delete').length,
    duplicate: allPagePaths.filter(path => evaluations[path] === 'duplicate').length,
    merge: allPagePaths.filter(path => evaluations[path] === 'merge').length,
    notEvaluated: allPagePaths.filter(path => !evaluations[path]).length
  };

  // Update evaluation function
  const updateEvaluation = (pagePath: string, status: PageStatus) => {
    try {
      const newEvaluations = { ...evaluations, [pagePath]: status };
      setEvaluations(newEvaluations);
      localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(newEvaluations));
    } catch (error) {
      console.error('Failed to save evaluation to localStorage:', error);
      // Still update the state even if localStorage fails
      setEvaluations({ ...evaluations, [pagePath]: status });
    }
  };

  // Export evaluations to JSON file
  const exportEvaluations = () => {
    try {
      const dataStr = JSON.stringify(evaluations, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `platform-pages-evaluations-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (error) {
      console.error('Failed to export evaluations:', error);
      alert('خطأ في تصدير الملف');
    }
  };

  // Import evaluations from JSON file
  const importEvaluations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (!result) {
            throw new Error('فشل في قراءة الملف');
          }
          const imported = JSON.parse(result);
          setEvaluations(imported);
          localStorage.setItem(EVALUATIONS_STORAGE_KEY, JSON.stringify(imported));
        } catch (error) {
          console.error('Import error:', error);
          alert('خطأ في استيراد الملف. تأكد من أن الملف بصيغة JSON صحيحة.');
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        alert('خطأ في قراءة الملف');
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  // Calculate total pages
  const totalPages = Object.values(pagesSections).reduce((total, section) => total + section.pages.length, 0) + 1; // +1 for landing page

  // Filter pages based on search query
  const filteredSections = Object.entries(pagesSections).reduce((acc, [key, section]) => {
    if (selectedSection !== 'all' && selectedSection !== key) {
      return acc;
    }

    const filteredPages = section.pages.filter(page => 
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredPages.length > 0) {
      acc[key] = { ...section, pages: filteredPages };
    }

    return acc;
  }, {} as typeof pagesSections);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pages Documentation</h1>
                <p className="text-gray-600">Navigate all {totalPages} pages in the Binna platform</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recent Enhancement Summary */}
        <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl shadow-lg p-6 mb-8 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">🎉 Recent Store Enhancement Completed</h2>
              <p className="text-gray-600">Enhanced IDURAR-style sidebar successfully deployed across all store pages</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Check className="w-4 h-4" />
                ✅ Enhanced Features Implemented
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• 🎨 Blue gradient header with "متجر بنا" branding</li>
                <li>• 📊 Professional IDURAR-style navigation</li>
                <li>• 📱 Mobile responsive sidebar with smooth transitions</li>
                <li>• 👤 User profile section with account details</li>
                <li>• 🔄 Dynamic page titles and breadcrumbs</li>
                <li>• 🌐 Arabic RTL support with proper positioning</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                📄 Pages Updated (15 total)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• ✅ Cash Registers, Purchase Orders, Expenses</li>
                <li>• ✅ Products, Inventory, POS System</li>
                <li>• ✅ Payments, Shipping, ERP Integration</li>
                <li>• ✅ Marketplace, Warranty Management</li>
                <li>• ✅ Product Bundles, Collections Creation</li>
                <li>• 🚫 Old basic sidebar completely removed</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>📝 Note:</strong> All store pages marked with ✅ now feature the enhanced sidebar. 
              Old "الرئيسية، تصفح المنتجات، السلة، المفضلة" sidebar has been replaced with professional store navigation.
            </p>
          </div>
        </div>

        {/* Evaluation Statistics Dashboard */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">📊 تقييم الصفحات</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={exportEvaluations}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                تصدير التقييمات
              </button>
              <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                استيراد التقييمات
                <input
                  type="file"
                  accept=".json"
                  onChange={importEvaluations}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-700">{stats.total}</div>
              <div className="text-sm text-gray-600">إجمالي الصفحات</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.working}</div>
              <div className="text-sm text-green-600">تعمل بشكل صحيح</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{stats.needFix}</div>
              <div className="text-sm text-yellow-600">تحتاج إصلاح</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-700">{stats.delete}</div>
              <div className="text-sm text-red-600">للحذف</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">{stats.duplicate}</div>
              <div className="text-sm text-orange-600">مكرر</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{stats.merge}</div>
              <div className="text-sm text-purple-600">للدمج</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{stats.notEvaluated}</div>
              <div className="text-sm text-blue-600">غير مقيمة</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>التقدم في التقييم</span>
              <span>{Math.round(((stats.total - stats.notEvaluated) / stats.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((stats.total - stats.notEvaluated) / stats.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/* Base URLs Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🌐 Base URLs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Development Environment</h3>
              </div>
              <code className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                http://localhost:3000
              </code>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Production Environment (Vercel)</h3>
              </div>
              <code className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded break-all">
                https://binaa-hub-shafi-projs-projects.vercel.app
              </code>
            </div>
          </div>
        </div>

        {/* Main Landing Page */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏠 Main Platform Page</h2>
          <PageLink 
            path="/"
            name="Main Landing Page"
            description="Comprehensive platform showcase with search, filtering, and feature overview"
            evaluations={evaluations}
            updateEvaluation={updateEvaluation}
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search pages by name, description, or path..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sections</option>
              <option value="auth">🔐 Authentication</option>
              <option value="user">👤 User Portal</option>
              <option value="store">🏪 Store Management</option>
              <option value="admin">👑 Admin Portal</option>
              <option value="public">🌍 Public Access</option>
              <option value="utility">🔧 Utility & Development</option>
            </select>
          </div>
        </div>

        {/* Page Sections */}
        <div className="space-y-6">
          {Object.entries(filteredSections).map(([key, section]) => (
            <Section
              key={key}
              title={section.title}
              emoji={section.emoji}
              description={section.description}
              pages={section.pages}
              defaultExpanded={true}
              evaluations={evaluations}
              updateEvaluation={updateEvaluation}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Platform Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{pagesSections.auth.pages.length}</div>
              <div className="text-sm text-gray-600">Auth Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{pagesSections.user.pages.length}</div>
              <div className="text-sm text-gray-600">User Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pagesSections.store.pages.length}</div>
              <div className="text-sm text-gray-600">Store Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{pagesSections.admin.pages.length}</div>
              <div className="text-sm text-gray-600">Admin Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600">{pagesSections.public.pages.length}</div>
              <div className="text-sm text-gray-600">Public Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{pagesSections.utility.pages.length}</div>
              <div className="text-sm text-gray-600">Utility Pages</div>
            </div>
          </div>
        </div>

        {/* Testing Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-8 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Testing Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Development Testing</h3>
              <p className="text-sm text-gray-600">Use localhost URLs when running <code className="bg-gray-200 px-1 rounded">npm run dev</code></p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Production Testing</h3>
              <p className="text-sm text-gray-600">Use Vercel URLs to test the deployed version</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Mobile Testing</h3>
              <p className="text-sm text-gray-600">Vercel URLs work perfectly on mobile devices</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Team Sharing</h3>
              <p className="text-sm text-gray-600">Share Vercel URLs with team members for easy access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="mt-1">Binna - Comprehensive Construction & E-commerce Platform</p>
        </div>
      </div>
    </div>
  );
}
