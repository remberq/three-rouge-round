import { expect, test } from '@playwright/test';

// These tests use the debug hooks registered in main.ts.

test('integration: win -> between, next battle -> battle', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'New Run' }).click();

  // Force win via debug hook.
  await page.evaluate(() => {
    // @ts-expect-error debug
    window.__TRR_DEBUG__.forceWin();
  });

  await expect(page.locator('[data-screen="between"]')).toBeVisible();

  await page.getByRole('button', { name: 'Next battle' }).click();

  // Overlay should hide again.
  await expect(page.locator('[data-screen="between"]')).toHaveCount(0);

  // Baseline battle UI should still render.
  await expect(page.locator('canvas')).toBeVisible();
});

test('integration: lose -> end screen', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New Run' }).click();

  await page.evaluate(() => {
    // @ts-expect-error debug
    window.__TRR_DEBUG__.forceLose();
  });

  await expect(page.locator('[data-screen="end"]')).toBeVisible();
});
