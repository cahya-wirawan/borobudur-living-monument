import type { Page } from '@playwright/test';
import { disableWebGL, expect, test } from './fixtures';

/**
 * Visual regression for the deterministic, canvas-free rendering: the same
 * HTML and SVG every visitor gets when WebGL is unavailable. The 3D canvas is
 * excluded on purpose because GPU and driver differences make pixel
 * comparison unreliable; it is covered by functional tests instead.
 *
 * Update baselines after an intended visual change:
 *   pnpm test:e2e e2e/visual.spec.ts --update-snapshots
 * and review the changed images before committing them.
 */
test.use({ reducedMotion: 'reduce' });

const OPTIONS = { animations: 'disabled', maxDiffPixelRatio: 0.02 } as const;

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

const VIEWS: { name: string; path: string; dialog?: boolean }[] = [
  { name: 'landing', path: '/' },
  { name: 'hero', path: '/en/experience' },
  { name: 'era-construction', path: '/en/experience?chapter=centuries&era=construction' },
  { name: 'era-present', path: '/id/experience?chapter=centuries' },
  {
    name: 'architecture-feature',
    path: '/en/experience?chapter=architecture&feature=circular-platforms',
  },
  { name: 'relief-detail', path: '/en/experience?relief=demo-panel-01', dialog: true },
  { name: 'realm-base', path: '/en/experience?chapter=ascent' },
  { name: 'realm-top', path: '/en/experience?chapter=ascent&realm=arupadhatu' },
  { name: 'read', path: '/en/read' },
  { name: 'sources', path: '/id/sources' },
];

test.describe('visual regression (canvas-free)', () => {
  test.beforeEach(async ({ page }) => disableWebGL(page));

  for (const view of VIEWS) {
    test(view.name, async ({ page }) => {
      await page.goto(view.path);
      if (view.path.includes('/experience'))
        await expect(page.getByTestId('experience')).toHaveAttribute('data-hydrated', 'true');
      if (view.dialog) await expect(page.getByRole('dialog')).toBeVisible();
      await settle(page);
      await expect(page).toHaveScreenshot(`${view.name}.png`, OPTIONS);
    });
  }
});
