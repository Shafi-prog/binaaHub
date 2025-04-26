// scripts/refactor-pages.js

const fs = require('fs')
const path = require('path')
const glob = require('glob')

const projectRoot = process.cwd()
const pattern = 'src/app/**/page.tsx'

// 1) ابحث عن كل صفحات page.tsx
glob(pattern, { cwd: projectRoot, absolute: true }, (err, files) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  files.forEach((file) => {
    let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
    let out = []
    let skipIcons = false

    // 2) حذف import dynamic وكتلة FeatureIcons
    for (let line of lines) {
      if (/^\s*import\s+.*\bdynamic\b/.test(line)) continue
      if (/^\s*const\s+FeatureIcons\s*=/.test(line)) {
        skipIcons = true
        continue
      }
      if (skipIcons) {
        if (/^\s*}\s*,?\s*$/.test(line)) {
          skipIcons = false
        }
        continue
      }
      out.push(line)
    }

    // 3) تأكد من import ClientIcon
    if (!out.some((l) => l.includes('ClientIcon'))) {
      // أدخل import بعد أول import موجود
      const idx = out.findIndex((l) => /^\s*import\s+/.test(l))
      const imp = "import ClientIcon from '@/components/ClientIcon'"
      if (idx >= 0) out.splice(idx + 1, 0, imp)
      else out.unshift(imp)
    }

    // 4) أعد كتابة الملف
    fs.writeFileSync(file, out.join('\n'), 'utf8')
    console.log(`✔️ Refactored ${path.relative(projectRoot, file)}`)
  })

  // 5) تأكد أنه لم يبق import dynamic
  const leftovers = []
  files.forEach((file) => {
    const txt = fs.readFileSync(file, 'utf8')
    if (/import\s+.*\bdynamic\b/.test(txt)) leftovers.push(file)
  })
  if (leftovers.length) {
    console.warn('\n⚠️ import dynamic remains in:')
    leftovers.forEach((f) => console.warn('   ' + path.relative(projectRoot, f)))
    process.exit(1)
  } else {
    console.log('\n✅ No `import dynamic` found in any page.tsx.')
  }
})
