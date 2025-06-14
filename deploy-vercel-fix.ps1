# Vercel Deployment Fix Script (Windows)

Write-Host "🚀 Deploying Vercel Authentication Fixes..." -ForegroundColor Green

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

Write-Host "✅ Changes pushed to repository!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update environment variables in Vercel Dashboard"
Write-Host "2. Update Supabase site URL and redirect URLs"
Write-Host "3. Test login on your Vercel domain"
Write-Host ""
Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/lqhopwohuddhapkhhikf" -ForegroundColor Cyan
