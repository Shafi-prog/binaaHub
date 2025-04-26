# fix-component-types.ps1
# يضبط نوعية كل صفحة: إذا تستورد next/headers تصبح Server Component،
# وإلا تُضاف لها "use client" + dynamic

Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

Get-ChildItem -Path .\src\app -Recurse -File -Filter page.tsx |
ForEach-Object {
  $file = $_.FullName
  $lines = Get-Content -LiteralPath $file

  if ($lines -match 'import\s+.*next/headers') {
    # Server Component: امسح أي توجيه use client و export dynamic
    $new = $lines | Where-Object {
      $_ -notmatch "^\s*'use client'" -and $_ -notmatch "^\s*export const dynamic"
    }
  } else {
    # Client Component: أزل التوجيهات القديمة ثم أعد إضافتها في البداية
    $body = $lines | Where-Object {
      $_ -notmatch "^\s*'use client'" -and $_ -notmatch "^\s*export const dynamic"
    }
    $new = @(
      "'use client'",
      "export const dynamic = 'force-dynamic';",
      ""
    ) + $body
  }

  Set-Content -LiteralPath $file -Value $new -Encoding utf8
  Write-Host "✔️ Fixed component type in $file"
}
