[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

# generate-tree.ps1 - من جذر المشروع فقط

$treeFile = "TREE.md"

# تحديد المجلدات التي يجب تجاهلها
$ignoreList = @("node_modules", ".next", ".turbo", ".git", ".vscode", "public", ".DS_Store")
$ignore = $ignoreList -join "|"

# التحقق من توفر npx
$npxExists = Get-Command npx -ErrorAction SilentlyContinue
if (-not $npxExists) {
    Write-Host "ERROR: NPX is not installed. Please install Node.js first." -ForegroundColor Red
    exit
}

# توليد الشجرة واستثناء المجلدات
npx --yes tree-node-cli -d -I $ignore | Out-File -FilePath $treeFile -Encoding utf8

Write-Host "TREE.md generated successfully." -ForegroundColor Green