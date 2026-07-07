import { test, expect } from '@playwright/test';

test('landing page loads correctly', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Satohash/i);
  expect(errors).toEqual([]);
});

test('health check returns ok', async ({ request }) => {
  const response = await request.get('/health');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe('ok');
});

test('api docs are available', async ({ page }) => {
  await page.goto('/api-docs');
  await expect(page.locator('.title')).toContainText(/Satohash OTS API/i);
});
