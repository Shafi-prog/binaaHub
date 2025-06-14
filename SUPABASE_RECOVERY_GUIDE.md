# Supabase Recovery Guide

## Issue: Supabase Project Not Accessible (404 Error)

Your Supabase project URL `https://lqhopwohuddhapkhhikf.supabase.co` is returning a 404 error, which means:
- The project is paused due to inactivity
- The project has been deleted
- The URL has changed
- There's a billing issue

## Step 1: Check Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in with your account
3. Check if your project exists in the dashboard

## Step 2: Possible Solutions

### If Project is Paused:
1. Click on your project in the dashboard
2. Look for a "Resume Project" or "Unpause Project" button
3. Click to resume the project
4. Wait for the project to become active (may take a few minutes)

### If Project Doesn't Exist:
1. Create a new Supabase project
2. Note down the new project URL and keys
3. Update your environment variables (see Step 3)

### If URL Changed:
1. In your Supabase dashboard, click on your project
2. Go to Settings > API
3. Copy the new Project URL and API keys

## Step 3: Update Environment Variables

Once you have the correct Supabase credentials, update these files:

### Update .env.local:
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_NEW_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

### Update .env.production:
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_NEW_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

## Step 4: Update Vercel Environment Variables

Run these commands to update Vercel environment variables:

```powershell
vercel env rm NEXT_PUBLIC_SUPABASE_URL production
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env rm SUPABASE_SERVICE_ROLE_KEY production
vercel env rm DATABASE_URL production

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter your new Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Enter your new anon key when prompted

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Enter your new service role key when prompted

vercel env add DATABASE_URL production
# Enter your new database URL when prompted
```

## Step 5: Recreate Database Schema (If New Project)

If you created a new Supabase project, you'll need to recreate your database schema:

1. Go to your Supabase dashboard
2. Click on "SQL Editor"
3. Run the following SQL to create the necessary tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);
```

## Step 6: Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Set Site URL to: `https://your-vercel-domain.vercel.app`
3. Add Redirect URLs:
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Step 7: Test the Connection

Run the test script to verify connectivity:

```powershell
node test-supabase-connection.js
```

## Step 8: Deploy to Vercel

After updating all environment variables:

```powershell
vercel --prod
```

## Quick Fix Commands

If you just need to resume an existing paused project:

```powershell
# Test current connection
curl -I https://lqhopwohuddhapkhhikf.supabase.co

# If it returns 200 OK, then run:
vercel --prod
```

## Verification Checklist

- [ ] Supabase project is active and accessible
- [ ] All environment variables are updated
- [ ] Database schema is created (if new project)
- [ ] Authentication settings are configured
- [ ] Vercel deployment is successful
- [ ] Login functionality works
- [ ] User dashboard loads correctly

## Next Steps

1. Follow the steps above to fix Supabase connectivity
2. Once fixed, test the login functionality
3. Verify that the AI features work as expected
4. Test the Smart Construction Calculator on the landing page

If you encounter any issues, check the Vercel deployment logs and Supabase logs for more details.
