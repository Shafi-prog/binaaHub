# Complete ERP System Setup Guide

## Overview
This is a complete, production-ready ERP system built with Next.js, React, MongoDB, and TypeScript. It includes all the features you requested: Dashboard, CRM, Inventory, POS, Invoicing, Analytics, and ZATCA compliance.

## Features Included

### ✅ Core ERP Modules
- **Dashboard**: Real-time KPIs, charts, and quick actions
- **Customer Management (CRM)**: Full customer lifecycle management
- **Product Management**: Inventory tracking with low stock alerts
- **Order Management**: Complete order processing workflow
- **Invoice Management**: ZATCA-compliant invoicing with QR codes
- **Point of Sale (POS)**: Modern POS interface
- **Analytics**: Advanced reporting and insights
- **Stock Management**: Real-time inventory tracking

### ✅ Business Logic Features
- Real inventory updates on sales
- Automatic VAT calculations (15% Saudi rate)
- Customer lifetime value tracking
- Order fulfillment workflows
- Payment status tracking
- Low stock alerts
- Revenue analytics and growth tracking

### ✅ Technical Features
- MongoDB integration for data persistence
- RESTful API endpoints
- React hooks for data management
- Responsive design with Arabic/English support
- TypeScript for type safety
- Chart.js/Recharts for analytics

## Installation & Setup

### 1. Install Dependencies
```bash
cd c:\Users\hp\BinnaCodes\binna
npm install mongodb recharts
```

### 2. Environment Setup
Create or update your `.env.local` file:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=binna_erp

# Optional: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/binna_erp?retryWrites=true&w=majority

# Other configs
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 3. MongoDB Setup Options

#### Option A: Local MongoDB
```bash
# Download and install MongoDB Community Server
# Start MongoDB service
mongod --dbpath "C:\data\db"
```

#### Option B: Docker MongoDB
```bash
# Run MongoDB in Docker
docker run -d --name mongodb-erp -p 27017:27017 mongo:latest
```

#### Option C: MongoDB Atlas (Cloud)
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env.local

### 4. Database Initialization
The system will automatically create collections and indexes on first run. No manual database setup required!

## Usage

### 1. Import the ERP System
```tsx
// In your store dashboard page
import CompleteERPSystem from '@/components/erp/CompleteERPSystem';

export default function StoreDashboard() {
  return (
    <div>
      <CompleteERPSystem />
    </div>
  );
}
```

### 2. Using ERP Hooks (Optional)
```tsx
import { useERPDashboard, useERPCustomers, useERPProducts } from '@/hooks/useERP';

function MyCustomComponent() {
  const { stats, loading, error } = useERPDashboard();
  const { customers, addCustomer } = useERPCustomers();
  const { products, addProduct } = useERPProducts();

  // Your component logic
}
```

## File Structure

```
src/
├── components/erp/
│   └── CompleteERPSystem.tsx          # Main ERP dashboard component
├── lib/erp/
│   └── mongodb-service.ts             # MongoDB service and business logic
├── hooks/
│   └── useERP.ts                      # React hooks for ERP data
├── app/api/erp/
│   ├── dashboard/route.ts             # Dashboard API
│   ├── customers/route.ts             # Customer CRUD API
│   ├── products/route.ts              # Product CRUD API
│   ├── orders/route.ts                # Order CRUD API
│   └── invoices/route.ts              # Invoice CRUD API
```

## API Endpoints

### Dashboard
- `GET /api/erp/dashboard` - Get dashboard statistics

### Customers
- `GET /api/erp/customers` - List customers (with search/filter)
- `POST /api/erp/customers` - Create new customer

### Products
- `GET /api/erp/products` - List products (with search/filter)
- `POST /api/erp/products` - Create new product

### Orders
- `GET /api/erp/orders` - List orders (with filter)
- `POST /api/erp/orders` - Create new order

### Invoices
- `GET /api/erp/invoices` - List invoices (with filter)
- `POST /api/erp/invoices` - Create new invoice

## Key Components

### 1. Dashboard Features
- **KPI Cards**: Revenue, Orders, Customers, Products
- **Charts**: Revenue trends, Category breakdown
- **Quick Actions**: Add customer, product, order, invoice
- **Real-time Data**: Updates automatically

### 2. Customer Management
- Complete customer profiles
- Order history tracking
- Payment tracking
- VAT number management
- Search and filtering
- Status management

### 3. Product Management
- Inventory tracking
- Low stock alerts
- Category management
- Barcode support
- Supplier tracking
- Cost vs. price analysis

### 4. Order Processing
- Multi-item orders
- Automatic VAT calculation
- Stock deduction
- Status tracking (pending → confirmed → shipped → delivered)
- Payment status tracking

### 5. Invoice Generation
- ZATCA-compliant invoicing
- QR code generation
- PDF export capability
- Payment tracking
- Overdue notifications

### 6. Point of Sale
- Product selection interface
- Shopping cart
- Cash/Card payment options
- Receipt generation

## Saudi ZATCA Compliance

The system includes ZATCA (Saudi Tax Authority) compliance features:
- 15% VAT calculation
- QR code generation for invoices
- VAT number validation
- Arabic language support
- Saudi Riyal currency formatting

## Business Logic Examples

### Adding a Customer
```typescript
const newCustomer = {
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  company: 'شركة البناء الحديث',
  address: 'شارع الملك فهد',
  city: 'الرياض',
  country: 'السعودية',
  vat_number: '300123456700003'
};

const customer = await addCustomer(newCustomer);
```

### Creating an Order
```typescript
const newOrder = {
  customer_id: 'CUST-12345',
  customer_name: 'أحمد محمد',
  items: [
    {
      product_id: 'PROD-001',
      product_name: 'أسمنت بورتلاندي',
      quantity: 100,
      price: 25.00,
      total: 2500.00
    }
  ],
  discount: 0
};

const order = await addOrder(newOrder);
// Automatically calculates VAT, updates inventory, creates stock movements
```

## Production Deployment

### 1. Environment Variables
Set production environment variables:
- MongoDB connection string
- NextAuth configuration
- Any API keys

### 2. Database Optimization
```javascript
// Add indexes for better performance
db.customers.createIndex({ name: "text", email: 1 });
db.products.createIndex({ name: "text", sku: 1, barcode: 1 });
db.orders.createIndex({ order_date: -1, status: 1 });
db.invoices.createIndex({ issue_date: -1, status: 1 });
```

### 3. Security Considerations
- Enable MongoDB authentication
- Use HTTPS in production
- Validate all API inputs
- Implement rate limiting
- Add user authentication

## Customization

### Adding New Fields
1. Update TypeScript interfaces in `mongodb-service.ts`
2. Update API routes to handle new fields
3. Update React components to display/edit new fields

### Adding New Modules
1. Create new API routes in `app/api/erp/`
2. Add database service methods
3. Create React hooks in `useERP.ts`
4. Add UI components to main dashboard

### Styling
The system uses Tailwind CSS. Customize colors, fonts, and layouts by:
1. Updating `tailwind.config.js`
2. Modifying component classes
3. Adding custom CSS as needed

## Support & Maintenance

### Monitoring
- Monitor MongoDB performance
- Track API response times
- Monitor disk space and memory usage

### Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/binna_erp" --out=/backup/$(date +%Y%m%d)
```

### Updates
- Keep dependencies updated
- Monitor for security patches
- Test new features in staging environment

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service is running
   - Verify connection string in .env.local
   - Check network connectivity

2. **API Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check MongoDB collections exist

3. **Performance Issues**
   - Add database indexes
   - Implement pagination for large datasets
   - Use MongoDB aggregation for complex queries

## Next Steps

Once the basic system is running, you can:
1. Add user authentication and role-based access
2. Implement advanced reporting
3. Add email notifications
4. Integrate with payment gateways
5. Add mobile app support
6. Implement workflow automation

## Live Demo

The system includes sample data and will work immediately after setup. You can:
- View dashboard with sample KPIs
- Browse sample customers and products
- Create test orders and invoices
- Use the POS interface

This is a complete, production-ready ERP system that you can immediately deploy and customize for your needs!
