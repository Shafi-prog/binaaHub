# Start Unified Binna Platform with Integrated Medusa (PowerShell)
# This script starts both the Medusa backend and the unified Next.js frontend at localhost:3000

Write-Host "🚀 Starting Unified Binna Platform with Integrated Medusa" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Green

# Function to cleanup background processes
function Cleanup {
    Write-Host "🛑 Shutting down servers..." -ForegroundColor Yellow
    if ($MedusaJob) { Stop-Job $MedusaJob -Force; Remove-Job $MedusaJob -Force }
    if ($NextjsJob) { Stop-Job $NextjsJob -Force; Remove-Job $NextjsJob -Force }
    exit 0
}

# Register cleanup on Ctrl+C
$null = Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {    # Start Mock Medusa Backend Server (for API endpoints)
    Write-Host "📦 Starting Mock Medusa Backend Server (Port 9000)..." -ForegroundColor Cyan
    $MedusaJob = Start-Job -ScriptBlock {
        Set-Location "c:\Users\hp\BinnaCodes\binna"
        node mock-medusa-server.js
    }
    Write-Host "   ✅ Mock Medusa Backend Job ID: $($MedusaJob.Id)" -ForegroundColor Green    # Wait a moment for servers to start
    Start-Sleep -Seconds 5

    # Setup store user
    Write-Host "👤 Setting up store user..." -ForegroundColor Cyan
    $SetupUserJob = Start-Job -ScriptBlock {
        Set-Location "c:\Users\hp\BinnaCodes\binna"
        node setup-local-store-user.js
    }
    Wait-Job $SetupUserJob | Out-Null
    Receive-Job $SetupUserJob
    Remove-Job $SetupUserJob

    # Start Unified Next.js Frontend with Medusa Integration
    Write-Host "⚡ Starting Unified Next.js Frontend (Port 3000)..." -ForegroundColor Cyan
    $NextjsJob = Start-Job -ScriptBlock {
        Set-Location "c:\Users\hp\BinnaCodes\binna"
        npm run dev:unified
    }
    Write-Host "   ✅ Unified Frontend Job ID: $($NextjsJob.Id)" -ForegroundColor Green    Write-Host ""
    Write-Host "🎉 Unified Binna Platform is starting up!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 UNIFIED PLATFORM: http://localhost:3000" -ForegroundColor Yellow -BackgroundColor Black
    Write-Host "   🛒 User Storefront: http://localhost:3000/store/marketplace" -ForegroundColor White
    Write-Host "   👨‍💼 Store Admin: http://localhost:3000/store/medusa/admin" -ForegroundColor White
    Write-Host "   📊 Store Dashboard: http://localhost:3000/store/dashboard" -ForegroundColor White
    Write-Host "   � Main Platform: http://localhost:3000" -ForegroundColor White
    Write-Host "   🔐 Login: http://localhost:3000/login" -ForegroundColor White
    Write-Host ""
    Write-Host "📍 Mock Medusa Backend (API only): http://localhost:9000" -ForegroundColor Cyan
    Write-Host "   🛒 Store API: http://localhost:9000/store/products" -ForegroundColor Gray
    Write-Host "   👨‍💼 Admin API: http://localhost:9000/admin/products" -ForegroundColor Gray
    Write-Host "   ❤️  Health Check: http://localhost:9000/health" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔐 TEST CREDENTIALS:" -ForegroundColor Magenta
    Write-Host "   📧 Email: store@store.com" -ForegroundColor Green
    Write-Host "   🔑 Password: store123" -ForegroundColor Green
    Write-Host "   🏪 Account Type: Store Owner" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 FEATURES INTEGRATED:" -ForegroundColor Magenta
    Write-Host "   ✅ User shopping experience at localhost:3000" -ForegroundColor Green
    Write-Host "   ✅ Store admin dashboard at localhost:3000" -ForegroundColor Green
    Write-Host "   ✅ Medusa full e-commerce features (mock API)" -ForegroundColor Green
    Write-Host "   ✅ Local authentication system" -ForegroundColor Green
    Write-Host "   ✅ Single server deployment" -ForegroundColor Green
    Write-Host "   ✅ 5 sample products with variants" -ForegroundColor Green
    Write-Host "   ✅ 3 sample orders" -ForegroundColor Green
    Write-Host "   ✅ Multi-region support (USD/SAR)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 QUICK START:" -ForegroundColor Yellow
    Write-Host "   1. Go to http://localhost:3000/login" -ForegroundColor White
    Write-Host "   2. Login with store@store.com / store123" -ForegroundColor White
    Write-Host "   3. Access admin at /store/medusa/admin" -ForegroundColor White
    Write-Host "   4. Browse products at /store/marketplace" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red
    Write-Host "===========================================================" -ForegroundColor Green

    # Monitor jobs and show output
    while ($MedusaJob.State -eq "Running" -or $NextjsJob.State -eq "Running") {
        # Show any output from jobs
        $MedusaOutput = Receive-Job $MedusaJob -Keep
        $NextjsOutput = Receive-Job $NextjsJob -Keep
        
        if ($MedusaOutput) {
            Write-Host "📦 Medusa: $MedusaOutput" -ForegroundColor Blue
        }
        if ($NextjsOutput) {
            Write-Host "⚡ Next.js: $NextjsOutput" -ForegroundColor Magenta
        }
        
        Start-Sleep -Seconds 1
    }
}
catch {
    Write-Host "❌ Error occurred: $_" -ForegroundColor Red
}
finally {
    Cleanup
}
