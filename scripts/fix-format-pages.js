import fs from 'fs'
import path from 'path'
import glob from 'glob'

const files = glob.sync('src/app/**/page.tsx')

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8')

  // 1. تأكد من وجود فاصلة منقوطة بعد كل import مفقود
  content = content.replace(/(import[^;\n]+)(\n|$)/g, '$1;$2')

  // 2. أضف فاصلة منقوطة بعد تعريف الثوابت إذا لم توجد
  content = content.replace(
    /(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*([^;\n]+)(\n|$)/g,
    (match, keyword, name, value, newline) => {
      if (value.trim().endsWith('}') || value.trim().endsWith(']') || value.trim().endsWith(')')) {
        return `${keyword} ${name} = ${value};${newline}`
      }
      return match
    },
  )

  // 3. تأكد أن تعاريف الفنكشن تبدأ بسطر منفصل عن الكود داخلها
  content = content.replace(/export default async function (\w+)\(\) \{\s+/g, (match, name) => {
    return `export default async function ${name}() {\n  `
  })

  // 4. نظف المسافات الغريبة
  content = content.replace(/\s{2,}/g, ' ')

  // 5. تأكد من أن كل المكونات يتم إغلاقها بشكل صحيح
  content = content.replace(/>(\s*)<\//g, '>\n<$2/')

  fs.writeFileSync(file, content, 'utf8')
  console.log(`✅ Formatted ${file}`)
})

console.log('\n🎯 All page.tsx files formatted successfully!')
