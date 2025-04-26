# fix-app-pages.ps1
# سيزيل أي import لملفات .css ويُضيف export const dynamic = 'force-dynamic' 
# في أعلى كل page.tsx (عدا layout.tsx).

# تأكد أنّ المسار هو جذر المشروع
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

Get-ChildItem -Path .\src\app -Recurse -File -Include *.tsx |
  Where-Object { $_.Name -eq 'page.tsx' } |
  ForEach-Object {
    $file = $_.FullName
    $lines = Get-Content -LiteralPath $file

    # 1) إزالة أي استيراد لملفات CSS
    $filtered = $lines | Where-Object { $_ -notmatch '^\s*import\s+["''].*\.css["'']' }

    # 2) إضافة السطر في أول الملف إن لم يكن موجوداً
    if ($filtered[0] -notmatch "^export const dynamic") {
      $filtered = @("export const dynamic = 'force-dynamic';", "") + $filtered
    }

    # 3) كتابة المحتوى المعدَّل
    Set-Content -LiteralPath $file -Value $filtered -Encoding utf8
    Write-Host "✔️ Fixed $file"
  }
