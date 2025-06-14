# Vercel Environment Variables Update Script
# Run this after getting your new Supabase credentials

Write-Host "🚀 Updating Vercel Environment Variables for Binaa ERP" -ForegroundColor Green
Write-Host ""

# Check if vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "📋 This script will update your Vercel environment variables." -ForegroundColor Yellow
Write-Host "Make sure you have your new Supabase credentials ready!" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Do you want to continue? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "🗑️  Removing old environment variables..." -ForegroundColor Blue

# Remove old environment variables
$varsToRemove = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY", 
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL"
)

foreach ($var in $varsToRemove) {
    Write-Host "   Removing $var..." -ForegroundColor Gray
    vercel env rm $var production --yes 2>$null
}

Write-Host ""
Write-Host "➕ Adding new environment variables..." -ForegroundColor Blue
Write-Host "Please enter your new Supabase credentials when prompted:" -ForegroundColor Yellow
Write-Host ""

# Add new environment variables
Write-Host "1️⃣  Setting NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Cyan
Write-Host "   Example: https://abcdefghijklmnop.supabase.co" -ForegroundColor Gray
vercel env add NEXT_PUBLIC_SUPABASE_URL production

Write-Host ""
Write-Host "2️⃣  Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Cyan
Write-Host "   This is the 'anon' key from your Supabase API settings" -ForegroundColor Gray
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

Write-Host ""
Write-Host "3️⃣  Setting SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Cyan
Write-Host "   This is the 'service_role' key from your Supabase API settings" -ForegroundColor Gray
vercel env add SUPABASE_SERVICE_ROLE_KEY production

Write-Host ""
Write-Host "4️⃣  Setting DATABASE_URL..." -ForegroundColor Cyan
Write-Host "   Example: postgresql://postgres:password@db.abcdefghijklmnop.supabase.co:5432/postgres" -ForegroundColor Gray
vercel env add DATABASE_URL production

Write-Host ""
Write-Host "✅ Environment variables updated successfully!" -ForegroundColor Green
Write-Host ""

$deploy = Read-Host "Do you want to deploy to production now? (y/N)"
if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Deploying to production..." -ForegroundColor Blue
    vercel --prod
    
    Write-Host ""
    Write-Host "🎉 Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Test your login at your Vercel URL" -ForegroundColor White
    Write-Host "2. Check that all AI features work" -ForegroundColor White
    Write-Host "3. Verify the Smart Construction Calculator on the landing page" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "💡 Don't forget to deploy when ready:" -ForegroundColor Yellow
    Write-Host "   vercel --prod" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🔍 To test your local setup, run:" -ForegroundColor Cyan
Write-Host "   node supabase-health-check.js" -ForegroundColor Gray
