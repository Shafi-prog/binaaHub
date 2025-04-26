# remove-globals-css.ps1
# هذا السكربت يحذف أي استيراد لـ globals.css من كل ملفات page.tsx في src\app ما عدا layout.tsx

Get-ChildItem -Path .\src\app -Recurse -File -Filter page.tsx |
  Where-Object { .Name -ne 'layout.tsx' } |
  ForEach-Object {
    C:\Users\hp\BinnaCodes\New folder\binna\src\app\projects\[id]\edit\page.tsx = .FullName
    (Get-Content -LiteralPath C:\Users\hp\BinnaCodes\New folder\binna\src\app\projects\[id]\edit\page.tsx) |
      Where-Object {  -notmatch '^\s*import\s+["'']\.*\/globals\.css["'']' } |
      Set-Content -LiteralPath C:\Users\hp\BinnaCodes\New folder\binna\src\app\projects\[id]\edit\page.tsx
    Write-Host "✔️ Updated C:\Users\hp\BinnaCodes\New folder\binna\src\app\projects\[id]\edit\page.tsx"
  }
