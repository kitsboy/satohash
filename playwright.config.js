import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
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
        ? /safari-chrome\.spec\.js|live-stamp-verify\.spec\.js/
        : /safari-chrome\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'webkit',
      testMatch: /(safari-chrome|mobile-stamp-loop)\.spec\.js/,
      use: { ...devices['iPhone 13'] },
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
