# VS Code and Development Server Cleanup Script

Write-Host "Starting cleanup process..." -ForegroundColor Green

# Kill Node.js processes
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✓ Node.js processes terminated" -ForegroundColor Green
} catch {
    Write-Host "ℹ No Node.js processes found" -ForegroundColor Yellow
}

# Kill Next.js processes
try {
    taskkill /F /IM "next.exe" 2>$null
    Write-Host "✓ Next.js processes terminated" -ForegroundColor Green
} catch {
    Write-Host "ℹ No Next.js processes found" -ForegroundColor Yellow
}

# Clean up ports 3000-3010
Write-Host "Cleaning up development ports..." -ForegroundColor Blue
for ($port = 3000; $port -le 3010; $port++) {
    try {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Silently continue if port is not in use
    }
}
Write-Host "✓ Ports cleaned up" -ForegroundColor Green

# Clean up temporary files
$tempPaths = @(
    ".next",
    "node_modules/.cache",
    "src/tsconfig.tsbuildinfo"
)

foreach ($path in $tempPaths) {
    if (Test-Path $path) {
        try {
            Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "✓ Cleaned: $path" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Could not clean: $path" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n🎉 Cleanup completed successfully!" -ForegroundColor Green
Write-Host "You can now safely close VS Code." -ForegroundColor Cyan

# Optional: Close VS Code processes (uncomment if needed)
# Write-Host "`nClosing VS Code processes..." -ForegroundColor Blue
# Get-Process -Name "Code" -ErrorAction SilentlyContinue | Stop-Process -Force
# Write-Host "✓ VS Code closed" -ForegroundColor Green
