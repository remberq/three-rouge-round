import { describe, expect, it } from 'vitest';

import { initRunState } from '../state';
import { deserializeRun, loadRun, RUN_SAVE_KEY, saveRun, serializeRun } from '../persist';

function makeMemStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    _map: map,
  };
}

describe('run persistence', () => {
  it('serialize/deserialize roundtrip', () => {
    const state = initRunState({ seed: 123, floorsCount: 5 });
    const raw = serializeRun(state);
    const parsed = deserializeRun(raw);
    expect(parsed).toEqual(state);
  });

  it('loadRun returns null on invalid json', () => {
    const storage = makeMemStorage();
    storage.setItem(RUN_SAVE_KEY, '{');
    expect(loadRun(storage)).toBeNull();
  });

  it('deserialize returns null on schema mismatch', () => {
    const state = initRunState({ seed: 1, floorsCount: 5 });
    const raw = JSON.stringify({ schemaVersion: 999, state });
    expect(deserializeRun(raw)).toBeNull();
  });

  it('deserialize returns null on malformed config', () => {
    const valid = initRunState({ seed: 1, floorsCount: 5 });

    // Create a deliberately malformed payload without using `any`.
    const malformedState = {
      ...valid,
      config: { floorsCount: 'nope' },
    };

    const raw = JSON.stringify({ schemaVersion: 1, state: malformedState });
    expect(deserializeRun(raw)).toBeNull();
  });

  it('migrates missing enemyClawWeight to default', () => {
    const valid = initRunState({ seed: 1, floorsCount: 5 });

    // Simulate older save without enemyClawWeight.
    const legacyState = {
      ...valid,
      config: { floorsCount: 5 },
    };

    const raw = JSON.stringify({ schemaVersion: 1, state: legacyState });
    const parsed = deserializeRun(raw);
    expect(parsed?.config.enemyClawWeight).toBe(1);
  });

  it('saveRun writes to key and loadRun reads it', () => {
    const storage = makeMemStorage();
    const state = initRunState({ seed: 7, floorsCount: 3 });
    saveRun(storage, state);
    expect(storage.getItem(RUN_SAVE_KEY)).toBeTruthy();
    expect(loadRun(storage)).toEqual(state);
  });
});
