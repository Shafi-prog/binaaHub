#!/usr/bin/env node

const fs = require('fs');

// Configuration
const VERCEL_BASE_URL = 'https://binaa-hub-shafi-projs-projects.vercel.app';
const LOCAL_BASE_URL = 'http://localhost:3000';
const DOCS_FILE = './PLATFORM_PAGES_DOCUMENTATION.md';

// User pages data
const userPages = [
    { path: '/user/dashboard', name: 'User Dashboard', description: 'Main user dashboard with stats and overview' },
    { path: '/user/dashboard/construction-data', name: 'Construction Data Dashboard', description: 'Construction-specific dashboard data' },
    { path: '/user/profile', name: 'User Profile', description: 'User profile management' },
    { path: '/user/settings', name: 'User Settings', description: 'Account settings and preferences' },
    { path: '/user/balance', name: 'Account Balance', description: 'Account balance and transactions' },
    { path: '/user/cart', name: 'Shopping Cart', description: 'Shopping cart management' },
    { path: '/user/orders', name: 'Order History', description: 'Order history and tracking' },
    { path: '/user/invoices', name: 'Invoice Management', description: 'Invoice management system' },
    { path: '/user/favorites', name: 'Favorite Products', description: 'User favorite products' },
    { path: '/user/warranties', name: 'Product Warranties', description: 'Warranty management' },
    { path: '/user/warranties/new', name: 'Register New Warranty', description: 'Register new product warranty' },
    { path: '/user/warranties/tracking', name: 'Track Warranty Claims', description: 'Track warranty claim status' },
    { path: '/user/documents', name: 'Document Management', description: 'Document storage and management' },
    { path: '/user/expenses', name: 'Expense Tracking', description: 'Personal expense tracking' },
    { path: '/user/subscriptions', name: 'Subscription Management', description: 'Manage subscriptions' },
    { path: '/user/stores-browse', name: 'Browse Stores', description: 'Browse available stores' },
    { path: '/user/social-community', name: 'Social Community Hub', description: 'Community features and social interaction' },
    { path: '/user/smart-insights', name: 'AI-Powered Insights', description: 'AI-driven insights and analytics' },
    { path: '/user/smart-construction-advisor', name: 'Smart Construction Advisor', description: 'AI construction guidance' },
    { path: '/user/gamification', name: 'Gamification & Rewards', description: 'Rewards and gamification system' },
    { path: '/user/ai-assistant', name: 'AI Assistant', description: 'AI assistant features' },
    { path: '/user/ai-hub', name: 'AI Hub', description: 'Central AI tools and services' },
    { path: '/user/building-advice', name: 'Construction Advice', description: 'Construction tips and advice' },
    { path: '/user/chat', name: 'Chat System', description: 'User chat and messaging' },
    { path: '/user/feedback', name: 'User Feedback', description: 'Submit feedback and suggestions' },
    { path: '/user/help-center', name: 'Help & Support', description: 'Help center and documentation' },
    { path: '/user/support', name: 'Technical Support', description: 'Technical support system' },
    
    // Calculators
    { path: '/user/comprehensive-construction-calculator', name: 'Comprehensive Construction Calculator', description: 'Advanced construction cost calculator' },
    { path: '/user/individual-home-calculator', name: 'Individual Home Calculator', description: 'Home construction calculator' },
    { path: '/user/company-bulk-optimizer', name: 'Company Bulk Optimizer', description: 'Bulk order optimization tool' },
    
    // Payment System
    { path: '/user/payment-channels', name: 'Payment Methods', description: 'Payment method management' },
    { path: '/user/payment/success', name: 'Payment Success', description: 'Payment success confirmation' },
    { path: '/user/payment/error', name: 'Payment Error', description: 'Payment error handling' },
    
    // Project Management
    { path: '/user/projects', name: 'Projects Dashboard', description: 'Project management dashboard' },
    { path: '/user/projects/list', name: 'Projects List', description: 'List of all projects' },
    { path: '/user/projects/create', name: 'Project Creation Form', description: 'Create new project' },
    { path: '/user/projects/calculator', name: 'Cost Calculator', description: 'Project cost calculator' },
    { path: '/user/projects/notebook', name: 'Project Notes', description: 'Project notes and documentation' },
    { path: '/user/projects/settings', name: 'Project Settings', description: 'Project configuration settings' },
    { path: '/user/projects/subscription', name: 'Project Subscriptions', description: 'Project subscription management' },
    { path: '/user/projects/suppliers', name: 'Supplier Management', description: 'Supplier relationship management' },
    { path: '/user/projects-marketplace', name: 'Projects Marketplace', description: 'Browse and purchase completed projects' },
    { path: '/user/projects-marketplace/for-sale', name: 'Projects For Sale', description: 'Projects available for purchase' }
];

// Store pages data
const storePages = [
    { path: '/store', name: 'Store Portal Home', description: 'Store management portal home' },
    { path: '/store/dashboard', name: 'Store Dashboard', description: 'Store management dashboard' },
    { path: '/store/admin', name: 'Store Administration', description: 'Store admin panel' },
    { path: '/store/settings', name: 'Store Settings', description: 'Store configuration settings' },
    { path: '/store/analytics', name: 'Store Analytics', description: 'Store analytics and reports' },
    { path: '/store/reports', name: 'Business Reports', description: 'Business intelligence reports' },
    { path: '/store/notifications', name: 'Notification Center', description: 'Store notification management' },
    { path: '/store/permissions', name: 'User Permissions', description: 'User role and permission management' },
    { path: '/store/search', name: 'Search Management', description: 'Store search configuration' },
    { path: '/store/storefront', name: 'Storefront Customization', description: 'Customize store appearance' },
    { path: '/store/suppliers', name: 'Supplier Management', description: 'Supplier relationship management' },
    { path: '/store/warehouses', name: 'Warehouse Management', description: 'Warehouse and inventory locations' },
    { path: '/store/expenses', name: 'Store Expenses', description: 'Store expense tracking' },
    { path: '/store/purchase-orders', name: 'Purchase Orders', description: 'Purchase order management' },
    
    // Product Management
    { path: '/store/construction-products', name: 'Construction Products', description: 'Construction product catalog' },
    { path: '/store/construction-products/new', name: 'Add New Construction Product', description: 'Add new construction product' },
    { path: '/store/products/construction/new', name: 'Alternative Product Creation', description: 'Alternative product creation form' },
    { path: '/store/product-variants', name: 'Product Variants', description: 'Product variant management' },
    { path: '/store/product-bundles', name: 'Product Bundles', description: 'Product bundle management' },
    { path: '/store/product-bundles/create', name: 'Create Bundle', description: 'Create new product bundle' },
    { path: '/store/categories/construction', name: 'Product Categories', description: 'Product category management' },
    { path: '/store/collections', name: 'Product Collections', description: 'Product collection management' },
    
    // Financial Management
    { path: '/store/financial-management', name: 'Financial Overview', description: 'Financial management dashboard' },
    { path: '/store/payments', name: 'Payment Processing', description: 'Payment processing and management' },
    { path: '/store/pricing', name: 'Pricing Management', description: 'Product pricing management' },
    { path: '/store/pricing/create', name: 'Create Pricing Rules', description: 'Create pricing rules and strategies' },
    { path: '/store/currency-region', name: 'Currency & Region Settings', description: 'Currency and regional settings' },
    
    // Customer Management
    { path: '/store/customers', name: 'Customer Database', description: 'Customer management system' },
    { path: '/store/customer-groups', name: 'Customer Groups', description: 'Customer segmentation and groups' },
    { path: '/store/customer-segmentation', name: 'Customer Segmentation', description: 'Advanced customer segmentation' },
    
    // Inventory & Orders
    { path: '/store/inventory', name: 'Inventory Management', description: 'Inventory tracking and management' },
    { path: '/store/orders', name: 'Order Management', description: 'Order processing and fulfillment' },
    { path: '/store/order-management', name: 'Advanced Order Management', description: 'Advanced order management features' },
    
    // Shipping & Delivery
    { path: '/store/shipping', name: 'Shipping Options', description: 'Shipping method configuration' },
    { path: '/store/delivery', name: 'Delivery Management', description: 'Delivery tracking and management' },
    
    // Marketing & Promotions
    { path: '/store/promotions', name: 'Promotions & Discounts', description: 'Promotional campaigns and discounts' },
    { path: '/store/campaigns', name: 'Marketing Campaigns', description: 'Marketing campaign management' },
    { path: '/store/email-campaigns', name: 'Email Marketing', description: 'Email marketing campaigns' },
    
    // Point of Sale
    { path: '/store/pos', name: 'POS System', description: 'Point of sale system' },
    { path: '/store/pos/offline', name: 'Offline POS', description: 'Offline point of sale functionality' },
    { path: '/store/pos/arabic', name: 'Arabic POS', description: 'Arabic language POS interface' },
    { path: '/store/barcode-scanner', name: 'Barcode Scanner', description: 'Barcode scanning functionality' },
    { path: '/store/cash-registers', name: 'Cash Registers', description: 'Cash register management' },
    
    // Marketplace
    { path: '/store/marketplace', name: 'Marketplace Management', description: 'Marketplace integration management' },
    { path: '/store/marketplace-vendors', name: 'Vendor Management', description: 'Marketplace vendor management' },
    
    // Business Tools
    { path: '/store/erp', name: 'ERP Integration', description: 'Enterprise resource planning integration' }
];

// Admin pages data
const adminPages = [
    { path: '/admin/dashboard', name: 'Admin Dashboard', description: 'Platform administration dashboard' },
    { path: '/admin/global', name: 'Global Settings', description: 'Global platform settings' },
    { path: '/admin/construction', name: 'Construction Module Admin', description: 'Construction module administration' },
    { path: '/admin/gcc-markets', name: 'GCC Markets Management', description: 'GCC markets oversight and management' },
    { path: '/admin/ai-analytics', name: 'AI Analytics Dashboard', description: 'AI analytics and insights dashboard' }
];

// Public pages data
const publicPages = [
    { path: '/marketplace', name: 'Public Marketplace', description: 'Public marketplace browsing' },
    { path: '/construction-data', name: 'Public Construction Data', description: 'Public construction data and insights' },
    { path: '/material-prices', name: 'Public Material Prices', description: 'Public material price information' },
    { path: '/forum', name: 'Public Forum', description: 'Community forum and discussions' },
    { path: '/projects', name: 'Public Projects', description: 'Public project showcase' },
    { path: '/supervisors', name: 'Supervisors Directory', description: 'Construction supervisors directory' },
    { path: '/banking', name: 'Banking Services', description: 'Banking and financial services' },
    { path: '/insurance', name: 'Insurance Services', description: 'Insurance services and products' },
    { path: '/loans', name: 'Loan Services', description: 'Loan and financing services' }
];

// Authentication pages data
const authPages = [
    { path: '/auth/login', name: 'Login', description: 'User login page' },
    { path: '/auth/signup', name: 'Signup', description: 'User registration page' },
    { path: '/auth/forgot-password', name: 'Forgot Password', description: 'Password recovery page' },
    { path: '/auth/reset-password-confirm', name: 'Reset Password', description: 'Password reset confirmation' },
    { path: '/login', name: 'Alternative Login', description: 'Alternative login entry point' }
];

function generatePageSection(title, emoji, pages, description = '') {
    let section = `## ${emoji} ${title}\n\n`;
    if (description) {
        section += `${description}\n\n`;
    }
    
    pages.forEach(page => {
        section += `### ${page.name}\n`;
        section += `**Description**: ${page.description}\n\n`;
        section += `- 🏠 **Development**: [localhost:3000${page.path}](${LOCAL_BASE_URL}${page.path})\n`;
        section += `- 🌐 **Production**: [vercel${page.path}](${VERCEL_BASE_URL}${page.path})\n\n`;
    });
    
    section += '---\n\n';
    return section;
}

function createCompleteDocumentation() {
    const header = `# 🏗️ Binna Platform - Pages Documentation

## Overview
This document provides a comprehensive overview of all pages in the Binna platform, organized by functionality and user roles. Each page includes clickable links for both local development and production testing.

## 🌐 Base URLs

### Development Environment 
**Base URL**: \`http://localhost:3000\`

### Production Environment (Vercel)
**Base URL**: \`https://binaa-hub-shafi-projs-projects.vercel.app\`

---

## 🏠 Main Platform Page

### Main Landing Page
**Description**: Comprehensive platform showcase with search, filtering, and feature overview

- 🏠 **Development**: [localhost:3000/](${LOCAL_BASE_URL}/)
- 🌐 **Production**: [vercel/](${VERCEL_BASE_URL}/)

---

`;

    let content = header;
    
    // Add all sections
    content += generatePageSection(
        'Authentication Pages', 
        '🔐', 
        authPages,
        'User authentication and account management pages.'
    );
    
    content += generatePageSection(
        'User Portal Pages', 
        '👤', 
        userPages,
        'Complete user portal with dashboard, projects, AI tools, and personal management features.'
    );
    
    content += generatePageSection(
        'Store Management Pages', 
        '🏪', 
        storePages,
        'Comprehensive e-commerce store management including products, orders, customers, POS, and analytics.'
    );
    
    content += generatePageSection(
        'Admin Portal Pages', 
        '👑', 
        adminPages,
        'Platform administration, analytics, and global settings management.'
    );
    
    content += generatePageSection(
        'Public Access Pages', 
        '🌍', 
        publicPages,
        'Public pages accessible without authentication including marketplace, forums, and information services.'
    );

    // Add summary
    const totalPages = authPages.length + userPages.length + storePages.length + adminPages.length + publicPages.length + 1; // +1 for landing page
    
    content += `## 📊 Platform Summary

- **Total Pages**: ${totalPages} pages
- **Authentication Pages**: ${authPages.length} pages
- **User Portal Pages**: ${userPages.length} pages  
- **Store Management Pages**: ${storePages.length} pages
- **Admin Portal Pages**: ${adminPages.length} pages
- **Public Access Pages**: ${publicPages.length} pages

## 🚀 Testing Instructions

1. **Development Testing**: Use localhost URLs when running \`npm run dev\`
2. **Production Testing**: Use Vercel URLs to test the deployed version
3. **Mobile Testing**: Vercel URLs work perfectly on mobile devices
4. **Team Sharing**: Share Vercel URLs with team members for easy access

---

**Last Updated**: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
**Platform**: Binna - Comprehensive Construction & E-commerce Platform
`;

    return content;
}

// Generate and write the documentation
try {
    const documentation = createCompleteDocumentation();
    fs.writeFileSync(DOCS_FILE, documentation, 'utf8');
    console.log('✅ Documentation reorganized successfully!');
    console.log(`📄 Total pages documented: ${authPages.length + userPages.length + storePages.length + adminPages.length + publicPages.length + 1}`);
    console.log('🏠 Development URLs: http://localhost:3000');
    console.log('🌐 Production URLs: https://binaa-hub-shafi-projs-projects.vercel.app');
} catch (error) {
    console.error('❌ Error creating documentation:', error.message);
    process.exit(1);
}
