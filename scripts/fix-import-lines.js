// scripts/fix-import-lines.js
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const projectRoot = process.cwd()
const pattern = 'src/app/**/page.tsx'

// اجمع كل صفحات page.tsx
const files = glob.sync(pattern, { cwd: projectRoot, absolute: true })

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')

  // 1) إذا وُجد import متبوعًا بكود آخر على نفس السطر، افرض سطرًا جديدًا
  content = content.replace(/(from\s+['"][^'"]+['"])\s+(?=import\b)/g, '$1\n')

  // 2) تأكد أن export default يبدأ على سطر مستقل
  content = content.replace(/\s+(export\s+default\b)/g, '\n$1')

  // 3) حذف أي أسطر فارغة زائدة (مثلاً 3 فواصل سطر متتالية => 2 فقط)
  content = content.replace(/\n{3,}/g, '\n\n')

  // اكتب التعديلات
  fs.writeFileSync(file, content, 'utf8')
  console.log(`🔧 Fixed imports in ${path.relative(projectRoot, file)}`)
})

console.log('\n✅ Import lines normalized in all page.tsx.')
