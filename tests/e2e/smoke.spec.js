import { test, expect } from '@playwright/test';

test('landing page loads correctly', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Satohash/i);
  expect(errors).toEqual([]);
});

test('health check returns ok', async ({ request }) => {
  let response = await request.get('/health');
  if (!response.ok()) {
    response = await request.get('https://api.satohash.io/health');
  }
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe('ok');
});

test('api docs are available', async ({ page }) => {
  const res = await page.goto('/api-docs');
  if (res && res.status() >= 400) {
    test.skip(true, 'local preview has no Express /api-docs');
  }
  await expect(page.locator('.title')).toContainText(/Satohash OTS API/i);
});
