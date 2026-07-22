import fs from 'node:fs';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const BASE_URL = process.env.AUDIT_BASE_URL || 'https://www.astikan.com';
const OUT = path.resolve(process.env.AUDIT_OUTPUT || 'visual-audit-output');
const SCREEN_DIR = path.join(OUT, 'screenshots');
const DIFF_DIR = path.join(OUT, 'diffs');
fs.mkdirSync(SCREEN_DIR, { recursive: true });
fs.mkdirSync(DIFF_DIR, { recursive: true });

const routes = [
  { path: '/', name: 'home' },
  { path: '/astikan', name: 'astikan' },
  { path: '/mission', name: 'mission' },
  { path: '/company', name: 'company' },
  { path: '/astikan-pay', name: 'astikan-pay' },
  { path: '/membership/index.html', name: 'membership-home' },
  { path: '/membership/about-us.html', name: 'membership-about' },
  { path: '/membership/find-doctors.html', name: 'find-doctors' },
  { path: '/membership/lab-test.html', name: 'lab-tests' },
  { path: '/membership/book-test.html', name: 'book-test' },
  { path: '/membership/medicine-delivery.html', name: 'medicine-delivery' },
  { path: '/membership/contact-us.html', name: 'contact' },
  { path: '/membership/ambulance-emergency.html', name: 'ambulance-emergency' },
  { path: '/partner-hospitals.html', name: 'partner-hospitals' },
  { path: '/membership/disclaimer.html', name: 'disclaimer' },
  { path: '/membership/privacy-policy.html', name: 'privacy-policy' }
];

const viewports = [
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'tablet-768', width: 768, height: 1024, mobile: false },
  { name: 'mobile-390', width: 390, height: 844, mobile: true }
];

const fullPageRoutes = new Set([
  'home', 'astikan', 'membership-home', 'find-doctors', 'book-test',
  'ambulance-emergency', 'partner-hospitals'
]);

const browsers = { chromium, firefox, webkit };
const audit = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  routes,
  viewports,
  environment: {
    runner: process.env.RUNNER_NAME || 'unknown',
    os: process.platform,
    node: process.version,
    commit: process.env.GITHUB_SHA || null,
    runId: process.env.GITHUB_RUN_ID || null
  },
  browserVersions: {},
  results: [],
  comparisons: [],
  findings: []
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function addFinding(finding) {
  const key = `${finding.code}|${finding.browser || ''}|${finding.viewport || ''}|${finding.route || ''}|${finding.detail || ''}`;
  if (!audit.findings.some(f => f._key === key)) audit.findings.push({ ...finding, _key: key });
}

async function preparePage(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('aos-disabled', '1');
      sessionStorage.setItem('aos-disabled', '1');
    } catch (_) {}
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
}

async function injectStableStyles(page) {
  await page.addStyleTag({ content: `
    *, *::before, *::after {
      animation-duration: 0.001s !important;
      animation-delay: 0s !important;
      transition-duration: 0.001s !important;
      scroll-behavior: auto !important;
      caret-color: transparent !important;
    }
    [data-aos] { opacity: 1 !important; transform: none !important; }
    video { visibility: hidden !important; }
  `}).catch(() => {});
  await page.evaluate(async () => {
    try { await document.fonts.ready; } catch (_) {}
    window.scrollTo(0, 0);
  }).catch(() => {});
}

async function collectDomMetrics(page, viewport) {
  return page.evaluate(({ width, height, mobile }) => {
    const isVisible = (el) => {
      const style = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0.01 && r.width > 1 && r.height > 1;
    };
    const selector = 'a,button,input,select,textarea,[role="button"],[tabindex]';
    const interactive = [...document.querySelectorAll(selector)].filter(isVisible);
    const offscreen = interactive.map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 100), left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
    }).filter(x => x.right > width + 3 || x.left < -3).slice(0, 20);

    const smallTargets = mobile ? interactive.map(el => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 80), width: Math.round(r.width), height: Math.round(r.height) };
    }).filter(x => x.width > 0 && x.height > 0 && (x.width < 44 || x.height < 44)).slice(0, 30) : [];

    const clipped = [...document.querySelectorAll('body *')].filter(isVisible).map(el => {
      const style = getComputedStyle(el);
      const horizontal = el.scrollWidth > el.clientWidth + 3 && !['visible', 'auto', 'scroll'].includes(style.overflowX);
      const vertical = el.scrollHeight > el.clientHeight + 3 && !['visible', 'auto', 'scroll'].includes(style.overflowY);
      if (!horizontal && !vertical) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 12 || r.height < 8) return null;
      return { tag: el.tagName, id: el.id || '', className: String(el.className || '').slice(0, 120), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 120), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight, overflowX: style.overflowX, overflowY: style.overflowY };
    }).filter(Boolean).slice(0, 25);

    const brokenImages = [...document.images].filter(img => img.complete && img.naturalWidth === 0).map(img => ({ src: img.currentSrc || img.src, alt: img.alt || '' })).slice(0, 30);
    const lazyImages = [...document.images].filter(img => !img.complete).map(img => ({ src: img.currentSrc || img.src, alt: img.alt || '' })).slice(0, 20);
    const telLinks = [...document.querySelectorAll('a[href^="tel:"]')].filter(isVisible).map(a => ({ href: a.getAttribute('href'), text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 100) }));
    const bookingConfirmed = [...document.querySelectorAll('body *')].some(el => isVisible(el) && /booking\s+confirmed/i.test((el.innerText || '').trim()) && el.children.length < 5);
    const pageText = (document.body?.innerText || '').replace(/\s+/g, ' ');
    const bodyRect = document.body?.getBoundingClientRect();
    const doc = document.documentElement;
    const horizontalOverflow = Math.max(doc.scrollWidth, document.body?.scrollWidth || 0) - doc.clientWidth;
    const header = [...document.querySelectorAll('header, .sticky-header, .navbar')].find(isVisible);
    const headerRect = header ? header.getBoundingClientRect() : null;
    const cssSupport = {
      backdropFilter: CSS.supports('backdrop-filter', 'blur(4px)') || CSS.supports('-webkit-backdrop-filter', 'blur(4px)'),
      dvh: CSS.supports('height', '100dvh'),
      has: CSS.supports('selector(:has(*))'),
      colorMix: CSS.supports('color', 'color-mix(in srgb, red, blue)')
    };
    return {
      documentWidth: Math.max(doc.scrollWidth, document.body?.scrollWidth || 0),
      documentHeight: Math.max(doc.scrollHeight, document.body?.scrollHeight || 0),
      viewportWidth: width,
      viewportHeight: height,
      bodyWidth: bodyRect ? Math.round(bodyRect.width) : null,
      horizontalOverflow: Math.max(0, Math.round(horizontalOverflow)),
      brokenImages,
      lazyImages,
      offscreenInteractive: offscreen,
      smallTargets,
      clipped,
      telLinks,
      bookingConfirmed,
      containsEmergency911: /\b911\b|911-emergency/i.test(pageText),
      header: headerRect ? { top: Math.round(headerRect.top), bottom: Math.round(headerRect.bottom), height: Math.round(headerRect.height), position: getComputedStyle(header).position } : null,
      cssSupport
    };
  }, viewport);
}

async function captureInteractionState(page, browserName, viewport, route) {
  if (!viewport.mobile) return null;
  const candidates = [
    'button[aria-label*="navigation" i]',
    'button[aria-label*="menu" i]',
    '.navbar-toggler',
    '.mobile-menu-toggle',
    '[data-bs-toggle="offcanvas"]'
  ];
  for (const selector of candidates) {
    const locator = page.locator(selector).filter({ visible: true }).first();
    if (await locator.count().catch(() => 0)) {
      try {
        await locator.click({ timeout: 3000 });
        await new Promise(resolve => setTimeout(resolve, 350));
        const filename = `${browserName}__${viewport.name}__${route.name}__menu-open.png`;
        const filePath = path.join(SCREEN_DIR, filename);
        await page.screenshot({ path: filePath, fullPage: false });
        return { selector, screenshot: path.relative(OUT, filePath) };
      } catch (_) {}
    }
  }
  return null;
}

for (const [browserName, browserType] of Object.entries(browsers)) {
  let browser;
  try {
    browser = await browserType.launch({ headless: true });
    audit.browserVersions[browserName] = browser.version();
  } catch (error) {
    addFinding({ severity: 'BLOCKER', code: 'BROWSER_LAUNCH_FAILED', browser: browserName, detail: String(error.message || error) });
    continue;
  }

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      locale: 'en-IN',
      timezoneId: 'Asia/Kolkata',
      reducedMotion: 'reduce',
      colorScheme: 'light'
    });

    for (const route of routes) {
      const page = await context.newPage();
      await preparePage(page);
      const consoleErrors = [];
      const pageErrors = [];
      const requestFailures = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 500));
      });
      page.on('pageerror', err => pageErrors.push(String(err.message || err).slice(0, 500)));
      page.on('requestfailed', request => {
        const failure = request.failure();
        requestFailures.push({ url: request.url(), method: request.method(), error: failure?.errorText || 'unknown' });
      });

      const url = new URL(route.path, BASE_URL).href;
      const startedAt = Date.now();
      let response = null;
      let navigationError = null;
      try {
        response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await injectStableStyles(page);
        await new Promise(resolve => setTimeout(resolve, 1100));
        await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
      } catch (error) {
        navigationError = String(error.message || error);
      }

      const status = response?.status() ?? null;
      const result = {
        browser: browserName,
        browserVersion: audit.browserVersions[browserName],
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        route: route.path,
        routeName: route.name,
        requestedUrl: url,
        finalUrl: page.url(),
        status,
        title: await page.title().catch(() => ''),
        durationMs: Date.now() - startedAt,
        navigationError,
        consoleErrors: [...new Set(consoleErrors)].slice(0, 20),
        pageErrors: [...new Set(pageErrors)].slice(0, 20),
        requestFailures: requestFailures.filter(x => !/clarity\.ms|google-analytics|googletagmanager|doubleclick|facebook|hotjar/i.test(x.url)).slice(0, 30),
        metrics: null,
        screenshot: null,
        fullPageScreenshot: null,
        interaction: null
      };

      if (!navigationError) {
        result.metrics = await collectDomMetrics(page, viewport).catch(error => ({ metricError: String(error.message || error) }));
        const filename = `${browserName}__${viewport.name}__${route.name}.png`;
        const filePath = path.join(SCREEN_DIR, filename);
        await page.screenshot({ path: filePath, fullPage: false }).catch(error => { result.screenshotError = String(error.message || error); });
        if (fs.existsSync(filePath)) result.screenshot = path.relative(OUT, filePath);

        if (fullPageRoutes.has(route.name) && (viewport.name === 'desktop-1440' || viewport.name === 'mobile-390')) {
          const fullName = `${browserName}__${viewport.name}__${route.name}__full.png`;
          const fullPath = path.join(SCREEN_DIR, fullName);
          await page.screenshot({ path: fullPath, fullPage: true }).catch(error => { result.fullPageScreenshotError = String(error.message || error); });
          if (fs.existsSync(fullPath)) result.fullPageScreenshot = path.relative(OUT, fullPath);
        }

        if (['home', 'membership-home', 'find-doctors', 'book-test'].includes(route.name)) {
          result.interaction = await captureInteractionState(page, browserName, viewport, route);
        }
      }

      audit.results.push(result);

      if (navigationError) addFinding({ severity: 'BLOCKER', code: 'NAVIGATION_FAILED', browser: browserName, viewport: viewport.name, route: route.path, detail: navigationError.slice(0, 220) });
      if (status && status >= 400) addFinding({ severity: status >= 500 ? 'BLOCKER' : 'HIGH', code: 'HTTP_ERROR', browser: browserName, viewport: viewport.name, route: route.path, detail: `HTTP ${status}` });
      if (result.metrics?.horizontalOverflow > 3) addFinding({ severity: viewport.mobile ? 'HIGH' : 'MEDIUM', code: 'HORIZONTAL_OVERFLOW', browser: browserName, viewport: viewport.name, route: route.path, detail: `${result.metrics.horizontalOverflow}px beyond viewport` });
      if (result.metrics?.brokenImages?.length) addFinding({ severity: 'HIGH', code: 'BROKEN_IMAGES', browser: browserName, viewport: viewport.name, route: route.path, detail: `${result.metrics.brokenImages.length} broken image(s)` });
      if (result.metrics?.offscreenInteractive?.length) addFinding({ severity: viewport.mobile ? 'HIGH' : 'MEDIUM', code: 'OFFSCREEN_INTERACTIVE', browser: browserName, viewport: viewport.name, route: route.path, detail: `${result.metrics.offscreenInteractive.length} interactive control(s) extend outside viewport` });
      if (result.metrics?.bookingConfirmed && route.name === 'book-test') addFinding({ severity: 'BLOCKER', code: 'PREMATURE_SUCCESS_STATE', browser: browserName, viewport: viewport.name, route: route.path, detail: 'Visible “Booking Confirmed” state before any booking interaction' });
      if (result.metrics?.containsEmergency911 || result.metrics?.telLinks?.some(x => /911/i.test(`${x.href} ${x.text}`))) addFinding({ severity: 'BLOCKER', code: 'INVALID_EMERGENCY_CTA', browser: browserName, viewport: viewport.name, route: route.path, detail: 'Visible emergency content or telephone CTA references 911' });
      if (result.pageErrors.length) addFinding({ severity: 'HIGH', code: 'PAGE_SCRIPT_ERROR', browser: browserName, viewport: viewport.name, route: route.path, detail: result.pageErrors[0] });
      if (result.consoleErrors.length) addFinding({ severity: 'MEDIUM', code: 'CONSOLE_ERROR', browser: browserName, viewport: viewport.name, route: route.path, detail: result.consoleErrors[0] });
      if (result.requestFailures.length) addFinding({ severity: 'MEDIUM', code: 'RESOURCE_REQUEST_FAILED', browser: browserName, viewport: viewport.name, route: route.path, detail: `${result.requestFailures.length} non-analytics request failure(s)` });
      if (viewport.mobile && result.metrics?.smallTargets?.length >= 8) addFinding({ severity: 'LOW', code: 'SMALL_TOUCH_TARGETS', browser: browserName, viewport: viewport.name, route: route.path, detail: `${result.metrics.smallTargets.length}+ visible touch targets below 44×44px` });
      if (result.metrics?.clipped?.length >= 5) addFinding({ severity: 'MEDIUM', code: 'CLIPPED_CONTENT_CANDIDATES', browser: browserName, viewport: viewport.name, route: route.path, detail: `${result.metrics.clipped.length} clipping candidates require visual review` });

      await page.close();
    }
    await context.close();
  }
  await browser.close();
}

for (const viewport of viewports) {
  for (const route of routes) {
    const baselinePath = path.join(SCREEN_DIR, `chromium__${viewport.name}__${route.name}.png`);
    if (!fs.existsSync(baselinePath)) continue;
    for (const browserName of ['firefox', 'webkit']) {
      const candidatePath = path.join(SCREEN_DIR, `${browserName}__${viewport.name}__${route.name}.png`);
      if (!fs.existsSync(candidatePath)) continue;
      try {
        const a = PNG.sync.read(fs.readFileSync(baselinePath));
        const b = PNG.sync.read(fs.readFileSync(candidatePath));
        if (a.width !== b.width || a.height !== b.height) {
          audit.comparisons.push({ baseline: 'chromium', browser: browserName, viewport: viewport.name, route: route.path, routeName: route.name, comparable: false, reason: `Size mismatch ${a.width}x${a.height} vs ${b.width}x${b.height}` });
          continue;
        }
        const diff = new PNG({ width: a.width, height: a.height });
        const pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.2, includeAA: false, alpha: 0.65, diffColor: [255, 0, 0], aaColor: [255, 255, 0] });
        const ratio = pixels / (a.width * a.height);
        const comparison = { baseline: 'chromium', browser: browserName, viewport: viewport.name, route: route.path, routeName: route.name, comparable: true, differingPixels: pixels, diffRatio: Number(ratio.toFixed(6)), diffImage: null };
        if (ratio >= 0.035) {
          const diffName = `chromium-vs-${browserName}__${viewport.name}__${route.name}.png`;
          const diffPath = path.join(DIFF_DIR, diffName);
          fs.writeFileSync(diffPath, PNG.sync.write(diff));
          comparison.diffImage = path.relative(OUT, diffPath);
        }
        audit.comparisons.push(comparison);
        if (ratio >= 0.18) addFinding({ severity: 'MEDIUM', code: 'LARGE_CROSS_BROWSER_VISUAL_DIFF', browser: browserName, viewport: viewport.name, route: route.path, detail: `${(ratio * 100).toFixed(1)}% pixels differ from Chromium baseline` });
      } catch (error) {
        audit.comparisons.push({ baseline: 'chromium', browser: browserName, viewport: viewport.name, route: route.path, routeName: route.name, comparable: false, reason: String(error.message || error) });
      }
    }
  }
}

audit.findings = audit.findings.map(({ _key, ...rest }) => rest);
const severityRank = { BLOCKER: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
audit.findings.sort((a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9) || a.code.localeCompare(b.code));

const counts = audit.findings.reduce((acc, f) => { acc[f.severity] = (acc[f.severity] || 0) + 1; return acc; }, {});
const uniqueDefects = new Map();
for (const f of audit.findings) {
  const key = `${f.code}|${f.route}|${f.viewport}`;
  if (!uniqueDefects.has(key)) uniqueDefects.set(key, f);
}

const summaryLines = [
  '# Astikan Strict Visual Cross-Browser Audit',
  '',
  `- Generated: ${audit.generatedAt}`,
  `- Target: ${BASE_URL}`,
  `- Browsers: ${Object.entries(audit.browserVersions).map(([k,v]) => `${k} ${v}`).join(', ')}`,
  `- Viewports: ${viewports.map(v => `${v.name} (${v.width}×${v.height})`).join(', ')}`,
  `- Routes: ${routes.length}`,
  `- Executed page/viewport/browser cases: ${audit.results.length}`,
  `- Screenshots: ${audit.results.filter(r => r.screenshot).length} viewport + ${audit.results.filter(r => r.fullPageScreenshot).length} full-page`,
  `- Findings: ${counts.BLOCKER || 0} blocker, ${counts.HIGH || 0} high, ${counts.MEDIUM || 0} medium, ${counts.LOW || 0} low`,
  '',
  '## Unique findings',
  '',
  '| Severity | Code | Route | Viewport | Browser | Detail |',
  '|---|---|---|---|---|---|',
  ...[...uniqueDefects.values()].map(f => `| ${f.severity} | ${f.code} | ${f.route || ''} | ${f.viewport || ''} | ${f.browser || ''} | ${(f.detail || '').replace(/\|/g, '\\|')} |`),
  '',
  '## Notes',
  '',
  '- The audit disables CSS animation and requests reduced motion to make screenshots comparable.',
  '- Pixel differences are review signals, not automatic defects; font rasterization differs naturally between browser engines.',
  '- WebKit on Ubuntu validates the Safari rendering engine, but it is not a substitute for final verification on physical macOS/iOS Safari.'
];

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(audit, null, 2));
fs.writeFileSync(path.join(OUT, 'summary.md'), summaryLines.join('\n'));
console.log(summaryLines.slice(0, 10).join('\n'));
