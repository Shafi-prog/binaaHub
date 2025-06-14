#!/bin/bash
# Vercel Deployment Fix Script

echo "🚀 Deploying Vercel Authentication Fixes..."

# Add all changes
git add .

# Commit with descriptive message
git commit -m "🔧 Fix Vercel production authentication

- Update login API with production CORS headers
- Fix middleware for production environment
- Add production-optimized Supabase client
- Update cookie settings for secure production
- Add enhanced error logging
- Fix environment variable handling

This resolves the 'Internal server error' on login in production."

# Push to main branch
git push origin main

echo "✅ Changes pushed to repository!"
echo ""
echo "📋 Next Steps:"
echo "1. Update environment variables in Vercel Dashboard"
echo "2. Update Supabase site URL and redirect URLs"
echo "3. Test login on your Vercel domain"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/lqhopwohuddhapkhhikf"
