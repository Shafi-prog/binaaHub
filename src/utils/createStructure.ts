import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '../src/app');

const folders = [
  '(auth)/login',
  '(auth)/signup',
  '(user)/profile',
  '(user)/projects',
  '(user)/orders',
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

folders.forEach((folder) => {
  const fullPath = path.join(root, folder);
  ensureDir(fullPath);
  const pagePath = path.join(fullPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    try {
      fs.writeFileSync(
        pagePath,
        `export default function Page() {
    return <div className="p-8">🚧 ${folder} page</div>
  }`,
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
      `import './globals.css';
  import { Tajawal } from 'next/font/google';
  import type { Metadata } from 'next';

  const font = Tajawal({ subsets: ['arabic'], weight: '400' });

  export const metadata: Metadata = {
    title: 'BinaaHub',
    description: 'منصة البناء بدون عناء',
  };

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="ar" dir="rtl">
        <body className={font.className}>{children}</body>
      </html>
    );
  }`,
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
      `export default function Home() {
    return <main className="p-10 text-center text-2xl">مرحبًا بك في BinaaHub 🚀</main>
  }`,
      'utf-8'
    );
    console.log('🏠 Home page created');
  } catch (error) {
    console.error('❌ Error creating Home page:', error);
  }
}
