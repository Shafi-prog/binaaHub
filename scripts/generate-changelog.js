// scripts/generate-changelog.js
const fs = require('fs')
const content = `# 📦 Changelog

## [Unreleased]

### ✨ تحسينات TailwindCSS وبيئة التطوير

- ✅ دمج tailwind.css داخل globals.css لتفادي التكرار
- ✅ تفعيل Tailwind v4 باستخدام @tailwindcss/postcss
- ✅ إصلاح تصميم الصفحة وخطوط RTL
- ✅ حذف الملفات المكررة وتحسين استيراد المكونات
- ✅ إعداد ESLint و Prettier و VSCode

`

fs.writeFileSync('CHANGELOG.md', content, 'utf8')
console.log('✅ CHANGELOG.md created')
