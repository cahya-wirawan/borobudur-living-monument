import { expect, openExperience, test } from './fixtures';

const ROUTES = [
  '/',
  '/en/experience',
  '/id/experience?chapter=ascent',
  '/en/read',
  '/id/sources',
  '/en/about',
];

test.describe('security headers and privacy', () => {
  test.skip(({ isMobile }) => isMobile, 'responses do not depend on the viewport');

  test('every route sends the security headers and a same-origin CSP', async ({ request }) => {
    for (const route of ROUTES) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const headers = response.headers();
      const csp = headers['content-security-policy'] ?? '';
      for (const directive of [
        "default-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "font-src 'self'",
        "connect-src 'self'",
      ])
        expect(csp, `${route}: ${directive}`).toContain(directive);
      expect(csp, route).not.toContain('unsafe-eval');
      expect(csp, route).not.toMatch(/https?:\/\//);
      expect(headers['x-content-type-options'], route).toBe('nosniff');
      expect(headers['x-frame-options'], route).toBe('DENY');
      expect(headers['referrer-policy'], route).toBe('strict-origin-when-cross-origin');
      expect(headers['permissions-policy'], route).toContain('camera=()');
      expect(headers['strict-transport-security'], route).toContain('max-age=');
      expect(headers['x-powered-by'], route).toBeUndefined();
      expect(headers['set-cookie'], route).toBeUndefined();
    }
  });

  test('the policy does not break the app: full 3D journey with zero CSP violations', async ({
    page,
  }) => {
    const violations: string[] = [];
    await page.exposeFunction('__reportCsp', (detail: string) => violations.push(detail));
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (event) =>
        (window as unknown as { __reportCsp: (d: string) => void }).__reportCsp(
          `${event.violatedDirective} ${event.blockedURI}`,
        ),
      );
    });
    await openExperience(page);
    await page.getByRole('button', { name: 'Begin the journey' }).click();
    await expect(page.getByTestId('scene-stage')).toHaveAttribute('data-scene-status', 'ready', {
      timeout: 20_000,
    });
    for (let i = 0; i < 4; i++) await page.getByRole('button', { name: /^Next: / }).click();
    await page.getByRole('button', { name: 'Sources and evidence' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(violations).toEqual([]);
  });

  test('fingerprinted assets are immutable and pages are not indexable in prototype builds', async ({
    page,
    request,
  }) => {
    await page.goto('/en/read');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const script = await page.locator('script[src*="/_next/static/"]').first().getAttribute('src');
    expect(script).toBeTruthy();
    const asset = await request.get(script!);
    expect(asset.headers()['cache-control']).toContain('immutable');
    expect(asset.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('no cookies or web storage are written during a visit', async ({ page, context }) => {
    await openExperience(page, '/en/experience?chapter=stories');
    await page.locator('[data-relief-open="demo-panel-01"]').click();
    await page.keyboard.press('Escape');
    await page.goto('/id/read');
    expect(await context.cookies()).toEqual([]);
    expect(
      await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })),
    ).toEqual({ local: 0, session: 0 });
  });

  test('external links are https, open safely and are the only off-site destinations', async ({
    page,
  }) => {
    await page.goto('/en/sources');
    const hrefs = await page.locator('a[href^="http"]').evaluateAll((links) =>
      links.map((a) => ({
        href: a.getAttribute('href') ?? '',
        rel: a.getAttribute('rel') ?? '',
        target: a.getAttribute('target') ?? '',
      })),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const link of hrefs) {
      expect(link.href).toMatch(/^https:\/\/whc\.unesco\.org\//);
      expect(link.rel).toContain('noopener');
      expect(link.target).toBe('_blank');
    }
    expect(await page.locator('iframe, object, embed, form').count()).toBe(0);
  });
});
