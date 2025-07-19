# 🏗️ Binna Platform - Pages Documentation

## Overview
This document provides a comprehensive overview of all pages in the Binna platform, organized by functionality and user roles.

## 📁 Platform Structure Tree

```
src/app/
├── 🏠 page.tsx                           # Main Landing Page (Comprehensive Platform Showcase)
├── 🌐 globals.css                        # Global Styles
├── 📋 layout.tsx                         # Main Layout Component
├── 📋 layout-simple.tsx                  # Simple Layout Component
├── ❌ not-found.tsx                      # 404 Error Page
├── 📱 offline/page.tsx                   # Offline Page
├── 🧪 browser-test/page.tsx              # Browser Testing Page
├── 🐛 debug-auth/page.tsx                # Authentication Debug Page
├── 🧹 clear-auth/page.tsx                # Clear Authentication Page
│
├── 🔐 Authentication Pages
│   ├── auth/
│   │   ├── page.tsx                      # Auth Router (Role-based Redirect)
│   │   ├── login/page.tsx                # Login Page
│   │   ├── signup/page.tsx               # User Registration
│   │   ├── forgot-password/page.tsx      # Password Recovery
│   │   └── reset-password-confirm/page.tsx # Password Reset Confirmation
│   └── login/page.tsx                    # Alternative Login Entry
│
├── 👤 User Portal
│   └── user/
│       ├── page.tsx                      # User Portal Home
│       ├── dashboard/
│       │   ├── page.tsx                  # User Dashboard
│       │   └── construction-data/page.tsx # Construction Data Dashboard
│       ├── profile/page.tsx              # User Profile Management
│       ├── settings/page.tsx             # User Settings
│       ├── balance/page.tsx              # Account Balance
│       ├── cart/page.tsx                 # Shopping Cart
│       ├── orders/page.tsx               # Order History
│       ├── invoices/page.tsx             # Invoice Management
│       ├── favorites/page.tsx            # Favorite Products
│       ├── warranties/page.tsx           # Product Warranties
│       ├── documents/page.tsx            # Document Management
│       ├── expenses/page.tsx             # Expense Tracking
│       ├── subscriptions/page.tsx        # Subscription Management
│       ├── stores-browse/page.tsx        # Browse Stores
│       ├── social-community/page.tsx     # Social Community Hub
│       ├── smart-insights/page.tsx       # AI-Powered Insights
│       ├── gamification/page.tsx         # Gamification & Rewards
│       ├── ai-assistant/page.tsx         # AI Assistant
│       ├── building-advice/page.tsx      # Construction Advice
│       ├── chat/page.tsx                 # Chat System
│       ├── feedback/page.tsx             # User Feedback
│       ├── help-center/page.tsx          # Help & Support
│       ├── support/page.tsx              # Technical Support
│       │
│       ├── 💰 Payment System
│       │   ├── payment-channels/page.tsx # Payment Methods
│       │   ├── payment/success/page.tsx  # Payment Success
│       │   └── payment/error/page.tsx    # Payment Error
│       │
│       └── 🏗️ Project Management
│           └── projects/
│               ├── page.tsx              # Projects Dashboard
│               ├── list/page.tsx         # Projects List
│               ├── new/page.tsx          # Create New Project
│               ├── create/page.tsx       # Project Creation Form
│               ├── calculator/page.tsx   # Cost Calculator
│               ├── notebook/page.tsx     # Project Notes
│               ├── settings/page.tsx     # Project Settings
│               ├── subscription/page.tsx # Project Subscriptions
│               ├── suppliers/page.tsx    # Supplier Management
│               ├── [id]/
│               │   ├── page.tsx          # Project Details
│               │   ├── edit/page.tsx     # Edit Project
│               │   └── reports/page.tsx  # Project Reports
│               └── projects-marketplace/
│                   ├── page.tsx          # Projects Marketplace
│                   └── for-sale/
│                       ├── page.tsx      # Projects For Sale
│                       └── [id]/page.tsx # Specific Project Sale
│
├── 🏪 Store Management Portal
│   └── store/
│       ├── page.tsx                      # Store Portal Home
│       ├── dashboard/page.tsx            # Store Dashboard
│       ├── admin/page.tsx                # Store Administration
│       ├── settings/page.tsx             # Store Settings
│       ├── analytics/page.tsx            # Store Analytics
│       ├── reports/page.tsx              # Business Reports
│       ├── notifications/page.tsx        # Notification Center
│       ├── permissions/page.tsx          # User Permissions
│       ├── search/page.tsx               # Search Management
│       ├── storefront/page.tsx           # Storefront Customization
│       │
│       ├── 📦 Product Management
│       │   ├── construction-products/
│       │   │   ├── page.tsx              # Construction Products
│       │   │   └── new/page.tsx          # Add New Construction Product
│       │   ├── products/construction/new/page.tsx # Alternative Product Creation
│       │   ├── product-variants/page.tsx # Product Variants
│       │   ├── product-bundles/
│       │   │   ├── page.tsx              # Product Bundles
│       │   │   └── create/page.tsx       # Create Bundle
│       │   ├── categories/construction/page.tsx # Product Categories
│       │   └── collections/page.tsx      # Product Collections
│       │
│       ├── 💰 Financial Management
│       │   ├── financial-management/page.tsx # Financial Overview
│       │   ├── payments/page.tsx         # Payment Processing
│       │   ├── pricing/
│       │   │   ├── page.tsx              # Pricing Management
│       │   │   └── create/page.tsx       # Create Pricing Rules
│       │   └── currency-region/page.tsx  # Currency & Region Settings
│       │
│       ├── 👥 Customer Management
│       │   ├── customers/page.tsx        # Customer Database
│       │   ├── customer-groups/page.tsx  # Customer Groups
│       │   └── customer-segmentation/page.tsx # Customer Segmentation
│       │
│       ├── 📦 Inventory & Orders
│       │   ├── inventory/page.tsx        # Inventory Management
│       │   ├── orders/page.tsx           # Order Management
│       │   ├── order-management/page.tsx # Advanced Order Management
│       │   └── warehouses/page.tsx       # Warehouse Management
│       │
│       ├── 🚚 Shipping & Delivery
│       │   ├── shipping/page.tsx         # Shipping Options
│       │   └── delivery/page.tsx         # Delivery Management
│       │
│       ├── 🎯 Marketing & Promotions
│       │   ├── promotions/page.tsx       # Promotions & Discounts
│       │   ├── campaigns/page.tsx        # Marketing Campaigns
│       │   └── email-campaigns/page.tsx  # Email Marketing
│       │
│       ├── 🛒 Point of Sale
│       │   ├── pos/
│       │   │   ├── page.tsx              # POS System
│       │   │   └── offline/page.tsx      # Offline POS
│       │   └── barcode-scanner/page.tsx  # Barcode Scanner
│       │
│       ├── 🏪 Marketplace
│       │   ├── marketplace/page.tsx      # Marketplace Management
│       │   └── marketplace-vendors/page.tsx # Vendor Management
│       │
│       └── 🔧 Business Tools
│           └── erp/page.tsx              # ERP Integration
│
├── 👑 Admin Portal
│   └── admin/
│       ├── dashboard/page.tsx            # Admin Dashboard
│       ├── global/page.tsx               # Global Settings
│       ├── construction/page.tsx         # Construction Module Admin
│       ├── gcc-markets/page.tsx          # GCC Markets Management
│       └── ai-analytics/page.tsx         # AI Analytics Dashboard
│
├── 🌍 Public Pages (Route Groups)
│   ├── (public)/
│   │   ├── marketplace/page.tsx          # Public Marketplace
│   │   ├── construction-data/page.tsx    # Public Construction Data
│   │   ├── material-prices/page.tsx      # Public Material Prices
│   │   ├── forum/page.tsx                # Public Forum
│   │   └── supervisors/page.tsx          # Supervisors Directory
│   │
│   └── (finance)/
│       ├── banking/page.tsx              # Banking Services
│       ├── insurance/page.tsx            # Insurance Services
│       └── loans/page.tsx                # Loan Services
│
└── 🔗 API Endpoints
    └── api/
        └── [Various API routes - not page.tsx files]
```

## 📊 Page Categories Summary

### 🏠 **Core Platform** (1 page)
- **Main Landing Page**: Comprehensive platform showcase with search & filtering

### 🔐 **Authentication** (6 pages)
- Auth router, login, signup, password recovery, reset confirmation

### 👤 **User Portal** (32 pages)
- Dashboard, profile, projects, payments, marketplace, community features

### 🏪 **Store Management** (35 pages)
- Complete e-commerce management: products, orders, customers, marketing, POS

### 👑 **Admin Portal** (5 pages)
- Platform administration, analytics, global settings

### 🌍 **Public Access** (7 pages)
- Public marketplace, construction data, forums, financial services

### 🛠️ **Utility Pages** (6 pages)
- Testing, debugging, offline functionality

## 🎯 Key Features by Role

### **Unregistered Users**
- Landing page with product search & filtering
- Public marketplace browsing
- Material prices & construction data
- Forum access

### **Registered Users**
- Complete project management suite
- AI-powered insights & assistant
- Social community features
- Gamification & rewards system

### **Store Owners**
- Full e-commerce platform
- Advanced analytics & reporting
- Multi-channel sales (online, POS, marketplace)
- Comprehensive business management tools

### **Platform Admins**
- Global platform management
- AI analytics dashboard
- GCC markets oversight
- System administration

## 📱 Responsive Design
All pages are built with responsive design principles, supporting:
- Desktop computers
- Tablets
- Mobile devices
- Progressive Web App (PWA) capabilities

## 🔄 Real-time Features
Many pages include real-time functionality:
- Live price tracking
- Instant notifications
- Real-time chat
- Live inventory updates
- Dynamic analytics

---

**Total Pages**: 92 page.tsx files
**Last Updated**: July 19, 2025
**Platform**: Binna - Comprehensive Construction & E-commerce Platform
