import { expect, test } from '@playwright/test';

test('abilities: mage clawRage increases enemyClawWeight after enemy attack', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'New Run' }).click();

  // Switch enemy to mage.
  await page.evaluate(() => {
    // @ts-expect-error debug
    window.__TRR_DEBUG__.setEnemy('mage');
  });

  const w0 = await page.evaluate(() => {
    // @ts-expect-error debug
    return window.__TRR_DEBUG__.getEnemyClawWeight();
  });

  await page.evaluate(() => {
    // @ts-expect-error debug
    window.__TRR_DEBUG__.forceEnemyAttack();
  });

  const w1 = await page.evaluate(() => {
    // @ts-expect-error debug
    return window.__TRR_DEBUG__.getEnemyClawWeight();
  });

  expect(w1).toBeGreaterThan(w0);

  // Baseline still renders.
  await expect(page.locator('canvas')).toBeVisible();
});
