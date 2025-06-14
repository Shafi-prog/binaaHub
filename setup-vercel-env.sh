#!/bin/bash
# Vercel Environment Setup Script - Run this to fix authentication

echo "🚀 Setting up Vercel Environment Variables..."

# Your Vercel deployment URL
VERCEL_URL="https://binaa-dytm4zjek-shafi-projs-projects.vercel.app"

echo "📋 Adding environment variables for: $VERCEL_URL"

# Add all required environment variables
echo "Adding NEXTAUTH_URL..."
echo "$VERCEL_URL" | npx vercel env add NEXTAUTH_URL production

echo "Adding NEXT_PUBLIC_APP_URL..."
echo "$VERCEL_URL" | npx vercel env add NEXT_PUBLIC_APP_URL production

echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://lqhopwohuddhapkhhikf.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production

echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4OTI4MDYsImV4cCI6MjAzMjQ2ODgwNn0.vCxGDrVNvKA7OhwcYZLJp0mVwL_P5fJ8XDGfRp0MNio" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjg5MjgwNiwiZXhwIjoyMDMyNDY4ODA2fQ.KR9rA6D_LZDx8pGlrM2CQzY5tQr7_w3nVXu4HpJkXoE" | npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

echo "Adding DATABASE_URL..."
echo "postgresql://postgres:BLvm0cs3qNqHCg0M@db.lqhopwohuddhapkhhikf.supabase.co:5432/postgres" | npx vercel env add DATABASE_URL production

echo "Adding NEXTAUTH_SECRET..."
echo "binaa_super_secret_key_2025" | npx vercel env add NEXTAUTH_SECRET production

echo "Adding NODE_ENV..."
echo "production" | npx vercel env add NODE_ENV production

echo "✅ All environment variables added!"
echo "🔄 Triggering production deployment..."

# Redeploy
npx vercel --prod

echo ""
echo "🎉 Setup complete!"
echo "📋 Next steps:"
echo "1. Update Supabase URL configuration (see URGENT_VERCEL_FIX.md)"
echo "2. Test login at: $VERCEL_URL/login"
