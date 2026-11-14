/**
 * Manual visual inspection helper (complements, never replaces, `pnpm test:e2e`).
 * Captures the docs/02 §8 screenshot set at desktop and mobile sizes and reports
 * console errors, page errors, failed/external requests and whether WebGL started.
 *
 *   pnpm build && pnpm start --port 3100   # in another terminal
 *   node scripts/visual-inspect.mjs [outDir] [baseUrl]
 *   ONLY=landing,read VIEW=desktop node scripts/visual-inspect.mjs   # a subset while iterating
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'test-results/inspect';
const base = process.argv[3] ?? 'http://localhost:3100';
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const SHOTS = [
  { name: 'landing', path: '/' },
  { name: 'hero-idle', path: '/en/experience' },
  { name: 'hero-3d', path: '/en/experience', begin: true },
  {
    name: 'era-construction',
    path: '/en/experience?chapter=centuries&era=construction',
    scene: true,
  },
  {
    name: 'era-nineteenth',
    path: '/en/experience?chapter=centuries&era=nineteenth-century',
    scene: true,
  },
  {
    name: 'era-restoration',
    path: '/en/experience?chapter=centuries&era=restoration',
    scene: true,
  },
  { name: 'era-present', path: '/en/experience?chapter=centuries', scene: true },
  { name: 'architecture', path: '/en/experience?chapter=architecture', scene: true },
  { name: 'stories', path: '/id/experience?chapter=stories', scene: true },
  { name: 'realm-base', path: '/en/experience?chapter=ascent', scene: true },
  { name: 'realm-top', path: '/en/experience?chapter=ascent&realm=arupadhatu', scene: true },
  { name: 'explore', path: '/en/experience?chapter=architecture&mode=explore', scene: true },
  { name: 'sources-drawer', path: '/en/experience?chapter=centuries', scene: true, drawer: true },
  {
    name: 'feature-3d',
    path: '/en/experience?chapter=architecture&feature=circular-platforms',
    scene: true,
  },
  {
    name: 'feature-stupas',
    path: '/en/experience?chapter=architecture&feature=openwork-stupas',
    scene: true,
  },
  {
    name: 'feature-diagram',
    path: '/en/experience?chapter=architecture&feature=square-terraces',
    scene: true,
    click: ['button[data-view="diagram"]'],
  },
  { name: 'stories-hotspots', path: '/en/experience?chapter=stories', scene: true },
  {
    name: 'relief-dialog',
    path: '/en/experience?chapter=stories&relief=demo-panel-02',
    scene: true,
  },
  { name: 'realm-middle', path: '/en/experience?chapter=ascent&realm=rupadhatu', scene: true },
  {
    name: 'no-webgl-architecture',
    path: '/id/experience?chapter=architecture&feature=openwork-stupas',
    noWebgl: true,
  },
  { name: 'read', path: '/en/read', full: true },
  { name: 'sources', path: '/id/sources', full: true },
  { name: 'about', path: '/en/about', full: true },
  { name: 'no-webgl', path: '/en/experience?chapter=ascent&realm=rupadhatu', noWebgl: true },
  { name: 'reduced-motion', path: '/en/experience', begin: true, reducedMotion: true },
];

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const problems = [];

const only = process.env.ONLY?.split(',');
for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
  if (process.env.VIEW && process.env.VIEW !== viewportName) continue;
  for (const shot of SHOTS) {
    if (only && !only.includes(shot.name)) continue;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile ?? false,
      hasTouch: viewport.hasTouch ?? false,
      deviceScaleFactor: viewport.deviceScaleFactor ?? 1,
      reducedMotion: shot.reducedMotion ? 'reduce' : 'no-preference',
    });
    if (shot.noWebgl)
      await context.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
          return String(type).startsWith('webgl') ? null : original.call(this, type, ...rest);
        };
      });
    const page = await context.newPage();
    const tag = `${viewportName}/${shot.name}`;
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(`${tag}: console.error ${message.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`${tag}: pageerror ${error.message}`));
    page.on('requestfailed', (request) => problems.push(`${tag}: requestfailed ${request.url()}`));
    page.on('request', (request) => {
      if (!request.url().startsWith(base) && !request.url().startsWith('data:'))
        problems.push(`${tag}: EXTERNAL request ${request.url()}`);
    });

    await page.goto(base + shot.path, { waitUntil: 'networkidle' });
    if (shot.begin) await page.getByRole('button', { name: 'Begin the journey' }).click();
    if (shot.scene || shot.begin) {
      const status = page.locator('[data-testid="scene-stage"]');
      await status
        .and(page.locator('[data-scene-status="ready"]'))
        .waitFor({ timeout: 20_000 })
        .catch(async () =>
          problems.push(
            `${tag}: scene not ready (status=${await status.getAttribute('data-scene-status')})`,
          ),
        );
      await page.waitForTimeout(shot.begin ? 4500 : 2200);
    }
    for (const selector of shot.click ?? []) await page.locator(selector).click();
    if (shot.drawer) await page.getByRole('button', { name: 'Sources and evidence' }).click();
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 0) problems.push(`${tag}: horizontal overflow ${overflow}px`);
    await page.screenshot({
      path: join(outDir, `${viewportName}-${shot.name}.png`),
      fullPage: !!shot.full,
    });
    await context.close();
  }
}
await browser.close();

console.log(
  problems.length
    ? `PROBLEMS (${problems.length}):\n${problems.join('\n')}`
    : 'No problems detected.',
);
process.exit(problems.length ? 1 : 0);
