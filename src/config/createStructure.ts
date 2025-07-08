// @ts-nocheck
// سكربت إنشاء هيكل مجلدات وصفحات Next.js بنمط CommonJS فقط
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const root = path.resolve(__dirname, '../app');

const folders = [
  '(auth)/login',
  '(auth)/signup',
  'user/profile',
  'user/projects',
  'user/orders',
  '(dashboard)',
  '(ai)',
  '(finance)',
  '(marketing)',
  '(services)',
  '(public)',
  'projects/[id]',
];

const ensureDir = (dir: string) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('✅ Created:', dir);
    }
  } catch (error) {
    console.error('❌ Error creating directory:', dir, error);
  }
};

function createStructure() {
  folders.forEach((folder) => {
    const fullPath = path.join(root, folder);
    ensureDir(fullPath);
    const pagePath = path.join(fullPath, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      try {
        fs.writeFileSync(
          pagePath,
          `export default function Page() {\n  return <div className="p-8">🚧 ${folder} page</div>\n}`,
          'utf-8'
        );
        console.log('📝 Stub page.tsx:', pagePath);
      } catch (error) {
        console.error('❌ Error creating file:', pagePath, error);
      }
    }
  });

  const layoutPath = path.join(root, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    try {
      fs.writeFileSync(
        layoutPath,
        `import './globals.css';\nimport { Tajawal } from 'next/font/google';\nimport type { Metadata } from 'next';\n\nconst font = Tajawal({ subsets: ['arabic'], weight: '400' });\n\nexport const metadata: Metadata = {\n  title: 'BinaaHub',\n  description: 'منصة البناء بدون عناء',\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="ar" dir="rtl">\n      <body className={font.className}>{children}</body>\n    </html>\n  );\n}`,
        'utf-8'
      );
      console.log('🧱 layout.tsx created');
    } catch (error) {
      console.error('❌ Error creating layout.tsx:', error);
    }
  }

  const rootPage = path.join(root, 'page.tsx');
  if (!fs.existsSync(rootPage)) {
    try {
      fs.writeFileSync(
        rootPage,
        `export default function Home() {\n  return <main className="p-10 text-center text-2xl">مرحبًا بك في BinaaHub 🚀</main>\n}`,
        'utf-8'
      );
      console.log('🏠 Home page created');
    } catch (error) {
      console.error('❌ Error creating Home page:', error);
    }
  }
}

createStructure();


