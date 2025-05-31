# Database Setup Instructions

## 🎯 Goal
Apply the complete database schema to enable real store data instead of mock data in the Binna e-commerce platform.

## 📋 Current Status
- ✅ Application is running successfully on http://localhost:3005
- ✅ Stores page loads with mock data fallback
- ✅ Store detail pages work correctly
- ✅ AddToCartButton integration is working
- ❌ Database tables don't exist yet (using mock data)

## 🛠️ Steps to Apply Database Migration

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Login to your account
   - Select project: `lqhopwohuddhapkhhikf`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Apply the Complete Schema**
   - Copy the entire contents of `COMPLETE_DATABASE_SETUP.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

4. **Verify Setup**
   - Check that tables were created successfully
   - Look for any error messages
   - Verify that sample store data was inserted

### Method 2: Direct psql Connection (Alternative)

If you have psql installed:

```bash
psql "postgresql://postgres.lqhopwohuddhapkhhikf:Shafi@5000@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" -f COMPLETE_DATABASE_SETUP.sql
```

## 🧪 Testing After Migration

1. **Refresh the stores page**
   - Go to http://localhost:3005/stores
   - Should now show real data instead of mock data

2. **Check browser console**
   - Open Developer Tools
   - Look for successful database queries
   - Verify no "using mock data" messages

3. **Test store functionality**
   - Browse individual stores: http://localhost:3005/stores/[store-id]
   - Test AddToCartButton functionality
   - Verify all components work with real data

## 📊 What This Migration Creates

### Tables Created:
- `users` - User profiles and account information
- `stores` - Store listings and details
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `projects` - User projects
- `warranties` - Warranty tracking

### Key Features Enabled:
- ✅ Public viewing of active stores
- ✅ Store owner management capabilities
- ✅ Product browsing by anyone
- ✅ Order creation and management
- ✅ Project and warranty tracking
- ✅ Proper indexing for performance
- ✅ Row Level Security (RLS) policies

### Sample Data Included:
- 1 sample store: "متجر البناء المحترف"
- Complete store profile with ratings and working hours
- Arabic language support

## 🔍 Troubleshooting

### If tables don't appear:
1. Check for SQL errors in the Supabase Dashboard
2. Verify your user permissions
3. Make sure you're in the correct project

### If RLS policies fail:
1. Check that auth.users table exists
2. Verify proper user authentication setup
3. Review policy syntax for any errors

### If sample data doesn't insert:
1. Comment out the sample data section and run schema only
2. Insert sample data separately after schema creation

## 🎉 Expected Result

After successful migration:
- Stores page will load real database content
- Store browsing will work seamlessly
- Shopping cart functionality will persist
- All Arabic content will display correctly
- Performance will be optimized with proper indexes

## 📝 Next Steps After Migration

1. Test the complete user flow
2. Add more sample products and stores
3. Test user registration and store creation
4. Verify order placement functionality
5. Test warranty and project management features
