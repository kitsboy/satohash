import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // Fail the whole suite in <60s if the preview server is stalled/squatted
  // instead of letting 80 tests each hit their 30s goto timeout (~74 min).
  globalSetup: './tests/e2e/globalSetup.js',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: process.env.PLAYWRIGHT_SKIP_LIVE_LOOP
        ? /safari-chrome\.spec\.js|android-chrome\.spec\.js|live-stamp-verify\.spec\.js/
        : /safari-chrome\.spec\.js|android-chrome\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      testMatch: /(safari-chrome|mobile-stamp-loop|proof-card)\.spec\.js/,
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'pixel',
      testMatch: /(android-chrome|mobile-stamp-loop|proof-card)\.spec\.js/,
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'bash scripts/e2e-webserver.sh',
        url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000
      },
});
