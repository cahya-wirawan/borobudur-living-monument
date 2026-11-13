/**
 * Lab measurements for docs/performance-report.md. Complements e2e/performance.spec.ts,
 * which enforces the byte budgets in CI.
 *
 *   pnpm build && pnpm start --port 3100      # in another terminal
 *   node scripts/measure-performance.mjs [baseUrl]
 *
 * IMPORTANT: this runs headless Chromium with software WebGL (SwiftShader).
 * Transfer sizes are exact. LCP is a throttled lab value. Frame rates say
 * nothing about real GPUs or phones and must not be reported as device results.
 */
import { chromium } from '@playwright/test';
import os from 'node:os';

const base = process.argv[2] ?? 'http://localhost:3100';
const SLOW_4G = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};
const CPU_SLOWDOWN = 4;

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

async function open(path, { viewport, throttle }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  const types = new Map();
  const bytes = {};
  cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type));
  cdp.on('Network.loadingFinished', (e) => {
    const type = types.get(e.requestId) ?? 'Other';
    bytes[type] = (bytes[type] ?? 0) + e.encodedDataLength;
  });
  if (throttle) {
    await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
  }
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto(base + path, { waitUntil: 'networkidle' });
  return { context, page, bytes };
}

const kb = (n) => Math.round(((n ?? 0) / 1024) * 10) / 10;
const snapshot = (bytes) => ({
  scriptKB: kb(bytes.Script),
  stylesheetKB: kb(bytes.Stylesheet),
  fontKB: kb(bytes.Font),
  documentKB: kb(bytes.Document),
  totalKB: kb(Object.values(bytes).reduce((a, b) => a + b, 0)),
});

const result = {
  measuredAt: new Date().toISOString(),
  environment: {
    kind: 'headless lab — NOT a real device',
    browser: `Chromium ${browser.version()} (Playwright, headless)`,
    webgl: 'SwiftShader software rendering',
    os: `${os.type()} ${os.release()} ${os.arch()}`,
    cpu: `${os.cpus()[0]?.model ?? 'unknown'} × ${os.cpus().length}`,
    throttle: `network 1.6 Mbps down / 750 kbps up / 150 ms RTT, CPU ${CPU_SLOWDOWN}× slowdown`,
    server: 'next start (production build, gzip)',
  },
  routes: [],
  scene: {},
};

const mobile = { width: 390, height: 844 };
const desktop = { width: 1440, height: 900 };

for (const path of ['/', '/en/experience', '/en/read', '/en/sources']) {
  const cold = await open(path, { viewport: mobile, throttle: false });
  const sizes = snapshot(cold.bytes);
  await cold.context.close();
  const slow = await open(path, { viewport: mobile, throttle: true });
  await slow.page.waitForTimeout(500);
  const lcpMs = Math.round(await slow.page.evaluate(() => window.__lcp));
  await slow.context.close();
  result.routes.push({ path, viewport: '390×844', ...sizes, throttledLcpMs: lcpMs });
}

for (const [name, viewport] of Object.entries({ mobile, desktop })) {
  const { context, page, bytes } = await open('/en/experience', { viewport, throttle: false });
  const before = { ...bytes };
  const started = Date.now();
  await page.getByRole('button', { name: 'Explore freely' }).click();
  await page.locator('[data-scene-status="ready"]').waitFor({ timeout: 30_000 });
  const readyMs = Date.now() - started;
  await page.waitForLoadState('networkidle');
  const sceneScriptKB = kb((bytes.Script ?? 0) - (before.Script ?? 0));
  const quality = () => page.getByTestId('experience').getAttribute('data-quality');
  const qualityAtStart = await quality();

  // Scripted camera test: step through every chapter and realm, sampling frame intervals.
  await page.getByRole('button', { name: 'Guided' }).click();
  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    const tick = (now) => {
      window.__frames.push(now - last);
      last = now;
      window.__raf = requestAnimationFrame(tick);
    };
    window.__raf = requestAnimationFrame(tick);
  });
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: /^Next: / }).click();
    await page.waitForTimeout(1600);
  }
  for (const step of ['up', 'up', 'down', 'down']) {
    await page.locator(`button[data-step="${step}"]`).click();
    await page.waitForTimeout(1600);
  }
  const frames = await page.evaluate(() => {
    cancelAnimationFrame(window.__raf);
    return window.__frames.slice(1).sort((a, b) => a - b);
  });
  const at = (q) => frames[Math.min(frames.length - 1, Math.floor(frames.length * q))] ?? 0;
  result.scene[name] = {
    viewport: `${viewport.width}×${viewport.height}`,
    sceneScriptKB,
    clickToReadyMs: readyMs,
    qualityAtStart,
    qualityAtEnd: await quality(),
    softwareRendered: {
      medianFps: Math.round(1000 / at(0.5)),
      p95FrameMs: Math.round(at(0.95)),
      frames: frames.length,
    },
  };
  await context.close();
}

await browser.close();
console.log(JSON.stringify(result, null, 2));
