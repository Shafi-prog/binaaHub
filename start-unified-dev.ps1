# Start Unified Medusa Server & Next.js Development Script (PowerShell)
# This script starts both the unified Medusa server and Next.js frontend

Write-Host "🚀 Starting Unified Medusa & Next.js Development Environment" -ForegroundColor Green
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

try {
    # Start Medusa Unified Server
    Write-Host "📦 Starting Medusa Unified Server (Port 9000)..." -ForegroundColor Cyan
    $MedusaJob = Start-Job -ScriptBlock {
        Set-Location "c:\Users\hp\BinnaCodes\binna\medusa-develop\packages\medusa"
        node unified-medusa-server.js
    }
    Write-Host "   ✅ Medusa Server Job ID: $($MedusaJob.Id)" -ForegroundColor Green

    # Wait a moment for Medusa to start
    Start-Sleep -Seconds 3

    # Start Next.js Development Server  
    Write-Host "⚡ Starting Next.js Development Server (Port 3000)..." -ForegroundColor Cyan
    $NextjsJob = Start-Job -ScriptBlock {
        Set-Location "c:\Users\hp\BinnaCodes\binna"
        npm run dev
    }
    Write-Host "   ✅ Next.js Server Job ID: $($NextjsJob.Id)" -ForegroundColor Green

    Write-Host ""
    Write-Host "🎉 Both servers are starting up!" -ForegroundColor Green
    Write-Host "📍 Medusa Unified Server: http://localhost:9000" -ForegroundColor Yellow
    Write-Host "   🛒 Store API: http://localhost:9000/store/products" -ForegroundColor White
    Write-Host "   👨‍💼 Admin Dashboard: http://localhost:9000/admin" -ForegroundColor White
    Write-Host "   ❤️  Health Check: http://localhost:9000/health" -ForegroundColor White
    Write-Host ""
    Write-Host "📍 Next.js Frontend: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "   🎯 Medusa Demo: http://localhost:3000/medusa-demo" -ForegroundColor White
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
