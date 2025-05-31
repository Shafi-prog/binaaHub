# VS Code Fix Script
Write-Host "Starting VS Code cleanup and fix..." -ForegroundColor Green

# Stop all Node.js processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Stop all npm processes
Write-Host "Stopping npm processes..." -ForegroundColor Yellow
Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill processes using common development ports
Write-Host "Freeing up development ports..." -ForegroundColor Yellow
$ports = @(3000, 3001, 3002, 3003, 5000, 8000, 8080)
foreach ($port in $ports) {
    try {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($process in $processes) {
            Stop-Process -Id $process.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Port not in use, continue
    }
}

# Clear VS Code workspace state
Write-Host "Clearing VS Code workspace state..." -ForegroundColor Yellow
$vscodeDir = "$env:APPDATA\Code\User\workspaceStorage"
if (Test-Path $vscodeDir) {
    Get-ChildItem $vscodeDir -Recurse -Filter "*.json" | Where-Object { $_.FullName -like "*binna*" } | Remove-Item -Force -ErrorAction SilentlyContinue
}

# Clear temporary files
Write-Host "Clearing temporary files..." -ForegroundColor Yellow
$tempPaths = @(
    "c:\Users\hp\BinnaCodes\binna\.next",
    "c:\Users\hp\BinnaCodes\binna\node_modules\.cache",
    "c:\Users\hp\BinnaCodes\binna\src\tsconfig.tsbuildinfo"
)

foreach ($path in $tempPaths) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Removed: $path" -ForegroundColor Gray
    }
}

# Reset npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
Set-Location "c:\Users\hp\BinnaCodes\binna"
npm cache clean --force 2>$null

Write-Host "Cleanup completed successfully!" -ForegroundColor Green
Write-Host "You can now restart VS Code safely." -ForegroundColor Cyan
