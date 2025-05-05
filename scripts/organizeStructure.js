const fs = require("fs");
const path = require("path");

// الجذر الأساسي
const ROOT = path.join(__dirname, "../src/app");

// وجهات جديدة
const userTarget = path.join(ROOT, "user");
const storeTarget = path.join(ROOT, "store");

// مجلدات المستخدم
const userFolders = ["(user)/profile", "orders", "projects", "(services)", "(ai)"];
// مجلدات المتجر - يفترض تنقلها لاحقًا (اختياري)
const storeFolders = ["(dashboard)", "store"]; // مثلاً لو عندك /store/dashboard

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

// معالجة المستخدم
userFolders.forEach((folder) => moveFolder(folder, userTarget));

// معالجة المتجر (ممكن تفعلها لاحقًا)
// storeFolders.forEach((folder) => moveFolder(folder, storeTarget));
