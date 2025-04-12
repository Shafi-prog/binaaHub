# إعداد الترميز UTF-8 للجلسة
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

# تحديد المجلدات التي سيتم تجاهلها
$ignore = "node_modules|.next|.turbo|.git|.vscode|public|.DS_Store"

# التحقق من وجود مكتبة tree-node-cli، تثبيتها إذا لم تكن موجودة
if (-not (Get-Command "npx" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ NPX غير مثبت، الرجاء تثبيت Node.js أولاً." -ForegroundColor Red
    exit
}

# توليد شجرة المشروع وتصديرها لملف
npx --yes tree-node-cli -d -I $ignore > TREE.md

Write-Host "✅ تم توليد ملف TREE.md بنجاح بصيغة UTF-8" -ForegroundColor Green
