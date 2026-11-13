import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, experience, h1, openExperience, test } from './fixtures';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function expectAccessible(page: Page, label: string) {
  // Let entrance fades finish so contrast is measured on the final colours.
  await page.waitForTimeout(1300);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(
    results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target).join(' | ')}`,
    ),
    label,
  ).toEqual([]);
}

test.describe('accessibility', () => {
  test('static routes have no axe violations', async ({ page }) => {
    for (const path of ['/', '/en/read', '/id/read', '/en/sources', '/id/about']) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expectAccessible(page, path);
    }
  });

  test('the idle hero (still diagram) has no axe violations', async ({ page }) => {
    await openExperience(page);
    await expectAccessible(page, 'awakening (still)');
  });

  for (const chapter of ['centuries', 'architecture', 'stories', 'ascent']) {
    test(`chapter "${chapter}" with the 3D scene has no axe violations`, async ({ page }) => {
      await openExperience(page, `/id/experience?chapter=${chapter}`);
      await expect(page.getByTestId('scene-stage')).toHaveAttribute('data-scene-status', 'ready', {
        timeout: 20_000,
      });
      await expectAccessible(page, chapter);
    });
  }

  test('source drawer: modal dialog, lists evidence, Escape restores focus', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=architecture');
    const trigger = page.getByRole('button', { name: 'Sources and evidence' });
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: 'Sources for this chapter' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('UNESCO describes 72 openwork stupas')).toBeVisible();
    await expect(dialog.getByText('Draft — awaiting editorial review').first()).toBeVisible();
    await expect(
      dialog
        .getByRole('link', { name: /UNESCO World Heritage Centre, “Borobudur Temple Compounds”/ })
        .first(),
    ).toHaveAttribute('href', 'https://whc.unesco.org/en/list/592/');
    await expect(
      dialog.getByText('Original work authored in this repository').first(),
    ).toBeVisible();
    await expect(dialog.getByText('Artistic illustration').first()).toBeVisible();
    await expectAccessible(page, 'source drawer');

    // Focus never reaches the page behind the modal.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const behind = await page.evaluate(() => {
        const el = document.activeElement;
        return !!el && el !== document.body && !el.closest('dialog');
      });
      expect(behind, 'focus escaped the dialog').toBe(false);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();

    await trigger.click();
    await dialog.getByRole('button', { name: 'Close sources' }).click();
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('keyboard only: skip link, then complete the journey', async ({ page }) => {
    await openExperience(page);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main')).toBeFocused();

    await page.getByRole('button', { name: /^Next: / }).focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press('Enter');
    await expect(h1(page)).toHaveText('The Ascent');
    await expect(experience(page)).toHaveAttribute('data-chapter', 'ascent');

    const rail = page.getByRole('navigation', { name: 'Chapters' }).getByRole('link');
    await rail.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(h1(page)).toHaveText('Across Centuries');
  });

  test('no audio or video element exists; nothing autoplays', async ({ page }) => {
    await openExperience(page, '/en/experience?chapter=ascent');
    await expect(page.locator('audio, video')).toHaveCount(0);
  });
});
