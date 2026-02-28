import type { RunState } from './types';
import { RUN_SCHEMA_VERSION } from './state';

export const RUN_SAVE_KEY = 'three-rouge-round.run.save' as const;

export type RunSaveEnvelopeV1 = {
  schemaVersion: 1;
  state: RunState;
};

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null;
}

function isRunStateLike(x: unknown): x is RunState {
  if (!isObject(x)) return false;

  // Minimal structural checks (MVP). Avoid hard failures, but reject obviously
  // malformed/tampered payloads so `loadRun()` is a safe fallback.
  if (x.schemaVersion !== 1) return false;
  if (typeof x.seed !== 'number') return false;
  if (typeof x.floorIndex !== 'number' || !Number.isFinite(x.floorIndex) || x.floorIndex < 0) return false;

  if (x.screen !== 'start' && x.screen !== 'battle' && x.screen !== 'between' && x.screen !== 'end') return false;

  const cfg = (x as Record<string, unknown>).config;
  if (!isObject(cfg)) return false;
  const floorsCount = (cfg as Record<string, unknown>).floorsCount;
  if (typeof floorsCount !== 'number' || !Number.isFinite(floorsCount) || floorsCount < 1) return false;

  // Back-compat: older EP-0004/5 saves won't have this field.
  const enemyClawWeight = (cfg as Record<string, unknown>).enemyClawWeight;
  if (enemyClawWeight !== undefined) {
    if (typeof enemyClawWeight !== 'number' || !Number.isFinite(enemyClawWeight) || enemyClawWeight <= 0) return false;
  }

  // Soft checks for fields used by UI flow.
  const endResult = (x as Record<string, unknown>).endResult;
  if (endResult !== null && endResult !== 'victory' && endResult !== 'defeat') return false;

  return true;
}

export function serializeRun(state: RunState): string {
  const env: RunSaveEnvelopeV1 = {
    schemaVersion: RUN_SCHEMA_VERSION,
    state,
  };
  return JSON.stringify(env);
}

export function deserializeRun(raw: string): RunState | null {
  try {
    const env = JSON.parse(raw) as unknown;
    if (!isObject(env)) return null;

    if (env.schemaVersion !== RUN_SCHEMA_VERSION) return null;

    const state = (env as Record<string, unknown>).state as unknown;
    if (!isRunStateLike(state)) return null;

    // Migrate missing config fields for schemaVersion 1 (best-effort).
    if (state && typeof state === 'object' && state !== null && 'config' in state) {
      const cfg = (state as Record<string, unknown>).config;
      if (typeof cfg === 'object' && cfg !== null) {
        const cfgObj = cfg as Record<string, unknown>;
        if (cfgObj.enemyClawWeight === undefined) {
          cfgObj.enemyClawWeight = 1;
        }
      }
    }

    return state;
  } catch {
    return null;
  }
}

export function saveRun(storage: Pick<Storage, 'setItem'>, state: RunState): void {
  try {
    storage.setItem(RUN_SAVE_KEY, serializeRun(state));
  } catch {
    // Ignore (quota/private mode). Persistence is best-effort.
  }
}

export function loadRun(storage: Pick<Storage, 'getItem'>): RunState | null {
  try {
    const raw = storage.getItem(RUN_SAVE_KEY);
    if (!raw) return null;
    return deserializeRun(raw);
  } catch {
    return null;
  }
}

export function clearRun(storage: Pick<Storage, 'removeItem'>): void {
  try {
    storage.removeItem(RUN_SAVE_KEY);
  } catch {
    // ignore
  }
}
