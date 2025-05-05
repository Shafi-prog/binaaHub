// scripts/createStoreStructure.js
const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '../src/app/store');

// مسارات المتجر المقترحة + نظام الرصيد والكود الترويجي
const folders = [
  'dashboard',
  'products',
  'orders',
  'profile',
  'warranties',
];

folders.forEach(folder => {
  const fullPath = path.join(base, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    fs.writeFileSync(path.join(fullPath, 'page.tsx'), `export default function Page() {
  return <main className='p-4'>${folder} page</main>;
}`);
    console.log(`✅ Created: ${fullPath}`);
  } else {
    console.log(`⚠️ Already exists: ${fullPath}`);
  }
});
