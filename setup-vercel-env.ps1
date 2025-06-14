# PowerShell script to setup Vercel environment variables

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Cyan

# Your Vercel deployment URL
$VERCEL_URL = "https://binaa-dytm4zjek-shafi-projs-projects.vercel.app"

Write-Host "📋 Adding environment variables for: $VERCEL_URL" -ForegroundColor Yellow

# Function to add environment variable
function Add-VercelEnv {
    param($Name, $Value)
    Write-Host "Adding $Name..." -ForegroundColor Green
    $Value | npx vercel env add $Name production
}

# Add all required environment variables
Add-VercelEnv "NEXTAUTH_URL" $VERCEL_URL
Add-VercelEnv "NEXT_PUBLIC_APP_URL" $VERCEL_URL
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" "https://lqhopwohuddhapkhhikf.supabase.co"
Add-VercelEnv "NEXT_PUBLIC_SUPABASE_ANON_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4OTI4MDYsImV4cCI6MjAzMjQ2ODgwNn0.vCxGDrVNvKA7OhwcYZLJp0mVwL_P5fJ8XDGfRp0MNio"
Add-VercelEnv "SUPABASE_SERVICE_ROLE_KEY" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaG9wd29odWRkaGFwa2hoaWtmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjg5MjgwNiwiZXhwIjoyMDMyNDY4ODA2fQ.KR9rA6D_LZDx8pGlrM2CQzY5tQr7_w3nVXu4HpJkXoE"
Add-VercelEnv "DATABASE_URL" "postgresql://postgres:BLvm0cs3qNqHCg0M@db.lqhopwohuddhapkhhikf.supabase.co:5432/postgres"
Add-VercelEnv "NEXTAUTH_SECRET" "binaa_super_secret_key_2025"
Add-VercelEnv "NODE_ENV" "production"

Write-Host "`n✅ All environment variables added!" -ForegroundColor Green
Write-Host "🔄 Triggering production deployment..." -ForegroundColor Cyan

# Redeploy
npx vercel --prod

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Update Supabase URL configuration (see URGENT_VERCEL_FIX.md)" -ForegroundColor White
Write-Host "2. Test login at: $VERCEL_URL/login" -ForegroundColor White
