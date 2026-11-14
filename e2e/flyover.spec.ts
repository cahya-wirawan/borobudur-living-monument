import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

/**
 * The optional Google Maps flight (ADR-025), against a build that has a
 * placeholder key. Google's script is replaced by a local stand-in, so these
 * tests prove the wiring — consent, controls, failure, focus — and not what
 * Google renders. The real map has to be checked by a person with a real key.
 */
const GOOGLE_SCRIPT = /^https:\/\/maps\.googleapis\.com\/maps\/api\/js\?/;

const STUB = `
(() => {
  window.__flyCalls = [];
  class StubMap3D extends HTMLElement {
    constructor(options) { super(); window.__flyOptions = options; }
    flyCameraTo(o) { window.__flyCalls.push(['to', o.durationMillis]); this.end(); }
    flyCameraAround(o) { window.__flyCalls.push(['around', o.durationMillis]); }
    stopCameraAnimation() { window.__flyCalls.push(['stop']); }
    end() { setTimeout(() => this.dispatchEvent(new Event('gmp-animationend')), 400); }
  }
  customElements.define('stub-map-3d', StubMap3D);
  window.google = { maps: { importLibrary: async () => ({ Map3DElement: StubMap3D }) } };
  const callback = new URL(document.currentScript.src).searchParams.get('callback');
  window[callback]();
})();`;

async function open(page: Page, path: string, google: 'stub' | 'blocked' = 'stub') {
  const problems: string[] = [];
  const googleRequests: string[] = [];
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('net::ERR_FAILED'))
      problems.push(`console.error: ${message.text()}`);
  });
  page.on('request', (request) => {
    const url = request.url();
    if (GOOGLE_SCRIPT.test(url)) googleRequests.push(url);
    else if (!url.startsWith('http://localhost') && !/^(data|blob):/.test(url))
      problems.push(`external request: ${url}`);
  });
  await page.route(GOOGLE_SCRIPT, (route) =>
    google === 'stub'
      ? route.fulfill({ contentType: 'text/javascript', body: STUB })
      : route.abort(),
  );
  await page.goto(path);
  await expect(page.getByTestId('experience')).toHaveAttribute('data-hydrated', 'true');
  return { problems, googleRequests };
}

const flyover = (page: Page) => page.getByTestId('flyover');

test('Google is contacted only after consent, and the flight then runs in the stage', async ({
  page,
}) => {
  const { problems, googleRequests } = await open(page, '/en/experience?chapter=architecture');
  const trigger = page.getByRole('button', { name: 'Fly over the real site' });
  await trigger.click();

  await expect(flyover(page)).toHaveAttribute('data-flyover-phase', 'consent');
  await expect(
    page.getByRole('heading', { name: 'Fly over the site with Google Maps' }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: /Google Privacy Policy/ })).toHaveAttribute(
    'rel',
    /noopener/,
  );
  expect(googleRequests, 'nothing sent before consent').toEqual([]);
  const consentAxe = await new AxeBuilder({ page }).analyze();
  expect(consentAxe.violations.map((v) => v.id)).toEqual([]);

  await page.getByRole('button', { name: 'Start the flight' }).click();
  await expect(flyover(page)).toHaveAttribute('data-flyover-phase', 'ready');
  expect(googleRequests).toHaveLength(1);
  expect(googleRequests[0]).toContain('libraries=maps3d');
  await expect(page.getByTestId('scene-stage')).toHaveAttribute('data-scene-view', 'flyover');
  await expect(page.getByTestId('flyover-label')).toContainText('Google Maps');
  await expect(page.getByTestId('flyover-note')).toContainText('third-party aerial imagery');
  await expect(page.getByTestId('flyover-caption')).toContainText('View 1 of 5.');

  // The tour advances by itself and circles at the second stop.
  await expect(page.getByTestId('flyover-caption')).toContainText('View 2 of 5.', {
    timeout: 15_000,
  });
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __flyCalls: string[][] }).__flyCalls))
    .toContainEqual(['around', 40000]);

  await page.getByRole('button', { name: 'Pause' }).click();
  await page.getByRole('button', { name: 'Next view' }).click();
  await expect(page.getByTestId('flyover-caption')).toContainText('Looking straight down.');
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible();
  const flightAxe = await new AxeBuilder({ page }).analyze();
  expect(flightAxe.violations.map((v) => v.id)).toEqual([]);

  // Our controls stay out of the strip where Google draws its logo and credits.
  const stageBox = (await flyover(page).boundingBox())!;
  for (const control of await flyover(page).getByRole('button').all()) {
    const box = (await control.boundingBox())!;
    expect(box.y + box.height).toBeLessThan(stageBox.y + stageBox.height - 48);
  }

  await page.getByRole('button', { name: 'Close the flight' }).click();
  await expect(flyover(page)).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('stub-map-3d')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('consent is remembered for the session and a chapter change ends the flight', async ({
  page,
}) => {
  const { problems } = await open(page, '/id/experience');
  await page.getByRole('button', { name: 'Terbang di atas situs asli' }).click();
  await page.getByRole('button', { name: 'Mulai penerbangan' }).click();
  await expect(flyover(page)).toHaveAttribute('data-flyover-phase', 'ready');
  await page.getByRole('button', { name: /^Lanjut: / }).click();
  await expect(flyover(page)).toHaveCount(0);

  await page.getByRole('button', { name: 'Terbang di atas situs asli' }).click();
  await expect(flyover(page)).toHaveAttribute('data-flyover-phase', 'ready');
  expect(problems).toEqual([]);
});

test('reduced motion: no automatic flight, views are stepped by hand', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { problems } = await open(page, '/en/experience');
  await page.getByRole('button', { name: 'Fly over the real site' }).click();
  await page.getByRole('button', { name: 'Start the flight' }).click();
  await expect(flyover(page)).toHaveAttribute('data-flyover-phase', 'ready');
  await expect(flyover(page)).toHaveAttribute('data-flyover-playing', 'false');
  await expect(page.getByRole('button', { name: 'Pause' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Next view' }).click();
  await expect(page.getByTestId('flyover-caption')).toContainText('View 2 of 5.');
  const calls = await page.evaluate(
    () => (window as unknown as { __flyCalls: (string | number)[][] }).__flyCalls,
  );
  expect(calls.filter(([kind]) => kind === 'around')).toEqual([]);
  expect(calls.filter(([kind]) => kind === 'to').every(([, ms]) => ms === 0)).toBe(true);
  expect(problems).toEqual([]);
});

test('when Google Maps is blocked the visitor gets a way back', async ({ page }) => {
  const { problems } = await open(page, '/en/experience?chapter=ascent', 'blocked');
  await page.getByRole('button', { name: 'Fly over the real site' }).click();
  await page.getByRole('button', { name: 'Start the flight' }).click();
  await expect(flyover(page).getByRole('alert')).toContainText('Google Maps did not load');
  await page.getByRole('button', { name: 'Close the flight' }).last().click();
  await expect(flyover(page)).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(problems).toEqual([]);
});

test('the keyed build widens the policy for Google only', async ({ request }) => {
  const csp = (await request.get('/en/experience')).headers()['content-security-policy'] ?? '';
  expect(csp).toContain('https://*.googleapis.com');
  expect(csp).toContain("frame-ancestors 'none'");
  expect(csp).toContain("object-src 'none'");
});
