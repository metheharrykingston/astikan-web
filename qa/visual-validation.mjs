import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

const BASE = process.env.AUDIT_BASE_URL || 'https://www.astikan.com';
const OUT = path.resolve('visual-validation-output');
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const routes = [
  { path: '/', name: 'home' },
  { path: '/astikan', name: 'astikan' },
  { path: '/mission', name: 'mission' }
];
const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 }
];
const engines = { chromium, firefox, webkit };
const result = { generatedAt: new Date().toISOString(), baseUrl: BASE, motionMode: 'reduce', browserVersions: {}, cases: [] };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function state(page) {
  return page.evaluate(() => {
    const visible = el => {
      if (!el) return false;
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > .05 && r.width > 2 && r.height > 2;
    };
    const summarize = el => {
      if (!el) return null;
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: (el.innerText || el.getAttribute('alt') || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 100),
        display: s.display, visibility: s.visibility, opacity: s.opacity,
        transform: s.transform, width: Math.round(r.width), height: Math.round(r.height),
        top: Math.round(r.top), left: Math.round(r.left), visible: visible(el),
        src: el.currentSrc || el.src || null, naturalWidth: el.naturalWidth ?? null
      };
    };
    const heading = document.querySelector('h1');
    const images = [...document.images].map(summarize).filter(Boolean);
    const links = [...document.querySelectorAll('a,button')].map(summarize).filter(x => x && x.visible);
    return {
      title: document.title,
      heading: summarize(heading),
      heroImages: images.filter(x => x.top < innerHeight * 1.3 && x.width > 100),
      primaryActions: links.filter(x => /start|explore|book|join|care/i.test(x.text)).slice(0, 20),
      brokenImages: images.filter(x => x.naturalWidth === 0)
    };
  });
}

for (const [browserName, type] of Object.entries(engines)) {
  const browser = await type.launch({ headless: true });
  result.browserVersions[browserName] = browser.version();
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'en-IN', timezoneId: 'Asia/Kolkata', colorScheme: 'light', reducedMotion: 'reduce' });
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e.message || e)));
      let response, navError = null;
      const started = Date.now();
      try { response = await page.goto(new URL(route.path, BASE).href, { waitUntil: 'domcontentloaded', timeout: 45000 }); }
      catch (e) { navError = String(e.message || e); }
      await sleep(1500);
      const earlyState = navError ? null : await state(page).catch(() => null);
      const earlyPath = path.join(SHOTS, `${browserName}__${vp.name}__${route.name}__early.png`);
      if (!navError) await page.screenshot({ path: earlyPath, fullPage: false }).catch(() => {});
      await sleep(6500);
      await page.evaluate(() => window.scrollTo(0,0)).catch(() => {});
      const settledState = navError ? null : await state(page).catch(() => null);
      const settledPath = path.join(SHOTS, `${browserName}__${vp.name}__${route.name}__settled.png`);
      if (!navError) await page.screenshot({ path: settledPath, fullPage: false }).catch(() => {});
      result.cases.push({
        browser: browserName, browserVersion: browser.version(), viewport: vp.name,
        route: route.path, routeName: route.name, status: response?.status() ?? null,
        finalUrl: page.url(), durationMs: Date.now()-started, navError,
        earlyState, settledState, pageErrors: [...new Set(errors)],
        earlyScreenshot: fs.existsSync(earlyPath) ? path.relative(OUT, earlyPath) : null,
        settledScreenshot: fs.existsSync(settledPath) ? path.relative(OUT, settledPath) : null
      });
      await page.close();
    }
    await context.close();
  }
  await browser.close();
}
fs.writeFileSync(path.join(OUT, 'validation-results.json'), JSON.stringify(result, null, 2));
console.log(`Validated ${result.cases.length} reduced-motion cases across ${Object.keys(result.browserVersions).join(', ')}`);
