import { expect, test } from '@playwright/test';

test('baseline: battle screen renders (board + HUD)', async ({ page }) => {
  await page.goto('/');

  // Wait for Pixi canvas to be attached.
  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  // Allow layout + first render to settle.
  await page.waitForTimeout(500);

  await expect(page).toHaveScreenshot('baseline-battle.png', {
    fullPage: true,
  });
});
