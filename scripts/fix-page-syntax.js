// scripts/fix-page-syntax.js
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const projectRoot = process.cwd()

// جميع ملفات page.tsx
const pattern = 'src/app/**/page.tsx'
const files = glob.sync(pattern, { cwd: projectRoot, absolute: true })

files.forEach((file) => {
  const rel = path.relative(projectRoot, file)
  let content = fs.readFileSync(file, 'utf8')

  // 1) أضف فاصلة منقوطة لأي import لا ينتهي بها
  content = content.replace(/^(\s*import\s.+?)(?<!;)\s*$/gm, '$1;')

  // 2) أجبر export default على سطر مستقل
  content = content.replace(/\s*(export\s+default\s+)/g, '\n$1')

  // 3) قلل الفواصل المتكررة لأكثر من سطرين
  content = content.replace(/\n{3,}/g, '\n\n')

  fs.writeFileSync(file, content, 'utf8')
  console.log(`🔧 Fixed syntax in ${rel}`)
})

console.log('\n✅ Syntax fixes applied to all page.tsx files.')
