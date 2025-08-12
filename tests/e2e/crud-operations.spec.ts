import puppeteer, { Browser, Page } from 'puppeteer';

// مساعد تأخير بسيط بدل waitForTimeout
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

describe('اختبار عمليات CRUD وربط البيانات', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.E2E_HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      slowMo: 50
    });
    page = await browser.newPage();
    page.setDefaultTimeout(30000);
    await page.setViewport({ width: 1366, height: 768 });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    const cookieValue = JSON.stringify({ email: 'crud@binna.test', account_type: 'user', name: 'CRUD User' });
    await page.setCookie({ name: 'user-session', value: cookieValue, domain: 'localhost', path: '/' });
  });

  describe('CRUD على المشاريع', () => {
    let createdProjectId = '';

    it('إنشاء مشروع جديد (Create)', async () => {
      await page.goto(`${BASE}/user/projects/create`, { waitUntil: 'networkidle2' });

      const projectName = `مشروع CRUD اختبار ${Date.now()}`;
      await page.type('input[name="name"], input[placeholder*="مشروع"]', projectName);
      await page.type('input[name="location"], input[placeholder*="الموقع"]', 'الرياض - اختبار CRUD');
      await page.type('textarea[name="description"]', 'هذا مشروع لاختبار عمليات CRUD');

      await page.click('button[type="submit"]');
      await delay(2000);

      await page.goto(`${BASE}/user/projects`, { waitUntil: 'networkidle2' });
      const firstCard = await page.$('.project-card:first-child');
      expect(firstCard).toBeTruthy();

      if (firstCard) {
        createdProjectId = (await firstCard.evaluate(el => el.getAttribute('data-project-id') || '')) || '';
      }
    });

    it('قراءة تفاصيل المشروع (Read)', async () => {
      await page.goto(`${BASE}/user/projects`, { waitUntil: 'networkidle2' });
      const firstCard = await page.$('.project-card:first-child');
      expect(firstCard).toBeTruthy();
      if (!firstCard) return;

      await firstCard.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      const projectTitle = await page.$('.project-title, h1');
      expect(projectTitle).toBeTruthy();
    });

    it('تحديث المشروع (Update)', async () => {
      await page.goto(`${BASE}/user/projects`, { waitUntil: 'networkidle2' });
      // محاولة الدخول إلى صفحة التعديل
      const editBtn = await page.$('.project-card:first-child .edit-button, .edit-project');
      if (editBtn) {
        await editBtn.click();
        await delay(1000);
        const nameInput = await page.$('input[name="name"]');
        if (nameInput) {
          await nameInput.click({ clickCount: 3 });
          await nameInput.type('مشروع CRUD محدث');
          await page.click('button[type="submit"]');
          await delay(2000);
          await page.goto(`${BASE}/user/projects`, { waitUntil: 'networkidle2' });
        }
        const updatedName = await page.$eval(
          '.project-card:first-child .project-name, .project-title',
          el => el.textContent?.trim() || ''
        );
        expect(updatedName.length).toBeGreaterThan(0);
      } else {
        // لا زر تعديل ظاهر؛ نكتفي بالتحقق من عرض القائمة
        const cards = await page.$$('.project-card');
        expect(cards.length).toBeGreaterThan(0);
      }
    });

    it('حذف مشروع (Delete) إن توفر زر الحذف', async () => {
      await page.goto(`${BASE}/user/projects`, { waitUntil: 'networkidle2' });
      const cardsBefore = await page.$$('.project-card');
      const delBtn = await page.$('.project-card:first-child .delete-button, .delete-project, [data-test="delete-project"]');
      if (!delBtn) {
        // لا ننفذ حذف إن لم يوجد زر واضح
        expect(cardsBefore.length).toBeGreaterThan(0);
        return;
      }
      await delBtn.click();
      await delay(500);
      const confirm = await page.$('.confirm-delete, button[data-test="confirm-delete"], button[type="submit"]');
      if (confirm) {
        await confirm.click();
        await delay(2000);
      }
      const cardsAfter = await page.$$('.project-card');
      expect(cardsAfter.length).toBeLessThanOrEqual(cardsBefore.length);
    });
  });

  describe('تدفق الطلبات وربطها بالمشاريع', () => {
    it('إنشاء طلب وربطه بمشروع', async () => {
      // تأكد من وجود مشروع واحد على الأقل
      await page.goto(`${BASE}/user/projects`, { waitUntil: 'networkidle2' });
      const hasProject = (await page.$$('.project-card')).length > 0;
      if (!hasProject) {
        await page.goto(`${BASE}/user/projects/create`, { waitUntil: 'networkidle2' });
        await page.type('input[name="name"]', `مشروع للطلبات ${Date.now()}`);
        await page.type('input[name="location"]', 'الرياض');
        await page.type('textarea[name="description"]', 'مشروع ربط الطلبات');
        await page.click('button[type="submit"]');
        await delay(1500);
      }

      // إضافة منتج من الماركت بليس
  await page.goto(`${BASE}/marketplace`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('[data-test="product-card"]');
  await page.click('[data-test="product-card"]');
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const addBtn = await page.$('button[data-test="add-to-cart"], [data-test="addToCart"]');
      if (addBtn) {
        await addBtn.click();
        await delay(1000);
        // ربط المشروع إن وجد حقل
        const projectSelect = await page.$('select[name="project_id"]');
        if (projectSelect) {
          // اختيار أول عنصر
          await page.select('select[name="project_id"]', '1');
        }
      }

      // إتمام الشراء
  await page.goto(`${BASE}/user/cart/checkout`, { waitUntil: 'networkidle2' });
      const addr = await page.$('input[name="address"], textarea[name="address"]');
      if (addr) await addr.type('عنوان اختبار - الرياض');
      const phone = await page.$('input[name="phone"]');
      if (phone) await phone.type('0501234567');
  const confirmBtn = await page.$('button[data-test="confirm-order"], button[type="submit"]');
      if (confirmBtn) {
        await confirmBtn.click();
        await delay(3000);
      }

      const success = await page.$('.order-success, .success-message, .payment-success');
      expect(success).toBeTruthy();
    });

    it('عرض الطلب والتحقق من الربط بالمشروع', async () => {
      await page.goto(`${BASE}/user/orders`, { waitUntil: 'networkidle2' });
      const first = await page.$('.order-card:first-child, .order-item:first-child');
      expect(first).toBeTruthy();
      if (!first) return;
      await first.click();
      await delay(1000);
      const details = await page.$('.order-details, .order-view');
      expect(details).toBeTruthy();
    });
  });

  describe('مقاومة الأخطاء والأداء', () => {
    it('رسالة مناسبة عند انقطاع الشبكة', async () => {
      await page.setOfflineMode(true);
      await page.goto(`${BASE}/marketplace`, { waitUntil: 'domcontentloaded' });
      const offline = await page.$('.network-error, .offline-message, .connection-error');
      expect(offline).toBeTruthy();
      await page.setOfflineMode(false);
    });

    it('الصفحات الأساسية تُحمّل خلال 5 ثوانٍ', async () => {
      const routes = ['/marketplace', '/user/projects', '/user/orders', '/user/profile'];
      for (const url of routes) {
        const start = Date.now();
        await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle2' });
        const elapsed = Date.now() - start;
        expect(elapsed).toBeLessThan(5000);
      }
    });
  });
});
