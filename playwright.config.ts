import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
// Point the suite at an already running instance (a container or a hosted preview)
// with E2E_BASE_URL=https://… ; no local server is started in that case.
const externalBaseURL = process.env.E2E_BASE_URL;
// A second build with a placeholder key switches the optional Google Maps flight
// on (ADR-025). Its tests stub the Google script, so nothing leaves the machine,
// and the main build keeps proving that the default site is same-origin only.
const FLYOVER_PORT = 3101;
const FLYOVER_SPEC = /flyover\.spec\.ts/;
const flyoverEnv = {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'e2e-placeholder-key',
  NEXT_DIST_DIR: '.next-flyover',
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Software-rendered WebGL is CPU hungry; too many parallel browsers cause timing flakes.
  workers: 2,
  // Headroom for software WebGL on shared or busy machines.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalBaseURL ?? `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    launchOptions: {
      // Software WebGL so the "scene works" path is testable on headless CI.
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
    },
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: FLYOVER_SPEC,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testIgnore: FLYOVER_SPEC,
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
    // Only against the local keyed build; a hosted preview may have no key.
    ...(externalBaseURL
      ? []
      : [
          {
            name: 'flyover-desktop',
            testMatch: FLYOVER_SPEC,
            use: {
              ...devices['Desktop Chrome'],
              viewport: { width: 1440, height: 900 },
              baseURL: `http://localhost:${FLYOVER_PORT}`,
            },
          },
          {
            name: 'flyover-mobile',
            testMatch: FLYOVER_SPEC,
            use: {
              ...devices['Pixel 7'],
              viewport: { width: 390, height: 844 },
              baseURL: `http://localhost:${FLYOVER_PORT}`,
            },
          },
        ]),
  ],
  webServer: externalBaseURL
    ? undefined
    : [
        {
          command: `pnpm build && pnpm start --port ${PORT}`,
          url: `http://localhost:${PORT}`,
          reuseExistingServer: !process.env.CI,
          timeout: 240_000,
        },
        {
          command: `pnpm exec next build && pnpm exec next start --port ${FLYOVER_PORT}`,
          url: `http://localhost:${FLYOVER_PORT}`,
          reuseExistingServer: !process.env.CI,
          timeout: 240_000,
          env: flyoverEnv,
        },
      ],
});
