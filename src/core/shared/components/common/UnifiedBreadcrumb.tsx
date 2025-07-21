/**
 * Unified Breadcrumb Component
 * Consolidates 50+ breadcrumb implementations across store pages
 * Supports all ERP systems and dynamic path generation
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

export interface UnifiedBreadcrumbProps {
  items?: BreadcrumbItem[];
  autoGenerate?: boolean;
  homeLabel?: string;
  homeHref?: string;
  separator?: React.ReactNode;
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

// Auto-generate breadcrumbs from pathname
const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Build breadcrumbs from URL segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format segment for display
    const label = formatSegmentLabel(segment);
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isActive: isLast
    });
  });

  return breadcrumbs;
};

// Format URL segment to readable label
const formatSegmentLabel = (segment: string): string => {
  // Handle common store page patterns
  const labelMap: Record<string, string> = {
    'store': 'Store',
    'api-key-management': 'API Key Management',
    'product-tags': 'Product Tags',
    'product-types': 'Product Types',
    'product-variants': 'Product Variants',
    'customer-groups': 'Customer Groups',
    'sales-channels': 'Sales Channels',
    'tax-regions': 'Tax Regions',
    'shipping-profiles': 'Shipping Profiles',
    'return-reasons': 'Return Reasons',
    'workflow-executions': 'Workflow Executions',
    'store-admin': 'Store Admin',
    'price-lists': 'Price Lists',
    'construction-products': 'Construction Products',
    'marketplace-vendors': 'Marketplace Vendors',
    'product-bundles': 'Product Bundles',
    'cash-registers': 'Cash Registers',
    'barcode-scanner': 'Barcode Scanner',
    'email-campaigns': 'Email Campaigns',
    'financial-management': 'Financial Management',
    'order-management': 'Order Management',
    'purchase-orders': 'Purchase Orders',
    'reset-password': 'Reset Password',
    'erp': 'ERP Integration',
    'pos': 'Point of Sale'
  };

  if (labelMap[segment]) {
    return labelMap[segment];
  }

  // Handle dynamic IDs (UUIDs, etc.)
  if (segment.match(/^[a-f0-9-]{8,}$/i)) {
    return 'Details';
  }

  // Handle action pages
  if (['create', 'edit', 'detail', 'list', 'new'].includes(segment)) {
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  // Default formatting: replace hyphens/underscores with spaces and capitalize
  return segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const UnifiedBreadcrumb: React.FC<UnifiedBreadcrumbProps> = ({
  items,
  autoGenerate = true,
  homeLabel = 'Dashboard',
  homeHref = '/store',
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
  className = '',
  showHome = true,
  maxItems = 5
}) => {
  const pathname = usePathname();

  // Use provided items or auto-generate from pathname
  let breadcrumbItems = items || [];
  if (autoGenerate && (!items || items.length === 0) && pathname) {
    breadcrumbItems = generateBreadcrumbsFromPath(pathname);
  }

  // Add home item if requested
  if (showHome && breadcrumbItems.length > 0) {
    breadcrumbItems = [
      { 
        label: homeLabel, 
        href: homeHref, 
        icon: <Home className="w-4 h-4" /> 
      },
      ...breadcrumbItems
    ];
  }

  // Limit items if maxItems specified
  if (maxItems && breadcrumbItems.length > maxItems) {
    const start = breadcrumbItems.slice(0, 1); // Keep home
    const end = breadcrumbItems.slice(-maxItems + 2); // Keep last items
    breadcrumbItems = [
      ...start,
      { label: '...', isActive: false },
      ...end
    ];
  }

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 flex-shrink-0">
                {separator}
              </span>
            )}
            
            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="hover:underline">{item.label}</span>
              </Link>
            ) : (
              <span 
                className={`flex items-center space-x-1 ${
                  item.isActive 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500'
                }`}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Convenience hook for common breadcrumb patterns
export const useBreadcrumbsForStorePage = (
  pageType: 'list' | 'detail' | 'edit' | 'create',
  entityName: string,
  entityId?: string
): BreadcrumbItem[] => {
  const pathname = usePathname();
  
  const items: BreadcrumbItem[] = [];
  
  // Add entity list page
  items.push({
    label: entityName,
    href: `/store/${entityName.toLowerCase().replace(/\s+/g, '-')}`
  });

  // Add specific page based on type
  switch (pageType) {
    case 'detail':
      if (entityId) {
        items.push({
          label: 'Details',
          isActive: true
        });
      }
      break;
    
    case 'edit':
      if (entityId) {
        items.push({
          label: 'Details',
          href: `/store/${entityName.toLowerCase().replace(/\s+/g, '-')}/${entityId}`
        });
        items.push({
          label: 'Edit',
          isActive: true
        });
      }
      break;
    
    case 'create':
      items.push({
        label: 'Create New',
        isActive: true
      });
      break;
    
    case 'list':
    default:
      // For list pages, mark the entity name as active
      items[items.length - 1].isActive = true;
      break;
  }

  return items;
};

// Specialized breadcrumb components for common patterns
export const ProductBreadcrumb: React.FC<{
  productId?: string;
  pageType?: 'list' | 'detail' | 'edit' | 'create';
  variant?: 'tags' | 'types' | 'variants' | 'bundles';
}> = ({ productId, pageType = 'list', variant }) => {
  const entityName = variant ? `Product ${variant.charAt(0).toUpperCase() + variant.slice(1)}` : 'Products';
  const items = useBreadcrumbsForStorePage(pageType, entityName, productId);
  
  return <UnifiedBreadcrumb items={items} />;
};

export const UserBreadcrumb: React.FC<{
  userId?: string;
  pageType?: 'list' | 'detail' | 'edit' | 'create';
  userType?: 'users' | 'customers' | 'admins';
}> = ({ userId, pageType = 'list', userType = 'users' }) => {
  const entityName = userType.charAt(0).toUpperCase() + userType.slice(1);
  const items = useBreadcrumbsForStorePage(pageType, entityName, userId);
  
  return <UnifiedBreadcrumb items={items} />;
};

export const OrderBreadcrumb: React.FC<{
  orderId?: string;
  pageType?: 'list' | 'detail' | 'edit' | 'create';
}> = ({ orderId, pageType = 'list' }) => {
  const items = useBreadcrumbsForStorePage(pageType, 'Orders', orderId);
  
  return <UnifiedBreadcrumb items={items} />;
};

export const TaxBreadcrumb: React.FC<{
  regionId?: string;
  pageType?: 'list' | 'detail' | 'edit' | 'create';
  subType?: 'regions' | 'rates' | 'provinces' | 'overrides';
}> = ({ regionId, pageType = 'list', subType = 'regions' }) => {
  const entityName = `Tax ${subType.charAt(0).toUpperCase() + subType.slice(1)}`;
  const items = useBreadcrumbsForStorePage(pageType, entityName, regionId);
  
  return <UnifiedBreadcrumb items={items} />;
};

export default UnifiedBreadcrumb;
