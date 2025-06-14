# 🚨 CRITICAL: Supabase Project Recovery Guide

## Current Status: ❌ BLOCKED
Your Supabase project `https://lqhopwohuddhapkhhikf.supabase.co` is returning **404 Not Found**.

## Immediate Actions Required

### Step 1: Check Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Login with your account
3. Look for your project in the dashboard

### Step 2: Possible Scenarios & Solutions

#### Scenario A: Project is Paused ⏸️
- **Symptom**: Project shows as "Paused" in dashboard
- **Solution**: 
  1. Click on your project
  2. Click "Resume Project"
  3. Wait for activation (can take 5-10 minutes)
  4. Run `node supabase-health-check.js` to verify

#### Scenario B: Project was Deleted 🗑️
- **Symptom**: Project doesn't appear in dashboard
- **Solution**: 
  1. Create a new Supabase project
  2. Note down the new URL and keys
  3. Update environment variables (see Step 3)

#### Scenario C: URL Changed 🔄
- **Symptom**: Project exists but URL is different
- **Solution**: 
  1. Go to your project settings
  2. Copy the correct URL and keys
  3. Update environment variables (see Step 3)

### Step 3: Update Environment Variables

#### Option A: Automatic Update (Recommended)
```powershell
# Run the PowerShell script to update Vercel
.\update-vercel-env.ps1
```

#### Option B: Manual Update
1. **Update Local Environment** (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=YOUR_NEW_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_NEW_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVICE_ROLE_KEY
   DATABASE_URL=YOUR_NEW_DATABASE_URL
   ```

2. **Update Vercel Environment**:
   ```bash
   # Set environment variables in Vercel
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add DATABASE_URL
   ```

### Step 4: Verify Connection
```bash
# Test the connection
node supabase-health-check.js

# If successful, deploy to production
vercel --prod
```

## 🆘 If Creating New Project

### Required Supabase Setup:
1. **Create Project**:
   - Name: "Binaa ERP" (or similar)
   - Region: Choose closest to your users
   - Database Password: Strong password

2. **Enable Authentication**:
   - Go to Authentication → Settings
   - Enable Email confirmation
   - Set up redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://your-vercel-app.vercel.app/auth/callback`

3. **Set up Database Schema**:
   ```sql
   -- Run this in the SQL Editor
   CREATE TABLE IF NOT EXISTS profiles (
     id uuid REFERENCES auth.users ON DELETE CASCADE,
     email text,
     name text,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
     PRIMARY KEY (id)
   );
   
   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Create policy
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
   ```

4. **Copy Environment Variables**:
   - Project URL
   - Anon Key
   - Service Role Key
   - Database URL

## 🔍 Troubleshooting Commands

```bash
# Check current environment
node -e "console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Test curl connection
curl -I "YOUR_SUPABASE_URL"

# Verify Vercel deployment
vercel logs --prod

# Check health
node supabase-health-check.js
```

## 📞 Contact Support
If you're still having issues:
1. Screenshot your Supabase dashboard
2. Run `node supabase-health-check.js` and share output
3. Check your email for Supabase notifications about project status

---

## ⚡ Quick Recovery Checklist
- [ ] Access Supabase Dashboard
- [ ] Check project status (paused/deleted/active)
- [ ] Get correct URL and keys
- [ ] Update `.env.local` file
- [ ] Update Vercel environment variables
- [ ] Run health check
- [ ] Deploy to production
- [ ] Test login functionality

**Time Estimate**: 15-30 minutes if project exists, 1-2 hours if creating new project.
