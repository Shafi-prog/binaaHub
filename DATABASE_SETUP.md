# Database Setup Instructions

## Current Status

- ✅ Store browsing page is working with mock data fallback
- ✅ Store detail page AddToCartButton integration is complete
- ⚠️ Database tables need to be created in Supabase

## Database Setup Required

The database currently doesn't have the required tables. To fix this, you need to apply the SQL migrations through the Supabase Dashboard:

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: `lqhopwohuddhapkhhikf`

### Step 2: Apply Initial Schema

1. Navigate to SQL Editor in the Supabase Dashboard
2. Execute the SQL from: `src/migrations/supabase/00001_initial_schema.sql`
   - This creates all the necessary tables (users, stores, projects, warranties, etc.)
   - Enables Row Level Security
   - Creates basic indexes and policies

### Step 3: Apply RLS Policy Fix

1. After the initial schema is applied, execute the SQL from: `src/migrations/supabase/00006_fix_stores_rls_policies.sql`
   - This adds public read access to active stores
   - Allows anonymous users to browse stores
   - Adds performance indexes

### Step 4: Verify Setup

Once the migrations are applied:

1. The stores page will automatically switch from mock data to real database data
2. Store owners can add real stores through the store dashboard
3. Public users can browse all active stores

## Current Features Working

- ✅ Store browsing with mock data fallback
- ✅ Store detail pages with product listings
- ✅ Add to cart functionality with standardized buttons
- ✅ Cart context and state management
- ✅ Arabic language support
- ✅ Responsive design

## Next Steps After Database Setup

1. Test store creation through the store dashboard
2. Add real product data
3. Test the complete shopping flow
4. Verify cart functionality with real data

## Files Modified in This Session

- `src/app/stores/[id]/page.tsx` - Fixed AddToCartButton integration
- `src/app/stores/page.tsx` - Enhanced error handling and mock data
- `src/migrations/supabase/00006_fix_stores_rls_policies.sql` - Created RLS policies
- Fixed prop names: `size` → `variant` in AddToCartButton usage

## Testing URLs (Development Server)

- Stores listing: http://localhost:3003/stores
- Store detail: http://localhost:3003/stores/1
- Store detail: http://localhost:3003/stores/2
- Store detail: http://localhost:3003/stores/3
