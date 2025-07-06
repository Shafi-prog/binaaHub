# Protect Critical Documentation Files
# This PowerShell script sets up protection for important roadmap and documentation files

Write-Host "Setting up file protection for critical documentation..." -ForegroundColor Cyan

# Make critical files read-only in Windows
$criticalFiles = @(
    "PLATFORM_FEATURES_ROADMAP.md",
    "UNIFIED_PLATFORM_COMPLETE.md",
    "README.md", 
    "package.json",
    "platform-progress\PLATFORM_FEATURES_ROADMAP.md"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Set-ItemProperty -Path $file -Name IsReadOnly -Value $true
        Write-Host "Protected: $file" -ForegroundColor Green
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

# Check if git hooks directory exists
if (Test-Path ".git\hooks") {
    # Create pre-commit hook content
    $preCommitHook = @"
#!/bin/bash

# Check if critical files are being deleted
critical_files=(
    "PLATFORM_FEATURES_ROADMAP.md"
    "UNIFIED_PLATFORM_COMPLETE.md"
    "README.md"
    "package.json"
    "platform-progress/PLATFORM_FEATURES_ROADMAP.md"
)

for file in "$${critical_files[@]}"; do
    if git diff --cached --name-status | grep -q "^D.*$$file"; then
        echo "ERROR: Attempting to delete critical file: $$file"
        echo "If you really need to delete this file, use: git commit --no-verify"
        exit 1
    fi
done

echo "No critical files being deleted"
"@

    # Write the pre-commit hook
    $preCommitHook | Out-File -FilePath ".git\hooks\pre-commit" -Encoding UTF8
    Write-Host "Git pre-commit hook installed" -ForegroundColor Green
} else {
    Write-Host "Git repository not found - hooks not installed" -ForegroundColor Yellow
}

Write-Host "File protection setup complete!" -ForegroundColor Green
Write-Host "Protected files:" -ForegroundColor Cyan
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "   - $file (read-only)" -ForegroundColor White
    }
}
Write-Host "Git hooks added to prevent accidental deletion" -ForegroundColor Cyan
