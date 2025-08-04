# 🏗️ BINNA PLATFORM - PROJECT TREE STRUCTURE
**Updated: August 4, 2025**  
**Version: 0.1.2**  
**Architecture: Next.js 15.4.2 + Domain-Driven Design (DDD)**

---

## 📊 **PROJECT OVERVIEW**
- **Total Pages**: 163+ static pages
- **Architecture**: Domain-Driven Design (DDD) with Next.js App Router
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth + NextAuth.js
- **Deployment**: Vercel Production
- **UI Framework**: React + TypeScript + Tailwind CSS

---

## 🌳 **MAIN PROJECT STRUCTURE**

```
binaaHub/
├── 📁 .github/                    # GitHub workflows and CI/CD
│   └── workflows/
│       └── ci-cd.yml
│
├── 📁 .next/                      # Next.js build artifacts
├── 📁 .vercel/                    # Vercel deployment config
├── 📁 .vscode/                    # VS Code workspace settings
├── 📁 node_modules/               # Dependencies
│
├── 📁 config/                     # Configuration files
│   ├── jest.setup.js
│   ├── tsconfig.dev.json
│   ├── tsconfig.extends.json
│   └── tsconfig.jest.json
│
├── 📁 database/                   # Database schemas and migrations
│   ├── migrations/
│   ├── seed-data/
│   ├── complete_schema.sql
│   ├── create-production-tables-with-data.sql
│   ├── safe-rls-policies.sql
│   └── supabase-schema.sql
│
├── 📁 docs/                       # Documentation and reports
│   ├── CURRENT_PLATFORM_TREE_STRUCTURE.md
│   ├── IMPLEMENTATION_STATUS.md
│   ├── PLATFORM_TRANSFORMATION_PLAN.md
│   └── binna_modules.txt
│
├── 📁 public/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── 📁 scripts/                    # Build and utility scripts
│
├── 📁 supabase/                   # Supabase configuration
│
└── 📁 src/                        # Main source code
    ├── 📁 app/                    # Next.js App Router pages
    ├── 📁 contexts/               # React contexts
    ├── 📁 core/                   # Core utilities and configs
    ├── 📁 domains/                # Domain-driven design modules
    ├── 📁 lib/                    # Shared libraries
    ├── 📁 pages/                  # Legacy pages (migration in progress)
    ├── 📁 products/               # Product management
    └── middleware.ts              # Next.js middleware
```

---

## 🏛️ **DOMAIN-DRIVEN ARCHITECTURE** (`src/domains/`)

```
domains/
├── 📁 admin/                      # Administration domain
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── 📁 construction/               # Construction project management
│   ├── components/
│   ├── models/
│   ├── services/
│   └── types/
│
├── 📁 logistics/                  # Supply chain and logistics
│   ├── components/
│   ├── models/
│   ├── services/
│   └── types/
│
├── 📁 marketplace/                # E-commerce marketplace
│   ├── components/
│   ├── models/
│   │   ├── business-report.ts
│   │   ├── chat-session.ts
│   │   ├── security-event.ts
│   │   ├── support-ticket.ts
│   │   ├── tax-exemption.ts
│   │   └── two-factor-auth.ts
│   ├── services/
│   └── types/
│
├── 📁 payment/                    # Payment processing
├── 📁 payments/                   # Payment management
│
├── 📁 shared/                     # Shared domain components
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── 📁 store/                      # Store management domain
│   ├── components/
│   │   └── permissions/
│   │       └── StorePermissionSystem.tsx
│   ├── index.ts
│   ├── models/
│   │   └── Store.ts
│   ├── repositories/
│   │   └── StoreRepository.ts
│   ├── services/
│   │   └── StoreService.ts
│   └── types/
│       └── index.ts
│
└── 📁 user/                       # User management domain
    ├── components/
    │   └── UserDashboard.tsx
    ├── index.ts
    ├── models/
    │   └── User.ts
    ├── repositories/
    │   └── UserRepository.ts
    ├── services/
    │   └── UserService.ts
    └── types/
        └── index.ts
```

---

## 🛤️ **APP ROUTER STRUCTURE** (`src/app/`)

```
app/
├── 📁 (public)/                   # Public routes
├── 📁 admin/                      # Admin dashboard
│   ├── ai-analytics/
│   ├── analytics/
│   ├── construction/
│   ├── dashboard/
│   ├── finance/
│   ├── global/
│   ├── settings/
│   └── stores/
│
├── 📁 api/                        # API routes
│   ├── auth/
│   │   ├── logout/
│   │   └── proxy-login/
│   ├── erp/
│   │   ├── analytics/
│   │   ├── customers/
│   │   ├── items/
│   │   ├── reports/
│   │   └── sales-orders/
│   ├── notifications/
│   ├── platform/
│   │   └── dashboard/
│   │       ├── admin/
│   │       ├── service-provider/
│   │       ├── store/
│   │       └── user/
│   └── users/
│
├── 📁 auth/                       # Authentication pages
│   ├── forgot-password/
│   ├── login/
│   ├── reset-password-confirm/
│   └── signup/
│
├── 📁 construction-journey/        # Construction workflow
│   ├── blueprint-approval/
│   ├── contractor-selection/
│   ├── excavation/
│   ├── execution/
│   ├── fencing/
│   ├── insurance/
│   ├── land-purchase/
│   └── waste-disposal/
│
├── 📁 dashboard/                  # Main dashboard
│   ├── concrete-supplier/
│   ├── equipment-rental/
│   └── waste-management/
│
├── 📁 service-provider/           # Service provider portal
│   ├── bookings/
│   ├── calendar/
│   ├── customers/
│   ├── dashboard/
│   │   └── concrete-supply/
│   ├── payments/
│   ├── profile/
│   ├── reports/
│   ├── services/
│   └── settings/
│
├── 📁 store/                      # Store management
│   ├── accounting/
│   │   ├── bank-reconciliation/
│   │   ├── manual-journals/
│   │   └── vat-management/
│   ├── backup/
│   ├── campaigns/
│   ├── cash-registers/
│   ├── collections/
│   ├── currency-region/
│   ├── customer-groups/
│   ├── customer-segmentation/
│   ├── customers/
│   ├── dashboard/
│   ├── delivery/
│   ├── erp/
│   ├── finance/
│   ├── hr/
│   ├── inventory/
│   ├── marketplace-vendors/
│   ├── notifications/
│   ├── orders/
│   ├── payments/
│   ├── permissions/
│   ├── pos/
│   ├── pricing/
│   ├── product-bundles/
│   ├── product-variants/
│   ├── products/
│   ├── promotions/
│   ├── purchase-orders/
│   ├── reports/
│   ├── sales-orders/
│   ├── search/
│   ├── settings/
│   ├── shipping/
│   ├── staff/
│   ├── storefront/
│   ├── suppliers/
│   ├── taxes/
│   ├── warehouses/
│   └── warranty-management/
│
├── 📁 storefront/                 # Customer-facing storefront
│
└── 📁 user/                       # User portal
    ├── balance/
    ├── building-advice/
    ├── cart/
    ├── chat/
    ├── comprehensive-construction-calculator/
    ├── dashboard/
    │   └── construction-data/
    ├── documents/
    ├── expenses/
    ├── favorites/
    ├── gamification/
    ├── help-center/
    ├── invoices/
    ├── orders/
    ├── payment/
    │   ├── error/
    │   └── success/
    ├── profile/
    ├── projects/
    │   ├── construction-types/
    │   ├── create/
    │   ├── notebook/
    │   ├── settings/
    │   ├── suppliers/
    │   └── unified/
    ├── projects-marketplace/
    ├── settings/
    ├── social-community/
    ├── stores-browse/
    ├── subscriptions/
    ├── support/
    ├── warranties/
    │   ├── ai-extract/
    │   ├── new/
    │   └── tracking/
    └── warranty-expense-tracking/
```

---

## 🔧 **CORE INFRASTRUCTURE**

```
src/
├── 📁 contexts/                   # React Context providers
│   ├── AuthContext.tsx
│   ├── UserContext.tsx
│   └── StoreContext.tsx
│
├── 📁 core/                       # Core utilities
│   ├── api/
│   ├── auth/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── types/
│   └── utils/
│
├── 📁 lib/                        # External integrations
│   ├── supabase/
│   ├── auth/
│   ├── validation/
│   └── utils/
│
└── middleware.ts                  # Authentication & routing middleware
```

---

## ⚙️ **CONFIGURATION FILES**

```
Root Configuration:
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .env.local                    # Local overrides
├── .env.vercel                   # Vercel environment
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── eslint.config.js              # ESLint configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Dependencies and scripts
└── .prettierrc.json              # Code formatting rules
```

---

## 🗃️ **DATABASE STRUCTURE**

```
database/
├── migrations/                   # Database migrations
├── seed-data/                    # Initial data
├── complete_schema.sql           # Full schema
├── create-production-tables-with-data.sql
├── safe-rls-policies.sql         # Row Level Security
├── supabase-schema.sql           # Supabase specific schema
└── unified_schema.sql            # Unified database schema
```

---

## 📈 **PLATFORM STATISTICS**

### **Application Metrics**
- **Total Routes**: 163+ static pages
- **Domain Models**: 9 domains (User, Store, Admin, Construction, etc.)
- **API Endpoints**: 25+ REST endpoints
- **Authentication Methods**: 3 (Email/Password, Google OAuth, Admin)
- **User Types**: 4 (Customer, Store Owner, Service Provider, Admin)

### **Technology Stack**
- **Frontend**: Next.js 15.4.2, React 18, TypeScript
- **Styling**: Tailwind CSS 3.x
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth + NextAuth.js
- **Deployment**: Vercel (Production)
- **State Management**: React Context + Custom hooks
- **Form Handling**: React Hook Form + Zod validation

### **Integration Capabilities**
- **Payment Systems**: Stripe, MyFatoorah (KSA)
- **ERP Systems**: Odoo, Idurar
- **E-commerce**: Medusa.js
- **AI Services**: Google Gemini API
- **Maps**: Google Maps API
- **Email**: SMTP integration
- **File Storage**: Supabase Storage

---

## 🔄 **RECENT UPDATES** (August 4, 2025)

### ✅ **Completed**
1. **Authentication Fix**: Resolved Vercel login issues with updated Supabase keys
2. **TypeScript Errors**: Fixed all compilation errors in domain types
3. **Case Sensitivity**: Standardized file import casing across domains
4. **Build Process**: Successful production build with 163 pages
5. **Environment Sync**: Aligned local and production environment variables

### 🚧 **In Progress**
1. **Domain Expansion**: Adding more business logic to domain models
2. **API Enhancement**: Expanding REST API endpoints
3. **Performance Optimization**: Bundle size optimization
4. **Security Updates**: Enhanced RLS policies

### 🎯 **Planned Features**
1. **Real-time Features**: WebSocket integration
2. **Mobile App**: React Native companion
3. **Advanced Analytics**: Enhanced reporting dashboards
4. **AI Integration**: Construction planning AI assistant

---

## 📞 **SUPPORT & MAINTENANCE**

- **Last Updated**: August 4, 2025
- **Version**: 0.1.2
- **Node.js**: v18+
- **Database**: Supabase Production Instance
- **Deployment**: Vercel Production
- **Status**: ✅ All systems operational

---

*This tree structure reflects the current state of the BinaaHub platform with all recent fixes and optimizations applied.*
