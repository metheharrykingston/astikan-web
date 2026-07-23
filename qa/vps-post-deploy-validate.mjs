import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

const BASE = process.env.AUDIT_BASE_URL || 'https://www.astikan.com';
const OUT = path.resolve(process.env.AUDIT_OUTPUT || 'vps-validation-output');
const SHOTS = path.join(OUT, 'screenshots');
fs.mkdirSync(SHOTS, { recursive: true });

const routes = [
  { name: 'home', path: '/', kind: 'root' },
  { name: 'astikan', path: '/astikan', kind: 'root' },
  { name: 'mission', path: '/mission', kind: 'root' },
  { name: 'membership-home', path: '/membership/index.html', kind: 'membership' },
  { name: 'ambulance-emergency', path: '/membership/ambulance-emergency.html', kind: 'emergency' },
  { name: 'find-doctors', path: '/membership/find-doctors.html', kind: 'doctors' },
  { name: 'book-test', path: '/membership/book-test.html', kind: 'booking' },
  { name: 'lab-test', path: '/membership/lab-test.html', kind: 'membership' },
  { name: 'medicine-delivery', path: '/membership/medicine-delivery.html', kind: 'medicine' },
  { name: 'contact-us', path: '/membership/contact-us.html', kind: 'membership' },
  { name: 'about-us', path: '/membership/about-us.html', kind: 'membership' },
  { name: 'disclaimer', path: '/membership/disclaimer.html', kind: 'membership' },
  { name: 'privacy-policy', path: '/membership/privacy-policy.html', kind: 'membership' }
];

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 }
];

const engines = { chromium, firefox, webkit };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const unique = list => [...new Set(list.filter(Boolean))];

function safeName(value) {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '');
}

async function readState(page, route, viewport) {
  return page.evaluate(({ routeKind, viewportWidth }) => {
    const isVisible = el => {
      if (!el) return false;
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.03 && rect.width > 2 && rect.height > 2;
    };
    const visibleText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim();
    const images = [...document.images];
    const bodyWidth = document.documentElement.scrollWidth;
    const brokenImages = images.filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src || img.alt || 'unknown');
    const telLinks = [...document.querySelectorAll('a[href^="tel:"]')].map(a => ({ href: a.getAttribute('href'), text: (a.innerText || a.getAttribute('aria-label') || '').trim() }));
    const visibleConfirmed = [...document.querySelectorAll('body *')].filter(el => isVisible(el) && /booking confirmed/i.test((el.textContent || '').trim()) && el.children.length === 0).length;
    const doctorCards = [...document.querySelectorAll('.doctor-card, [data-doctor-card], .doctor-item, .doctor-profile-card')].filter(isVisible).length;
    const medicineCards = [...document.querySelectorAll('.medicine-card, [data-medicine-card], .product-card, .medicine-item')].filter(isVisible).length;
    const possibleMenus = [...document.querySelectorAll('button, [role="button"]')].filter(el => isVisible(el) && /menu|navigation|toggle/i.test(`${el.getAttribute('aria-label') || ''} ${el.className || ''}`));
    const undersizedImportant = [...document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]')]
      .filter(isVisible)
      .map(el => {
        const r = el.getBoundingClientRect();
        const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        return { text, width: Math.round(r.width), height: Math.round(r.height) };
      })
      .filter(x => viewportWidth <= 430 && /menu|analy|filter|emergency|confirm|book|login/i.test(x.text) && (x.width < 44 || x.height < 44));
    const h1 = document.querySelector('h1');
    const heroImage = [...images].find(img => isVisible(img) && img.getBoundingClientRect().top < innerHeight * 1.2 && img.getBoundingClientRect().width > 160);
    const summary = el => {
      if (!el) return null;
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      return { visible: isVisible(el), opacity: s.opacity, transform: s.transform, width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top) };
    };
    return {
      title: document.title,
      finalUrl: location.href,
      visibleText,
      bodyWidth,
      viewportWidth: innerWidth,
      horizontalOverflow: Math.max(0, bodyWidth - innerWidth),
      brokenImages,
      telLinks,
      visibleConfirmed,
      doctorCards,
      medicineCards,
      hasDoctorError: /error loading doctors/i.test(visibleText),
      hasZeroDoctors: /showing\s+0\s+doctors/i.test(visibleText),
      hasMedicineLoading: /loading medicines/i.test(visibleText),
      has911: /\+?1[-\s]*911[-\s]*emergency|call emergency:\s*\+?1|emergency:\s*\+?1[-\s]*911/i.test(visibleText) || telLinks.some(x => /911/i.test(`${x.href} ${x.text}`)),
      has2026: /©\s*2026|copyright\s*2026/i.test(visibleText),
      loginModalExposed: /welcome back!\s*enter the world of premium healthcare/i.test(visibleText),
      menuCandidates: possibleMenus.length,
      undersizedImportant,
      h1: summary(h1),
      heroImage: summary(heroImage),
      aosElements: document.querySelectorAll('[data-aos]').length,
      activeAnimations: document.getAnimations ? document.getAnimations().length : 0,
      routeKind
    };
  }, { routeKind: route.kind, viewportWidth: viewport.width });
}

async function animationProbe(page) {
  const samples = [];
  for (const delay of [100, 450, 900, 1600]) {
    await sleep(delay === 100 ? 100 : delay - samples[samples.length - 1]?.at || delay);
    samples.push(await page.evaluate(at => {
      const h1 = document.querySelector('h1');
      const img = [...document.images].find(el => el.getBoundingClientRect().top < innerHeight * 1.2 && el.getBoundingClientRect().width > 160);
      const snap = el => {
        if (!el) return null;
        const s = getComputedStyle(el);
        return { opacity: s.opacity, transform: s.transform };
      };
      return { at, h1: snap(h1), heroImage: snap(img), activeAnimations: document.getAnimations ? document.getAnimations().length : 0 };
    }, delay));
  }
  const serialized = samples.map(x => JSON.stringify({ h1: x.h1, heroImage: x.heroImage, activeAnimations: x.activeAnimations }));
  return { samples, changed: new Set(serialized).size > 1 || samples.some(x => x.activeAnimations > 0) };
}

async function openMobileMenu(page) {
  const candidates = [
    'button[aria-label*="navigation" i]',
    'button[aria-label*="menu" i]',
    '.navbar-toggler',
    '.mobile-menu-btn',
    '.menu-toggle',
    '[data-bs-toggle="offcanvas"]'
  ];
  for (const selector of candidates) {
    const locator = page.locator(selector).filter({ visible: true }).first();
    if (await locator.count()) {
      try {
        await locator.click({ timeout: 3000 });
        await sleep(500);
        const open = await page.evaluate(() => {
          const visible = el => {
            const s = getComputedStyle(el); const r = el.getBoundingClientRect();
            return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) > .03 && r.width > 20 && r.height > 20;
          };
          return [...document.querySelectorAll('.offcanvas.show, .mobile-menu.open, .navbar-collapse.show, [role="dialog"], nav')].some(visible);
        });
        return { attempted: true, opened: open, selector };
      } catch {}
    }
  }
  return { attempted: false, opened: false, selector: null };
}

const results = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE,
  browserVersions: {},
  cases: [],
  failures: []
};

for (const [browserName, browserType] of Object.entries(engines)) {
  const browser = await browserType.launch({ headless: true });
  results.browserVersions[browserName] = browser.version();
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      locale: 'en-IN', timezoneId: 'Asia/Kolkata', colorScheme: 'light', reducedMotion: 'no-preference',
      serviceWorkers: 'block'
    });
    for (const route of routes) {
      const page = await context.newPage();
      const pageErrors = [];
      const consoleErrors = [];
      const failedRequests = [];
      page.on('pageerror', e => pageErrors.push(String(e.message || e)));
      page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
      page.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()} :: ${req.failure()?.errorText || 'failed'}`));
      const url = new URL(route.path, BASE);
      url.searchParams.set('__astikan_qa', `${Date.now()}-${browserName}-${viewport.name}`);
      let response = null; let navError = null;
      try {
        response = await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 60000 });
      } catch (error) {
        navError = String(error.message || error);
      }

      let animation = null;
      if (!navError && route.name === 'home') animation = await animationProbe(page).catch(() => null);
      else await sleep(2200);

      const earlyShot = path.join(SHOTS, safeName(`${browserName}__${viewport.name}__${route.name}__early.png`));
      if (!navError) await page.screenshot({ path: earlyShot, fullPage: false }).catch(() => {});
      await sleep(5000);
      await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
      const state = navError ? null : await readState(page, route, viewport).catch(() => null);

      let menu = null;
      let menuShot = null;
      if (!navError && viewport.width <= 430 && ['membership-home', 'find-doctors', 'book-test'].includes(route.name)) {
        menu = await openMobileMenu(page);
        if (menu.attempted) {
          menuShot = path.join(SHOTS, safeName(`${browserName}__${viewport.name}__${route.name}__menu.png`));
          await page.screenshot({ path: menuShot, fullPage: false }).catch(() => {});
        }
      }

      const settledShot = path.join(SHOTS, safeName(`${browserName}__${viewport.name}__${route.name}__settled.png`));
      if (!navError) await page.screenshot({ path: settledShot, fullPage: false }).catch(() => {});

      const caseFailures = [];
      const fail = (id, message, severity = 'high') => caseFailures.push({ id, message, severity });
      if (navError) fail('NAV', navError, 'critical');
      if (!navError && (!response || response.status() >= 400)) fail('HTTP', `HTTP ${response?.status() ?? 'unknown'}`, 'critical');
      if (state) {
        if (state.horizontalOverflow > 3) fail('OVERFLOW', `${state.horizontalOverflow}px horizontal overflow`, 'medium');
        if (state.brokenImages.length) fail('BROKEN_IMAGES', `${state.brokenImages.length} broken images`, 'high');
        if (route.kind === 'emergency' && state.has911) fail('EMERGENCY_911', 'Old +1-911 emergency CTA is still visible or linked', 'critical');
        if (route.kind === 'doctors' && (state.hasZeroDoctors || state.hasDoctorError || state.doctorCards < 1)) fail('DOCTORS_EMPTY', `Doctor directory is not populated (cards=${state.doctorCards})`, 'critical');
        if (route.kind === 'booking' && state.visibleConfirmed > 0) fail('BOOKING_SUCCESS_INITIAL', 'Booking Confirmed is visible before submission', 'critical');
        if (route.kind === 'medicine' && state.hasMedicineLoading && state.medicineCards < 1) fail('MEDICINE_STUCK', 'Medicine catalogue remains in loading state', 'high');
        if (route.kind === 'membership' && !state.has2026) fail('COPYRIGHT_YEAR', 'Footer does not show 2026', 'low');
        if (['membership', 'doctors', 'booking', 'medicine', 'emergency'].includes(route.kind) && state.loginModalExposed) fail('LOGIN_MODAL_EXPOSED', 'Hidden login modal text is exposed in visible page text', 'high');
        if (state.undersizedImportant.length) fail('TOUCH_TARGETS', `${state.undersizedImportant.length} important mobile controls are below 44px`, 'medium');
        if (route.name === 'home' && (!state.h1?.visible || !state.heroImage?.visible)) fail('HERO_SETTLED', 'Homepage essential hero content is not visible after settling', 'critical');
      }
      if (unique(pageErrors).length) fail('PAGE_ERRORS', `${unique(pageErrors).length} uncaught page error(s)`, 'high');
      if (menu?.attempted && !menu.opened) fail('MOBILE_MENU', `Mobile menu did not visibly open using ${menu.selector}`, 'high');

      const item = {
        browser: browserName, browserVersion: browser.version(), viewport: viewport.name,
        route: route.path, routeName: route.name, kind: route.kind,
        status: response?.status() ?? null, finalUrl: page.url(), navError,
        state, animation, menu,
        pageErrors: unique(pageErrors), consoleErrors: unique(consoleErrors).slice(0, 30), failedRequests: unique(failedRequests).slice(0, 30),
        screenshots: { early: path.relative(OUT, earlyShot), settled: path.relative(OUT, settledShot), menu: menuShot ? path.relative(OUT, menuShot) : null },
        failures: caseFailures
      };
      results.cases.push(item);
      for (const failure of caseFailures) results.failures.push({ browser: browserName, viewport: viewport.name, route: route.path, ...failure });
      await page.close();
    }
    await context.close();
  }
  await browser.close();
}

const grouped = {};
for (const failure of results.failures) {
  const key = `${failure.id}|${failure.route}`;
  grouped[key] ||= { id: failure.id, route: failure.route, severity: failure.severity, message: failure.message, browsers: new Set(), viewports: new Set(), count: 0 };
  grouped[key].browsers.add(failure.browser); grouped[key].viewports.add(failure.viewport); grouped[key].count++;
}
const groupedFailures = Object.values(grouped).map(x => ({ ...x, browsers: [...x.browsers], viewports: [...x.viewports] }));
results.groupedFailures = groupedFailures;
results.summary = {
  totalCases: results.cases.length,
  failedCases: results.cases.filter(x => x.failures.length).length,
  totalFailures: results.failures.length,
  criticalGroups: groupedFailures.filter(x => x.severity === 'critical').length,
  animationObserved: results.cases.filter(x => x.routeName === 'home' && x.animation?.changed).length,
  homeCases: results.cases.filter(x => x.routeName === 'home').length
};

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
const md = [
  '# Astikan VPS post-deploy validation',
  '',
  `Generated: ${results.generatedAt}`,
  `Base: ${BASE}`,
  `Cases: ${results.summary.totalCases}`,
  `Cases with failures: ${results.summary.failedCases}`,
  `Critical finding groups: ${results.summary.criticalGroups}`,
  `Homepage animation observed: ${results.summary.animationObserved}/${results.summary.homeCases} browser/viewport cases`,
  '',
  '## Grouped findings',
  '',
  ...(groupedFailures.length ? groupedFailures.map(x => `- **${x.severity.toUpperCase()} ${x.id}** ${x.route}: ${x.message} — ${x.browsers.join(', ')}; ${x.viewports.join(', ')}`) : ['- No grouped failures.'])
].join('\n');
fs.writeFileSync(path.join(OUT, 'summary.md'), md);
console.log(md);

if (results.summary.criticalGroups > 0) process.exitCode = 2;
