// scripts/fix-imports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// الأسماء كما تظهر في المسارات
const modules = ['Button', 'Card', 'Badge', 'LogoutButton'];

const root = path.resolve(__dirname, '..');
const pattern = 'src/**/*.{ts,tsx}';

// نحاول إصلاح هذه الاستيرادات فقط
const regex = new RegExp(
  `import\\s+([A-Za-z_]\\w*)\\s+from\\s+['"]@/components/ui/(?:${modules.join('|')})['"]`,
  'g'
);

const files = glob.sync(pattern, { cwd: root, absolute: true });
console.log(`Found ${files.length} TS/TSX files under ${root}/src`);

files.forEach(file => {
  const src = fs.readFileSync(file, 'utf8');
  const updated = src.replace(regex, (_, comp) =>
    `import { ${comp} } from '@/components/ui'`
  );
  if (updated !== src) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`✔ Fixed imports in ${file}`);
  }
});

console.log('Done.');
