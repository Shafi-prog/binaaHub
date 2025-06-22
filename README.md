# Binna Unified Platform

![Logo](public/logo.png)

A unified construction management platform integrating **real Medusa Community Edition** for e-commerce functionality.

## 🏗️ Architecture

The Binna platform is a **unified Next.js application** that integrates with:

- **Real Medusa Backend** (localhost:9000) - Full Medusa Community Edition
- **Medusa Storefront** (localhost:8000) - Customer-facing store
- **Binna Platform** (localhost:3000) - Main application with proxy and unified interface

## 🚀 Getting Started

### Prerequisites

1. **Medusa Backend**: Ensure your real Medusa backend is running at `C:\Users\hp\Documents\medusa-develop`
2. **Node.js**: Version 18 or higher
3. **Database**: PostgreSQL for Medusa
4. **Redis**: For Medusa caching

### Environment Setup

1. Copy the environment template:
```bash
cp .env.unified.example .env.local
```

2. Configure your environment variables:
```env
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_STOREFRONT_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

#### Option 1: Unified Development (Recommended)
Run both Medusa and Binna platform together:
```bash
npm run unified:dev
```

#### Option 2: Separate Development
1. Start Medusa backend (in separate terminal):
```bash
npm run medusa:dev
```

2. Start Binna platform:
```bash
npm run dev
```

### Production

```bash
npm run unified:start
```

## 🌐 Available Routes

- **🌐 Frontend**: http://localhost:3000
- **🏪 Store Pages**: http://localhost:3000/store
- **👤 User Dashboard**: http://localhost:3000/dashboard
- **⚙️ Admin Panel**: http://localhost:3000/admin
- **🔧 Medusa Admin Proxy**: http://localhost:3000/medusa-admin
- **🛍️ Medusa Store Proxy**: http://localhost:3000/medusa-store
- **📊 Medusa API Proxy**: http://localhost:3000/medusa-api

### Direct Access
- **🔗 Medusa Backend**: http://localhost:9000
- **🔗 Medusa Storefront**: http://localhost:8000

## ✅ Features

### ✅ Real Medusa Integration
- ✅ Complete Medusa Community Edition backend
- ✅ Real product management
- ✅ Real order processing
- ✅ Real customer management
- ✅ Real payment processing
- ✅ Proxy integration for unified experience

### ✅ Construction Management
- ✅ Project management
- ✅ Construction progress tracking
- ✅ Expense tracking
- ✅ Supervisor management
- ✅ Blueprint analysis
- ✅ Warranty management

### ✅ User Management
- ✅ Supabase authentication
- ✅ Role-based access control
- ✅ User dashboards
- ✅ Profile management

## 🧹 Recent Changes

### ✅ Cleanup Complete (June 22, 2025)
- ❌ Removed all mock/old Medusa servers
- ❌ Removed all Odoo integration code
- ❌ Removed outdated scripts and files
- ✅ Updated server.js for real Medusa proxy
- ✅ Added unified development scripts
- ✅ Clean environment configuration

### ✅ Previous Fixes
- ✅ Fixed login redirect to user page
- ✅ Updated routing structure
- ✅ Improved middleware configuration

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Medusa Documentation](https://docs.medusajs.com)
- [Supabase Documentation](https://supabase.com/docs)

---

**💡 Note**: This platform now uses **real Medusa Community Edition** instead of mock servers, providing full e-commerce functionality integrated with construction management features.
