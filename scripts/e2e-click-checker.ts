import puppeteer, { Browser, Page } from 'puppeteer';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const ROUTES = (process.env.E2E_ROUTES || '/,/marketplace,/user,/user/projects,/user/projects/create,/user/expenses').split(',');

async function clickAll(page: Page) {
  const selectors = ['button', 'a[role="button"]', '[data-test="btn"]'];
  for (const sel of selectors) {
    const els = await page.$$(sel);
    for (const el of els) {
      try {
        const box = await el.boundingBox();
        if (!box) continue;
        await el.click();
        await page.evaluate(() => new Promise(res => setTimeout(res, 50)));
      } catch {}
    }
  }
}

async function main() {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page: Page = await browser.newPage();
  // Use desktop viewport so the store sidebar (lg) is visible
  await page.setViewport({ width: 1366, height: 900 });
  page.setDefaultTimeout(20000);
  const results: Record<string, string> = {};
  const linkResults: Record<string, string> = {};

  for (const r of ROUTES) {
    const url = `${BASE}${r}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      // Special-case: /store redirects client-side to /store/dashboard
      if (r === '/store') {
        try {
          await page.waitForFunction(() => location.pathname.startsWith('/store/dashboard'), { timeout: 8000 });
        } catch {}
      }
      await clickAll(page);
      // Validate internal link navigations found on this route
      // Wait briefly for store nav to render on client
      try { await page.waitForSelector("a[href^='/store/']", { timeout: 5000 }); } catch {}
      const hrefs: string[] = await page.$$eval('a[href^="/"]', (as) => Array.from(new Set(as.map((a: any) => a.getAttribute('href')))) as string[]);
      for (const href of hrefs) {
        const target = href.startsWith('http') ? href : `${BASE}${href}`;
        try {
          const p = await browser.newPage();
          await p.setViewport({ width: 1366, height: 900 });
          p.setDefaultTimeout(20000);
          await p.goto(target, { waitUntil: 'domcontentloaded' });
          linkResults[`${r} -> ${href}`] = 'OK';
          await p.close();
        } catch (e: any) {
          linkResults[`${r} -> ${href}`] = `FAIL: ${e?.message || 'unknown'}`;
        }
      }
      results[r] = 'OK';
    } catch (e: any) {
      results[r] = `FAIL: ${e?.message || 'unknown'}`;
    }
  }

  await browser.close();
  // eslint-disable-next-line no-console
  console.log('Click check results:', results);
  console.log('Link navigation results:', linkResults);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
