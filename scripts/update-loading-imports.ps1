# PowerShell script to update LoadingSpinner imports
$files = Get-ChildItem -Path "src" -Recurse -Filter "*.tsx" | Where-Object { $_.FullName -notmatch "unified-loading" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "import LoadingSpinner from '@/core/shared/components/ui/loading-spinner';") {
        $newContent = $content -replace "import LoadingSpinner from '@/core/shared/components/ui/loading-spinner';", "import { LoadingSpinner } from '@/core/shared/components/ui/unified-loading';"
        Set-Content $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "LoadingSpinner import update completed!" -ForegroundColor Cyan
