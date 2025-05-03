// scripts/fix-import-case.js
const fs = require('fs')
const path = require('path')
const glob = require('glob')

const baseDir = path.resolve(__dirname, '../src')
const targets = glob.sync(`${baseDir}/**/*.{ts,tsx}`, { nodir: true })

targets.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8')

  const fixed = content.replace(/@\/components\/ui\/(button|card|badge)/gi, (match, name) => {
    const properName = name.charAt(0).toUpperCase() + name.slice(1)
    return `@/components/ui/${properName}`
  })

  if (fixed !== content) {
    console.log(`✔️ Fixed imports in ${path.relative(baseDir, filePath)}`)
    fs.writeFileSync(filePath, fixed)
  }
})
