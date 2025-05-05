// scripts/finalStructureReorg.js
const fs = require('fs');
const path = require('path');

const baseApp = path.join(__dirname, '../src/app');

// 🔁 إعادة توزيع مجلدات عامة من المتجر إلى المسار العام
const moveMap = [
  {
    from: 'store/dashboard/construction-data',
    to: 'public/construction-data'
  },
  {
    from: 'store/dashboard/material-prices',
    to: 'public/material-prices'
  }
];

// ✅ بنية المستخدم المفصلة
const userFolders = [
  'user/dashboard',
  'user/orders',
  'user/profile',
  'user/projects/[id]/edit',
  'user/services/design',
  'user/services/insurance',
  'user/services/supervision',
  'user/spending-tracking',
  'user/warranties',
  'user/balance',
  'user/invite-code/usage',
  'user/invite-code/commission'
];

// ✅ بنية المتجر المفصلة
const storeFolders = [
  'store/dashboard',
  'store/products',
  'store/profile',
  'store/orders',
  'store/warranties',
  'store/balance',
  'store/promo-code/usage',
  'store/promo-code/commission'
];

// 🚚 نقل المجلدات العامة
function moveFolders(mapList) {
  mapList.forEach(({ from, to }) => {
    const src = path.join(baseApp, from);
    const dst = path.join(baseApp, to);
    if (fs.existsSync(src)) {
      fs.mkdirSync(path.dirname(dst), { recursive: true });
      fs.renameSync(src, dst);
      console.log(`🚚 Moved: ${from} → ${to}`);
    }
  });
}

// 🧱 إنشاء البنية المطلوبة
function createFolders(folderList) {
  folderList.forEach(folder => {
    const fullPath = path.join(baseApp, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      fs.writeFileSync(path.join(fullPath, 'page.tsx'), `export default function Page() {
  return <main className='p-4'>${folder} page</main>;
}`);
      console.log(`✅ Created: ${folder}`);
    }
  });
}

// 🧹 حذف المجلدات غير المنظمة
function removeLegacyFolders() {
  const oldDirs = ["(ai)", "(services)", "(dashboard)", "(user)"];
  oldDirs.forEach(folder => {
    const target = path.join(baseApp, folder);
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`🗑️ Removed legacy: ${folder}`);
    }
  });
}

// 🔁 تنفيذ كل العمليات
moveFolders(moveMap);
createFolders(userFolders);
createFolders(storeFolders);
removeLegacyFolders();
