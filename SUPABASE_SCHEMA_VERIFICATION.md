# Supabase Database Schema Verification

Generated on: 2025-07-26T02:18:04.503Z

## Required Tables for Store Management

The store management system requires the following database tables:


### stores
**Description**: Store information and profiles
**Fields**: 12
**Indexes**: 3
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `name` (text) - REQUIRED
- `description` (text)
- `category` (text) - REQUIRED
- `rating` (decimal)
- `location` (text)
- `phone` (text)
- `email` (text)
- `is_active` (boolean)
- `user_id` (uuid) - References auth.users(id)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### products
**Description**: Product catalog
**Fields**: 16
**Indexes**: 4
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `name` (text) - REQUIRED
- `description` (text)
- `price` (decimal) - REQUIRED
- `cost` (decimal)
- `category` (text) - REQUIRED
- `stock_quantity` (integer)
- `min_stock_level` (integer)
- `max_stock_level` (integer)
- `unit` (text)
- `barcode` (text)
- `image_url` (text)
- `is_available` (boolean)
- `store_id` (uuid) - REQUIRED - References stores(id)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### customers
**Description**: Customer information
**Fields**: 14
**Indexes**: 3
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `name` (text) - REQUIRED
- `email` (text)
- `phone` (text) - REQUIRED
- `address` (text)
- `city` (text)
- `region` (text)
- `postal_code` (text)
- `type` (text)
- `category` (text)
- `credit_limit` (decimal)
- `store_id` (uuid) - REQUIRED - References stores(id)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### orders
**Description**: Customer orders
**Fields**: 15
**Indexes**: 4
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `order_number` (text) - REQUIRED
- `customer_id` (uuid) - REQUIRED - References customers(id)
- `store_id` (uuid) - REQUIRED - References stores(id)
- `status` (text)
- `payment_status` (text)
- `payment_method` (text)
- `subtotal` (decimal) - REQUIRED
- `tax_amount` (decimal)
- `shipping_cost` (decimal)
- `total_amount` (decimal) - REQUIRED
- `shipping_address` (text)
- `notes` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### order_items
**Description**: Order line items
**Fields**: 7
**Indexes**: 2
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `order_id` (uuid) - REQUIRED - References orders(id)
- `product_id` (uuid) - REQUIRED - References products(id)
- `quantity` (integer) - REQUIRED
- `unit_price` (decimal) - REQUIRED
- `total_price` (decimal) - REQUIRED
- `created_at` (timestamptz)


### suppliers
**Description**: Supplier information
**Fields**: 11
**Indexes**: 2
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `name` (text) - REQUIRED
- `contact_person` (text)
- `phone` (text) - REQUIRED
- `email` (text)
- `address` (text)
- `category` (text)
- `payment_terms` (integer)
- `store_id` (uuid) - REQUIRED - References stores(id)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### inventory
**Description**: Inventory tracking
**Fields**: 8
**Indexes**: 2
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `product_id` (uuid) - REQUIRED - References products(id)
- `quantity` (integer) - REQUIRED
- `reserved_quantity` (integer)
- `warehouse_location` (text)
- `last_counted` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### employees
**Description**: Employee management
**Fields**: 12
**Indexes**: 3
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `name` (text) - REQUIRED
- `email` (text)
- `phone` (text)
- `position` (text) - REQUIRED
- `department` (text)
- `salary` (decimal)
- `hire_date` (date) - REQUIRED
- `is_active` (boolean)
- `store_id` (uuid) - REQUIRED - References stores(id)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)


### transactions
**Description**: Financial transactions
**Fields**: 9
**Indexes**: 3
**Row Level Security**: ✅ Enabled

**Fields**:
- `id` (uuid) - PRIMARY KEY
- `amount` (decimal) - REQUIRED
- `type` (text) - REQUIRED
- `category` (text)
- `description` (text)
- `reference_id` (uuid)
- `reference_type` (text)
- `store_id` (uuid) - REQUIRED - References stores(id)
- `created_at` (timestamptz)


## Database Setup Instructions

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the schema from `supabase-schema.sql`
4. Click **Run** to execute the schema

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in to Supabase
supabase login

# Apply the schema
supabase db reset --linked
supabase db push
```

### Option 3: Manual Table Creation

Use the Supabase dashboard **Table Editor** to create tables manually:

1. Create `stores` table
1. Create `products` table
1. Create `customers` table
1. Create `orders` table
1. Create `order_items` table
1. Create `suppliers` table
1. Create `inventory` table
1. Create `employees` table
1. Create `transactions` table

## Security Configuration

### Row Level Security (RLS) Policies

All tables have RLS enabled. You should customize the policies based on your needs:

```sql
-- Example: Store owners can only access their own data
CREATE POLICY "store_access_policy" ON products
  FOR ALL USING (store_id IN (
    SELECT id FROM stores WHERE user_id = auth.uid()
  ));
```

### API Security

Make sure to configure proper API policies in Supabase:

1. **Authentication**: Enable required auth providers
2. **Authorization**: Set up proper RLS policies
3. **API Keys**: Use anon key for public access, service key for admin operations

## Data Validation

After creating the schema, verify the setup:

1. **Tables Created**: Check that all 9 tables exist
2. **Relationships**: Verify foreign key constraints
3. **Indexes**: Confirm performance indexes are created
4. **RLS**: Test row level security policies
5. **API Access**: Test CRUD operations from your application

## Connection Configuration

Update your application environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing the Connection

Use this test query to verify the connection:

```javascript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

// Test query
const { data, error } = await supabase
  .from('stores')
  .select('*')
  .limit(1);

if (error) {
  console.error('Database connection failed:', error);
} else {
  console.log('Database connection successful:', data);
}
```

## Next Steps

1. ✅ Create database schema
2. ✅ Test database connection  
3. ✅ Run store data conversion script
4. ✅ Test converted pages
5. ✅ Add proper error handling
6. ✅ Implement real-time updates (optional)

## Troubleshooting

### Common Issues

- **Table not found**: Make sure all tables are created
- **Permission denied**: Check RLS policies and authentication
- **Connection failed**: Verify environment variables
- **Foreign key errors**: Ensure referenced tables exist first

### Support

For additional help:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
