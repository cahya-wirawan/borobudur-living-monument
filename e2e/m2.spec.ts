import AxeBuilder from '@axe-core/playwright';
import { disableWebGL, expect, experience, h1, openExperience, stage, test } from './fixtures';

const ERAS = ['construction', 'nineteenth-century', 'restoration', 'present'] as const;

test.describe('M2-T01 Time Machine', () => {
  test('every era is reachable by deep link with separate statement and picture labels', async ({
    page,
  }) => {
    for (const era of ERAS) {
      await openExperience(page, `/en/experience?chapter=centuries&era=${era}`);
      await expect(page.locator(`button[data-era="${era}"]`)).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      const detail = page.getByTestId('era-detail');
      await expect(detail.getByRole('heading', { name: 'What the source says' })).toBeVisible();
      await expect(detail.getByText('Documented fact').first()).toBeVisible();
      await expect(detail.getByRole('heading', { name: 'What the picture shows' })).toBeVisible();
      await expect(detail.getByText('Artistic illustration')).toBeVisible();
      await expect(detail.getByRole('link', { name: /Source: UNESCO/ }).first()).toHaveAttribute(
        'href',
        'https://whc.unesco.org/en/list/592/',
      );
    }
    await expect(
      page.getByText('Changes between eras are visual transitions, not historical dates'),
    ).toBeVisible();
  });

  test('previous/next and arrow keys step through the eras and history restores them', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=centuries&era=construction');
    await expect(page.getByRole('button', { name: 'Previous era' })).toBeDisabled();
    await page.getByRole('button', { name: 'Next era' }).click();
    await expect(page).toHaveURL(/era=nineteenth-century/);
    await expect(page.getByText('Era 2 of 4')).toBeVisible();

    await page.locator('button[data-era="nineteenth-century"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/era=restoration/);
    await expect(page.getByTestId('announcer-detail')).toHaveText('Era: 1970s — conservation');
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/chapter=centuries$/);
    await expect(page.getByRole('button', { name: 'Next era' })).toBeDisabled();
    await expect(page.locator('[data-testid="era-rail"] [data-active="true"]')).toHaveCount(1);

    await page.goBack();
    await expect(page.locator('button[data-era="restoration"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByTestId('era-detail').getByRole('heading', { level: 2 })).toHaveText(
      '1970s — conservation',
    );
  });

  test('mode continuity: explore, pick an era, read, come back to the same era', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=centuries');
    await page.getByRole('button', { name: 'Explore' }).click();
    await page.locator('button[data-era="restoration"]').click();
    await page
      .getByRole('group', { name: 'Viewing mode' })
      .getByRole('link', { name: 'Read' })
      .click();
    await expect(page).toHaveURL(/\/en\/read#chapter-centuries$/);
    await expect(page.locator('#era-restoration')).toContainText('UNESCO assisted');
    await page.goBack();
    await expect(page).toHaveURL(/chapter=centuries&era=restoration&mode=explore/);
    await expect(experience(page)).toHaveAttribute('data-hydrated', 'true');
    await page.getByRole('button', { name: 'Guided' }).click();
    await expect(page.locator('button[data-era="restoration"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(experience(page)).toHaveAttribute('data-mode', 'guided');
  });
});

test.describe('M2-T02 Architecture overlays', () => {
  test('feature list highlights the drawing, cites sources and syncs with the URL', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=architecture');
    const features = page.locator('button[data-feature]');
    expect(await features.count()).toBeGreaterThanOrEqual(3);
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });

    await page.getByRole('button', { name: 'Three circular platforms' }).click();
    await expect(page).toHaveURL(/chapter=architecture&feature=circular-platforms/);
    await expect(page.getByTestId('announcer-detail')).toHaveText(
      'Highlighted: Three circular platforms',
    );
    const detail = page.getByTestId('feature-detail');
    await expect(
      detail.getByText('The three round levels above the square terraces.'),
    ).toBeVisible();
    await expect(detail.getByRole('link', { name: /Source: UNESCO/ })).toBeVisible();

    await page.getByRole('button', { name: 'Diagram' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-view', 'diagram');
    const still = page.getByTestId('scene-still');
    await expect(still.locator('[data-highlighted="true"]')).toHaveCount(3);
    await expect(still.locator('[data-callouts] text')).toHaveCount(await features.count());
    await page.getByRole('button', { name: '3D model' }).click();
    await expect(stage(page)).toHaveAttribute('data-scene-view', '3d');

    await page.locator('button[data-feature="main-stupa"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/feature=main-stupa/);
    await page.goBack();
    await expect(page.locator('button[data-feature="circular-platforms"]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.getByRole('button', { name: 'Clear highlight' }).click();
    await expect(page).toHaveURL(/chapter=architecture$/);
    await expect(detail).toHaveCount(0);
  });

  test('works without the canvas: diagram only, deep link highlights, Indonesian text', async ({
    page,
  }) => {
    await disableWebGL(page);
    await openExperience(page, '/id/experience?chapter=architecture&feature=square-terraces');
    await expect(page.getByRole('button', { name: 'Model 3D' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Diagram' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByTestId('scene-still').locator('[data-highlighted="true"]')).toHaveCount(
      5,
    );
    await expect(page.getByTestId('feature-detail')).toContainText('lima teras persegi');
    await page.getByRole('button', { name: '72 stupa berterawang' }).click();
    await expect(
      page.getByTestId('scene-still').locator('[data-small-stupa][fill="var(--color-bronze)"]'),
    ).toHaveCount(6);
  });
});

test.describe('M2-T03 Living Reliefs', () => {
  test('catalog opens a clearly labelled demo story; Escape closes and restores focus', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=stories');
    const trigger = page.locator('[data-relief-open="demo-panel-01"]');
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: /How stories can be read in stone/ });
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/chapter=stories&relief=demo-panel-01/);
    await expect(dialog.getByText('DEMO ARTWORK — NOT ORIGINAL RELIEF')).toBeVisible();
    await expect(
      dialog.getByText('Demonstration artwork — not a specific original panel'),
    ).toBeVisible();
    await expect(
      dialog.getByText('does not correspond to any place on the monument'),
    ).toBeVisible();
    await expect(dialog.getByText('makes no historical statements')).toBeVisible();
    await expect(dialog.getByText('Artistic illustration')).toBeVisible();
    await expect(dialog.getByText('Original work authored in this repository')).toBeVisible();
    await expect(dialog.getByText('Story 1 of 2')).toBeVisible();

    const results = await new AxeBuilder({ page }).include('dialog[open]').analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const outside = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && el !== document.body && !el.closest('dialog');
      });
      expect(outside, 'focus escaped the dialog').toBe(false);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(page).toHaveURL(/chapter=stories$/);
  });

  test('previous/next move between stories without trapping; back closes the dialog', async ({
    page,
  }) => {
    await openExperience(page, '/en/experience?chapter=stories');
    await page.locator('[data-relief-open="demo-panel-01"]').click();
    const detail = page.getByTestId('relief-detail');
    await expect(detail.getByRole('button', { name: 'Previous story' })).toBeDisabled();
    await detail.getByRole('button', { name: 'Next story' }).click();
    await expect(detail).toHaveAttribute('data-relief-detail', 'demo-panel-02');
    await expect(page).toHaveURL(/relief=demo-panel-02/);
    await expect(detail.getByText('Story 2 of 2')).toBeVisible();
    await expect(detail.getByRole('button', { name: 'Next story' })).toBeDisabled();
    await expect(page.getByTestId('announcer-detail')).toContainText('Opened story 2');

    await page.goBack();
    await expect(detail).toHaveAttribute('data-relief-detail', 'demo-panel-01');
    await page.goBack();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(h1(page)).toHaveText('Stories in Stone');

    await page.locator('[data-relief-open="demo-panel-02"]').click();
    await detail.getByRole('button', { name: 'Close story' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('[data-relief-open="demo-panel-02"]')).toBeFocused();
  });

  test('a hotspot in the 3D scene opens the same record as the catalog', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=stories');
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    const hotspots = page.getByTestId('scene-hotspots').getByRole('button');
    await expect(hotspots).toHaveCount(2);
    for (const hotspot of await hotspots.all()) await expect(hotspot).toBeInViewport();

    await page.locator('[data-relief-open="demo-panel-02"]').click();
    await expect(page.getByTestId('relief-detail')).toHaveAttribute(
      'data-relief-detail',
      'demo-panel-02',
    );
    await page.keyboard.press('Escape');

    const hotspot = page.locator('[data-hotspot="demo-panel-01"]');
    await hotspot.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('relief-detail')).toHaveAttribute(
      'data-relief-detail',
      'demo-panel-01',
    );
    await page.keyboard.press('Escape');
    await expect(hotspot).toBeFocused();

    // Hotspots only exist in this chapter.
    await page.getByRole('button', { name: /^Next: / }).click();
    await expect(page.getByTestId('scene-hotspots').getByRole('button')).toHaveCount(0);
  });

  test('a deep link opens the dialog in Indonesian; closing lands on the catalog', async ({
    page,
  }) => {
    await openExperience(page, '/id/experience?relief=demo-panel-02');
    await expect(h1(page)).toHaveText('Kisah dalam Batu');
    const dialog = page.getByRole('dialog', { name: /Cara rangkaian panel disajikan/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('KARYA DEMO — BUKAN RELIEF ASLI')).toBeVisible();
    await expect(dialog.getByText('Karya demonstrasi — bukan panel asli tertentu')).toBeVisible();
    await dialog.getByRole('button', { name: 'Tutup kisah' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator('[data-relief-open]').first()).toBeFocused();
    await expect(page).toHaveURL(/\/id\/experience\?chapter=stories$/);
  });
});

test.describe('M2-T04 Journey to Enlightenment', () => {
  test('step up through the three realms by keyboard, with correct zones and a sourced recap', async ({
    page,
  }) => {
    await disableWebGL(page);
    await openExperience(page, '/en/experience?chapter=ascent');
    const still = page.getByTestId('scene-still');
    const zones = [
      { realm: 'kamadhatu', levels: 1, text: 'the base corresponds to Kamadhatu' },
      { realm: 'rupadhatu', levels: 5, text: 'the five square terraces correspond to Rupadhatu' },
      { realm: 'arupadhatu', levels: 4, text: 'three circular platforms and main stupa' },
    ];
    await expect(
      page.getByRole('button', { name: 'Down (this is the lowest zone)' }),
    ).toBeDisabled();
    for (const [index, zone] of zones.entries()) {
      await expect(page.locator(`button[data-realm="${zone.realm}"]`)).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(page.getByTestId('realm-detail')).toContainText(zone.text);
      await expect(still.locator('[data-highlighted="true"]')).toHaveCount(zone.levels);
      await expect(
        still.locator(`[data-realm="${zone.realm}"][data-highlighted="true"]`),
      ).toHaveCount(zone.levels);
      await expect(page.getByText(`Zone ${index + 1} of 3`)).toBeVisible();
      if (index < 2) {
        await page.locator('button[data-step="up"]').focus();
        await page.keyboard.press('Enter');
      }
    }
    await expect(page).toHaveURL(/chapter=ascent&realm=arupadhatu/);
    await expect(
      page.getByRole('button', { name: 'Up (this is the highest zone)' }),
    ).toBeDisabled();
    await page.getByRole('button', { name: /^Down: Rupadhatu/ }).click();
    await expect(page.getByTestId('announcer-detail')).toHaveText(
      'Realm: Rupadhatu — the realm of form',
    );

    const recap = page.getByTestId('recap');
    await expect(recap.getByRole('heading', { name: 'What this journey covered' })).toBeVisible();
    expect(await recap.locator('[data-claim]').count()).toBeGreaterThanOrEqual(7);
    expect(await recap.getByRole('link', { name: /Source: UNESCO/ }).count()).toBe(
      await recap.locator('[data-claim]').count(),
    );
    await expect(page.getByText('not a physical or historical route')).toBeVisible();
  });

  test('the 3D ascent follows the selected realm', async ({ page }) => {
    await openExperience(page, '/id/experience?chapter=ascent&realm=rupadhatu');
    await expect(stage(page)).toHaveAttribute('data-scene-status', 'ready', { timeout: 20_000 });
    await page.getByRole('button', { name: /^Naik: Arupadhatu/ }).click();
    await expect(page).toHaveURL(/realm=arupadhatu/);
    await expect(page.locator('.scene-backdrop[data-tone="arupadhatu"]')).toHaveCount(1);
    await expect(page.getByTestId('realm-detail')).toContainText('Arupadhatu');
  });
});

test.describe('M2-T05 Sources and About', () => {
  test('both locales list the same references, statements and media with rights', async ({
    page,
  }) => {
    const counts: Record<string, number[]> = {};
    for (const locale of ['en', 'id']) {
      await page.goto(`/${locale}/sources`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      counts[locale] = [
        await page.locator('[id^="source-"]').count(),
        await page.locator('[data-claim]').count(),
        await page.locator('[data-media]').count(),
        await page.locator('[data-evidence]').count(),
      ];
      const external = page.locator('main a[target="_blank"]');
      expect(await external.count()).toBeGreaterThan(5);
      for (const link of await external.all()) {
        await expect(link).toHaveAttribute('href', /^https:\/\//);
        await expect(link).toHaveAttribute('rel', /noopener/);
        expect((await link.innerText()).length).toBeGreaterThan(20);
      }
    }
    expect(counts.en).toEqual(counts.id);
    expect(counts.en![0]).toBeGreaterThanOrEqual(1);
    expect(counts.en![2]).toBe(4);

    await page.goto('/en/sources');
    await expect(
      page.getByRole('heading', { name: 'Statements this reference supports' }),
    ).toBeVisible();
    await expect(page.getByText('Original work authored in this repository').first()).toBeVisible();
    await expect(
      page.getByText('A public correction contact has not been designated yet'),
    ).toBeVisible();
  });

  test('About explains the method and limits in both languages and links back', async ({
    page,
  }) => {
    await page.goto('/en/about');
    await expect(page.getByRole('heading', { name: 'How the visuals were made' })).toBeVisible();
    await expect(
      page.getByText('No measurements, scans, photographs or surveyed data'),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Credits and licenses' })).toBeVisible();
    await expect(page.getByTestId('app-version')).toHaveText(
      /^Version \d+\.\d+\.\d+ — research prototype$/,
    );
    const en = await page.locator('main li').count();
    await page.getByRole('link', { name: 'Switch language to Bahasa Indonesia' }).click();
    await expect(page).toHaveURL(/\/id\/about$/);
    await expect(page.getByRole('heading', { name: 'Cara visual dibuat' })).toBeVisible();
    expect(await page.locator('main li').count()).toBe(en);
    await page.getByRole('link', { name: 'Sumber', exact: true }).click();
    await expect(page).toHaveURL(/\/id\/sources$/);
  });

  test('Read mode mirrors the M2 content: eras, features, reliefs and realms', async ({ page }) => {
    await page.goto('/id/read');
    await expect(page.locator('[id^="era-"]')).toHaveCount(4);
    await expect(page.locator('[id^="feature-"]')).toHaveCount(5);
    await expect(page.locator('[id^="realm-"]')).toHaveCount(3);
    await expect(page.getByText('KARYA DEMO — BUKAN RELIEF ASLI')).toHaveCount(2);
  });
});
