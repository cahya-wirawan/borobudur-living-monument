import {
  CHAPTER_TITLES,
  disableWebGL,
  expect,
  expectNoHorizontalOverflow,
  experience,
  h1,
  openExperience,
  stage,
  test,
} from './fixtures';

test.describe('WebGL unavailable', () => {
  test.beforeEach(async ({ page }) => disableWebGL(page));

  test('shows an accessible fallback with retry and Read, and the journey still completes', async ({
    page,
  }) => {
    await openExperience(page);
    await page.getByRole('button', { name: 'Begin the journey' }).click();

    const fallback = page.getByRole('group', { name: 'The 3D scene is not available' });
    await expect(fallback).toBeVisible();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'failed');
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect(page.getByTestId('scene-still')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skip introduction' })).toHaveCount(0);

    await fallback.getByRole('button', { name: 'Try the 3D scene again' }).click();
    await expect(fallback).toBeVisible();

    for (const [index, title] of CHAPTER_TITLES.en.entries()) {
      await expect(h1(page)).toHaveText(title);
      if (index < 4) await page.getByRole('button', { name: /^Next: / }).click();
    }
    await expect(
      page.getByRole('link', { name: /Source: UNESCO World Heritage Centre/ }).first(),
    ).toBeVisible();

    await fallback.getByRole('link', { name: 'Open Read mode' }).click();
    await expect(page).toHaveURL(/\/en\/read#chapter-ascent$/);
  });

  test('a deep link shows the right content and the still diagram follows the selection', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=ascent&realm=arupadhatu');
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'failed');
    await expect(h1(page)).toHaveText('The Ascent');
    await expect(
      page.getByTestId('scene-still').locator('[data-realm="arupadhatu"] rect').first(),
    ).toHaveAttribute('fill', 'var(--color-bronze)');
    await page.goto('/en/experience?chapter=centuries&era=construction');
    await expect(page.getByTestId('scene-still').locator('[data-built="false"]')).toHaveCount(7);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('no forced intro, instant transitions, full navigation', async ({ page }) => {
    await openExperience(page);
    await expect(experience(page)).toHaveAttribute('data-motion', 'reduced');
    await page.getByRole('button', { name: 'Begin the journey' }).click();
    await expect(page.getByRole('button', { name: 'Skip introduction' })).toHaveCount(0);
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    const duration = await h1(page).evaluate((el) => {
      const header = el.closest('header');
      return header ? parseFloat(getComputedStyle(header).animationDuration) : -1;
    });
    expect(duration).toBeLessThan(0.01);
    for (const [index, title] of CHAPTER_TITLES.en.entries()) {
      await expect(h1(page)).toHaveText(title);
      if (index < 4) await page.getByRole('button', { name: /^Next: / }).click();
    }
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('Read mode delivers all five chapters and their sources', async ({ page }) => {
    await page.goto('/en/read');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    for (const title of CHAPTER_TITLES.en)
      await expect(page.getByRole('heading', { level: 2, name: title })).toBeVisible();
    await expect(page.getByText('DEMO ARTWORK — NOT ORIGINAL RELIEF').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Source: UNESCO World Heritage Centre/ }).first(),
    ).toHaveAttribute('href', 'https://whc.unesco.org/en/list/592/');
  });

  test('the experience server-renders a deep-linked chapter and chapter links work', async ({
    page,
  }) => {
    await page.goto('/id/experience?chapter=architecture');
    await expect(h1(page)).toHaveText('Menjelajahi Arsitektur');
    await expect(page.locator('#main').getByText('72 stupa berterawang').first()).toBeVisible();
    await page.getByRole('navigation', { name: 'Bab' }).getByRole('link').nth(4).click();
    await expect(h1(page)).toHaveText('Perjalanan Mendaki');
  });
});

test.describe('slow network', () => {
  test('text stays usable while the 3D code loads, and loading can be cancelled', async ({
    page,
  }) => {
    await openExperience(page);
    // Hold back every script requested after the visitor asks for the scene.
    await page.route('**/_next/static/**/*.js', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue().catch(() => {});
    });
    await page.getByRole('button', { name: 'Explore freely' }).click();

    await expect(stage(page)).toHaveAttribute('data-scene-status', 'loading');
    await expect(page.getByRole('status')).toContainText('Loading the 3D scene');
    await expect(page.getByTestId('scene-still')).toBeVisible();
    await page.getByRole('button', { name: /^Next: / }).click();
    await expect(h1(page)).toHaveText(CHAPTER_TITLES.en[1]);

    await page.getByRole('button', { name: 'Use the still diagram instead' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'idle');
    await expect(page.getByRole('button', { name: 'Show 3D scene' })).toBeVisible();
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});

test.describe('viewports', () => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 360, height: 740 },
    { width: 1440, height: 900 },
  ]) {
    test(`no horizontal overflow at ${viewport.width}×${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const path of [
        '/',
        '/en/experience',
        '/id/experience?chapter=centuries&era=construction',
        '/id/experience?chapter=stories',
        '/en/experience?chapter=ascent',
        '/id/read',
        '/id/sources',
        '/id/about',
      ]) {
        await page.goto(path);
        await expectNoHorizontalOverflow(page);
      }
      await page.goto('/en/experience');
      await expect(page.getByRole('group', { name: 'Viewing mode' })).toBeVisible();
      await expect(page.getByRole('button', { name: /^Next: / })).toBeInViewport();
    });
  }

  test('controls meet the 44px touch target aim', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=centuries');
    const boxes = await page
      .locator('button:visible, nav[aria-label="Chapters"] a:visible')
      .evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          return { w: r.width, h: r.height, label: el.textContent?.trim() ?? '' };
        }),
      );
    expect(boxes.length).toBeGreaterThan(8);
    for (const box of boxes) {
      expect(box.h, `height of "${box.label}"`).toBeGreaterThanOrEqual(43.9);
      expect(box.w, `width of "${box.label}"`).toBeGreaterThanOrEqual(24);
    }
  });
});
