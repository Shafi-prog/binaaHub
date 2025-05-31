# Quick Database Setup Instructions

## Step 1: Apply the Minimal Stores Table

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `binaa` (Reference: `lqhopwohuddhapkhhikf`)

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Execute the SQL**
   - Copy the entire content from `MINIMAL_STORES_SETUP.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify the Setup**
   - Go to "Database" > "Tables" in the sidebar
   - You should see the `stores` table with 3 sample records
   - Check that RLS is enabled (should show a shield icon)

## Step 2: Test the Application

1. **Refresh the Stores Page**
   - Go to http://localhost:3001/stores
   - The page should now load real data instead of mock data

2. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for the enhanced error messages we added
   - Should see successful connection logs instead of errors

## Expected Results

After applying the migration:
- ✅ The stores page should display 3 real stores
- ✅ Filtering by category and city should work
- ✅ Search functionality should work
- ✅ No more "Database connection failed" errors

## If Issues Persist

1. Check the browser console for specific error messages
2. Verify the environment variables in `.env.local`
3. Ensure the Supabase project is active and not paused
4. Check the RLS policies are properly applied

## Next Steps

Once the stores table is working:
1. Apply the complete database schema from `COMPLETE_DATABASE_SETUP.sql`
2. Test the AddToCartButton integration
3. Verify the shopping cart functionality
