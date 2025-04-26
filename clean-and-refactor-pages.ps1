# clean-and-refactor-pages.ps1
Set-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)

# يعالج كل page.tsx
Get-ChildItem -Path .\src\app -Recurse -File -Filter page.tsx |
ForEach-Object {
  $path  = $_.FullName
  $lines = Get-Content -LiteralPath $path

  $out = @()
  $skipIcons = $false
  foreach ($line in $lines) {
    # 1) حذف import dynamic
    if ($line -match "^\s*import\s+dynamic") { continue }

    # 2) بدء تخطي كتلة FeatureIcons
    if ($line -match "const\s+FeatureIcons\s*=") {
      $skipIcons = $true
      continue
    }
    # 3) إذا كنا داخل كتلة FeatureIcons، ننتهي عند أول '}' في الهامش الأيسر
    if ($skipIcons) {
      if ($line -match "^\s*\}") { $skipIcons = $false }
      continue
    }

    # 4) نجمع السطر إن لم يتم تخطيه
    $out += $line
  }

  # 5) إضافة import ClientIcon إذا غاب
  if ($out -notmatch "import .*ClientIcon") {
    # نحاول الإدراج بعد import next/link إن وجد
    $idx = $out.FindIndex({ param($l) $l -match "^import\s+Link\s+from\s+'next/link'" })
    if ($idx -ge 0) {
      $out = $out[0..$idx] + "import ClientIcon from '@/components/ClientIcon'" + $out[($idx+1)..($out.Length-1)]
    } else {
      $out = "import ClientIcon from '@/components/ClientIcon'" + $out
    }
  }

  # 6) اكتب التعديلات
  Set-Content -LiteralPath $path -Value $out -Encoding utf8
  Write-Host "✔️ Refactored $path"
}

# 7) تحقق أنه لم يبق import dynamic
$leftovers = Select-String -Path .\src\app\**\page.tsx -Pattern "import\s+dynamic"
if ($leftovers) {
  Write-Host "⚠️ ما زال هناك استيرادات ديناميكيّة متبقيّة:"
  $leftovers | ForEach-Object { Write-Host "$($_.Path):$($_.LineNumber) $_.Line" }
} else {
  Write-Host "✅ لا توجد import dynamic في أي page.tsx"
}
