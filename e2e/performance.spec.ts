import type { Page } from '@playwright/test';
import { expect, openExperience, stage, test } from './fixtures';

/**
 * Byte budgets from docs/01_PRD.md §6 and docs/03_ARCHITECTURE.md §8, enforced
 * on the production build. Transfer sizes are exact and device independent,
 * unlike frame rates, which are only recorded in docs/performance-report.md.
 */
const INITIAL_JS_BUDGET_KB = 250;
const SCENE_PACKAGE_BUDGET_KB = 3 * 1024;

async function trackScriptBytes(page: Page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  const types = new Map<string, string>();
  const counter = { scriptKB: 0 };
  cdp.on('Network.responseReceived', (event) => types.set(event.requestId, event.type));
  cdp.on('Network.loadingFinished', (event) => {
    if (types.get(event.requestId) === 'Script') counter.scriptKB += event.encodedDataLength / 1024;
  });
  return counter;
}

test.describe('performance budgets', () => {
  test.skip(({ isMobile }) => isMobile, 'transfer sizes do not depend on the viewport');

  for (const path of ['/', '/en/read', '/en/sources', '/en/experience']) {
    test(`initial JavaScript for ${path} stays within ${INITIAL_JS_BUDGET_KB} KB (compressed)`, async ({
      page,
    }) => {
      const bytes = await trackScriptBytes(page);
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(bytes.scriptKB).toBeGreaterThan(20);
      expect(bytes.scriptKB).toBeLessThanOrEqual(INITIAL_JS_BUDGET_KB);
    });
  }

  test('3D code is requested only after an intentional entry and fits its budget', async ({
    page,
  }) => {
    const bytes = await trackScriptBytes(page);
    await page.goto('/en/experience', { waitUntil: 'networkidle' });
    const before = bytes.scriptKB;
    await expect(page.locator('canvas')).toHaveCount(0);

    await page.getByRole('button', { name: 'Explore freely' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await page.waitForLoadState('networkidle');
    const scene = bytes.scriptKB - before;
    // The 3D libraries really are deferred: a sizeable chunk arrives only now.
    expect(scene).toBeGreaterThan(100);
    expect(scene).toBeLessThanOrEqual(SCENE_PACKAGE_BUDGET_KB);
  });

  test('text-first routes never load the 3D code or create a WebGL context', async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      (window as unknown as { __contexts: number }).__contexts = 0;
      HTMLCanvasElement.prototype.getContext = function (
        this: HTMLCanvasElement,
        ...args: unknown[]
      ) {
        (window as unknown as { __contexts: number }).__contexts += 1;
        return (original as (...a: unknown[]) => unknown).apply(this, args);
      } as typeof original;
    });
    for (const path of ['/', '/en/read', '/en/sources', '/en/about', '/en/experience']) {
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(
        await page.evaluate(() => (window as unknown as { __contexts: number }).__contexts),
        path,
      ).toBe(0);
    }
  });
});

test.describe('GPU lifecycle', () => {
  test.skip(({ isMobile }) => isMobile, 'covered once on desktop');

  test('a lost WebGL context falls back to the diagram and can be retried', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=architecture');
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>(
        '[data-testid="scene-canvas"] canvas',
      );
      const gl = canvas?.getContext('webgl2') ?? canvas?.getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    const fallback = page.getByRole('group', { name: 'The 3D scene is not available' });
    await expect(fallback).toBeVisible();
    await expect(page.getByTestId('scene-still')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Inside the Monument');

    await fallback.getByRole('button', { name: 'Try the 3D scene again' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await expect(fallback).toHaveCount(0);
  });

  test('repeated mount and unmount releases WebGL contexts', async ({ page }) => {
    // Twenty scene starts with shadows on a software renderer: slow, but only here.
    test.setTimeout(300_000);
    await openExperience(page, '/en/experience?chapter=centuries');
    // Browsers allow roughly 16 live contexts; leaking one per visit would fail well before 20.
    for (let visit = 0; visit < 20; visit++) {
      await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
      await page
        .getByRole('group', { name: 'Viewing mode' })
        .getByRole('link', { name: 'Read' })
        .click();
      await expect(page).toHaveURL(/\/en\/read/);
      await expect(page.locator('canvas')).toHaveCount(0);
      await page.goBack();
    }
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
  });

  test('quality is always a known preset and never silently turns 3D off', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=ascent');
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    for (const step of ['up', 'up', 'down', 'down']) {
      await page.locator(`button[data-step="${step}"]`).click();
      await page.waitForTimeout(1500);
    }
    await expect(page.getByTestId('experience')).toHaveAttribute(
      'data-quality',
      /^(low|medium|high)$/,
    );
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready');
  });
});
