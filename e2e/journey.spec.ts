import { CHAPTER_TITLES, expect, experience, h1, openExperience, stage, test } from './fixtures';

test.describe('guided journey', () => {
  test('start, visit all five chapters with the 3D scene, reach the recap', async ({ page }) => {
    await openExperience(page);
    await expect(h1(page)).toHaveText(CHAPTER_TITLES.en[0]);
    await expect(page.getByTestId('prototype-banner')).toContainText('Research prototype');
    await expect(page.getByTestId('illustrative-label')).toHaveText(
      'Illustrative geometry — not a surveyed reconstruction',
    );
    // No 3D is requested before an intentional entry.
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'idle');
    await expect(page.locator('canvas')).toHaveCount(0);

    await page.getByRole('button', { name: 'Begin the journey' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await expect(page.locator('[data-testid="scene-canvas"] canvas')).toBeVisible();

    for (const [index, title] of CHAPTER_TITLES.en.entries()) {
      await expect(h1(page)).toHaveText(title);
      await expect(page.locator('nav a[aria-current="step"]')).toContainText(title);
      await expect(page.getByTestId('announcer')).toHaveText(`Chapter ${index + 1} of 5: ${title}`);
      await expect(page).toHaveTitle(new RegExp(title));
      await expect(page.getByTestId('illustrative-label')).toBeVisible();
      if (index < 4) await page.getByRole('button', { name: /^Next: / }).click();
    }

    await expect(
      page.getByRole('button', { name: 'Next (this is the last chapter)' }),
    ).toBeDisabled();
    await expect(page.getByRole('heading', { name: 'What this journey covered' })).toBeVisible();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready');
  });

  test('the opening glide can be skipped and lands in a stable state', async ({ page }) => {
    await openExperience(page);
    await page.getByRole('button', { name: 'Begin the journey' }).click();
    const skip = page.getByRole('button', { name: 'Skip introduction' });
    await expect(skip).toBeVisible();
    await skip.click();
    await expect(skip).toHaveCount(0);
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await expect(h1(page)).toHaveText(CHAPTER_TITLES.en[0]);
    await page.getByRole('button', { name: /^Next: / }).click();
    await expect(h1(page)).toHaveText(CHAPTER_TITLES.en[1]);
  });

  test('an unskipped opening glide ends by itself within its time limit', async ({ page }) => {
    await openExperience(page);
    await page.getByRole('button', { name: 'Begin the journey' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await expect(page.getByRole('button', { name: 'Skip introduction' })).toHaveCount(0, {
      timeout: 8_000,
    });
  });

  test('era and realm selections update text, URL and announcements', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=centuries');
    await expect(page.locator('button[data-era]')).toHaveCount(4);
    for (const era of ['construction', 'nineteenth-century', 'restoration']) {
      const button = page.locator(`button[data-era="${era}"]`);
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(page).toHaveURL(new RegExp(`era=${era}`));
      await expect(page.getByTestId('era-detail')).toContainText('Artistic illustration');
    }
    await expect(page.getByTestId('announcer-detail')).toHaveText('Era: 1970s — conservation');

    await page.getByRole('navigation', { name: 'Chapters' }).getByRole('link').nth(4).click();
    await page.locator('button[data-realm="arupadhatu"]').click();
    await expect(page).toHaveURL(/chapter=ascent.*realm=arupadhatu/);
    await expect(page.getByTestId('realm-detail')).toContainText(
      'three circular platforms and main stupa correspond to Arupadhatu',
    );
  });

  test('explore mode enables the free camera and guided mode restores the chapter', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=architecture');
    await page.getByRole('button', { name: 'Explore' }).click();
    await expect(experience(page)).toHaveAttribute('data-mode', 'explore');
    await expect(page).toHaveURL(/chapter=architecture&mode=explore/);
    await expect(page.getByText('Drag to orbit.')).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Guided' }).click();
    await expect(experience(page)).toHaveAttribute('data-mode', 'guided');
    await expect(h1(page)).toHaveText(CHAPTER_TITLES.en[2]);
  });
});
