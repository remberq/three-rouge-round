import type { Application } from 'pixi.js';

import type { AnimStep } from './queue';

export function waitStep(params: { app: Application; ms: number; name?: string }): AnimStep {
  return {
    name: params.name ?? `wait(${params.ms}ms)`,
    run: async () => {
      await new Promise((r) => setTimeout(r, params.ms));
    },
  };
}
