import { CHAPTER_TITLES, expect, experience, h1, openExperience, test } from './fixtures';

test.describe('deep links, history and locale', () => {
  test('deep link restores chapter and realm; reload, back and forward stay consistent', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=ascent&realm=rupadhatu');
    await expect(h1(page)).toHaveText('The Ascent');
    await expect(page.locator('button[data-realm="rupadhatu"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.reload();
    await expect(experience(page)).toHaveAttribute('data-hydrated', 'true');
    await expect(h1(page)).toHaveText('The Ascent');
    await expect(page.locator('button[data-realm="rupadhatu"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.getByRole('button', { name: /^Back: / }).click();
    await expect(h1(page)).toHaveText('Stories in Stone');
    await page.getByRole('button', { name: /^Back: / }).click();
    await expect(h1(page)).toHaveText('Inside the Monument');

    await page.goBack();
    await expect(h1(page)).toHaveText('Stories in Stone');
    await expect(page).toHaveURL(/chapter=stories/);
    await page.goBack();
    await expect(h1(page)).toHaveText('The Ascent');
    await expect(page.locator('button[data-realm="rupadhatu"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.goForward();
    await expect(h1(page)).toHaveText('Stories in Stone');
  });

  test('invalid parameters fall back to safe defaults and the URL is cleaned', async ({ page }) => {
    await openExperience(
      page,
      '/en/experience?chapter=%3Cscript%3E&era=1814&realm=nope&relief=..%2F..%2Fx&mode=admin',
    );
    await expect(h1(page)).toHaveText(CHAPTER_TITLES.en[0]);
    await expect(page).toHaveURL(/\/en\/experience$/);
  });

  test('language switch keeps chapter and selection, in both directions', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=centuries&era=restoration');
    await page.getByRole('link', { name: 'Switch language to Bahasa Indonesia' }).click();
    await expect(page).toHaveURL(/\/id\/experience\?chapter=centuries&era=restoration/);
    await expect(h1(page)).toHaveText('Menembus Abad');
    await expect(page.locator('html')).toHaveAttribute('lang', 'id');
    await expect(page.locator('[data-era="restoration"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('illustrative-label')).toHaveText(
      'Geometri ilustratif — bukan rekonstruksi berdasarkan survei',
    );
    await expect(page.getByTestId('prototype-banner')).toContainText('Prototipe riset');

    await expect(experience(page)).toHaveAttribute('data-hydrated', 'true');
    await page.getByRole('link', { name: 'Ganti bahasa ke English' }).click();
    await expect(page).toHaveURL(/\/en\/experience\?chapter=centuries&era=restoration/);
    await expect(h1(page)).toHaveText('Across Centuries');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('all five chapters are reachable in Indonesian', async ({ page }) => {
    await openExperience(page, '/id/experience');
    for (const [index, title] of CHAPTER_TITLES.id.entries()) {
      await expect(h1(page)).toHaveText(title);
      if (index < 4) await page.getByRole('button', { name: /^Lanjut: / }).click();
    }
    await expect(page).toHaveURL(/\/id\/experience\?chapter=ascent/);
  });

  test('Read mode keeps the chapter in both directions; mode=read redirects', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=centuries');
    await page
      .getByRole('group', { name: 'Viewing mode' })
      .getByRole('link', { name: 'Read' })
      .click();
    await expect(page).toHaveURL(/\/en\/read#chapter-centuries$/);
    await expect(page.locator('#chapter-centuries')).toBeInViewport();
    await page
      .getByRole('link', { name: 'Open “Across Centuries” in the interactive experience' })
      .click();
    await expect(page).toHaveURL(/\/en\/experience\?chapter=centuries$/);
    await expect(h1(page)).toHaveText('Across Centuries');

    await page.goto('/id/experience?chapter=ascent&mode=read');
    await expect(page).toHaveURL(/\/id\/read#chapter-ascent$/);
    await expect(h1(page)).toHaveText('Borobudur — baca kisahnya');
  });

  test('landing offers both languages, entry choices and the disclaimer', async ({ page }) => {
    await page.goto('/');
    await expect(h1(page)).toHaveText('Borobudur');
    await expect(
      page.getByText('Visual geometry is illustrative, not a surveyed reconstruction'),
    ).toBeVisible();
    await expect(page.getByText('bukan rekonstruksi berdasarkan survei').first()).toBeVisible();
    await page.getByRole('link', { name: 'Mulai pengalaman' }).click();
    await expect(page).toHaveURL(/\/id\/experience$/);
    await page.goto('/en');
    await expect(page).toHaveURL(/\/en\/experience$/);
    expect((await page.request.get('/fr/experience')).status()).toBe(404);
  });
});
