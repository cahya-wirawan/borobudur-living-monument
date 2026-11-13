import { test as base, expect, type Page } from '@playwright/test';

/**
 * Every test fails on an uncaught page error, a console error or any request
 * that leaves the local origin: the MVP must run with no external runtime
 * dependency (AGENTS.md).
 */
export const test = base.extend<{ guard: void }>({
  guard: [
    async ({ page, baseURL }, use) => {
      const problems: string[] = [];
      page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        if (message.type() === 'error') problems.push(`console.error: ${message.text()}`);
      });
      page.on('request', (request) => {
        const url = request.url();
        if (!url.startsWith(baseURL ?? '') && !url.startsWith('data:') && !url.startsWith('blob:'))
          problems.push(`external request: ${url}`);
      });
      await use();
      expect(problems, 'no page errors, console errors or external requests').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const experience = (page: Page) => page.getByTestId('experience');
export const stage = (page: Page) => page.getByTestId('scene-stage');
export const h1 = (page: Page) => page.getByRole('heading', { level: 1 });

export async function openExperience(page: Page, path = '/en/experience') {
  await page.goto(path);
  await expect(experience(page)).toHaveAttribute('data-hydrated', 'true');
}

/** Makes every WebGL context request fail, as on a blocked or unsupported GPU. */
export async function disableWebGL(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (String(type).startsWith('webgl')) return null;
      return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof original;
  });
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}

export const CHAPTER_TITLES = {
  en: [
    'The Awakening',
    'Across Centuries',
    'Inside the Monument',
    'Stories in Stone',
    'The Ascent',
  ],
  id: [
    'Kebangkitan',
    'Menembus Abad',
    'Menjelajahi Arsitektur',
    'Kisah dalam Batu',
    'Perjalanan Mendaki',
  ],
} as const;
