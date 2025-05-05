const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "../src/app");
const storeTarget = path.join(ROOT, "store");

// مجلدات المتجر المحتملة (أعدّل حسب مشروعك)
const storeFolders = [
  "(dashboard)",        // يحتوي بيانات مثل أسعار الحديد/الاسمنت
  "marketing",          // لو كانت تابعة للمتجر
                // إذا كان فيه صفحات المتجر الرئيسية
];

function moveFolder(oldRel, newRelBase) {
  const src = path.join(ROOT, oldRel);
  const dst = path.join(newRelBase, path.basename(oldRel));

  if (!fs.existsSync(src)) {
    console.warn(`⛔ Not found: ${src}`);
    return;
  }

  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.renameSync(src, dst);
  console.log(`✅ Moved: ${src} → ${dst}`);
}

storeFolders.forEach((folder) => moveFolder(folder, storeTarget));
