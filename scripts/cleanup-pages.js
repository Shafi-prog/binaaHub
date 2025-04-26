// scripts/cleanup-pages.js
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const projectRoot = process.cwd()
const pattern = 'src/app/**/page.tsx'

// اجمع كل صفحة page.tsx
const files = glob.sync(pattern, { cwd: projectRoot, absolute: true })

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')

  // 1) إزالة import dynamic
  content = content.replace(/^import\s+.*\bdynamic\b.*\r?\n/gm, '')

  // 2) إزالة كتلة FeatureIcons كاملة
  content = content.replace(/const\s+FeatureIcons\s*=\s*\{[\s\S]*?\};\r?\n/gm, '')

  // 3) إزالة أي use client أو export dynamic متروكين
  content = content.replace(/^\s*'use client';?\r?\n?/gm, '')
  content = content.replace(/^\s*export const dynamic\s*=\s*['"].*['"];\r?\n?/gm, '')

  fs.writeFileSync(file, content, 'utf8')
  console.log(`✔️ Cleaned ${path.relative(projectRoot, file)}`)
})

// 4) تحقق: لا import dynamic بعدها
const leftovers = files.filter((f) => {
  const txt = fs.readFileSync(f, 'utf8')
  return /\bimport\s+.*\bdynamic\b/.test(txt)
})

if (leftovers.length) {
  console.error('\n⚠️ Still found dynamic imports in:')
  leftovers.forEach((f) => console.error('   ' + path.relative(projectRoot, f)))
  process.exit(1)
} else {
  console.log('\n✅ All page.tsx files are clean of import dynamic.')
}
