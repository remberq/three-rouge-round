import { expect, test } from '@playwright/test';

const RUN_SAVE_KEY = 'three-rouge-round.run.save';

test('start screen: continue disabled when no save', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'New Run' })).toBeVisible();
});

test('start screen: continue enabled when save exists', async ({ page }) => {
  await page.addInitScript(({ key }) => {
    localStorage.setItem(key, JSON.stringify({ schemaVersion: 1, state: { schemaVersion: 1, seed: 123, config: { floorsCount: 5 }, screen: 'battle', floorIndex: 0, combat: null, endResult: null, heroDef: { id: 'hero', baseStats: { hpMax: 10 } }, enemyDef: { id: 'enemy', name: 'Enemy', baseStats: { hpMax: 10 }, attackEveryTurns: 2, attackPower: 1, attackType: 'phys' } } }));
  }, { key: RUN_SAVE_KEY });

  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Continue' })).toBeEnabled();
});
