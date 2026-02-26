import type { Application } from 'pixi.js';

import type { AnimStep } from './queue';
import { tween } from './queue';

export function enemyAttackFlashStep(params: { app: Application; target: { alpha: number } }): AnimStep {
  return {
    name: 'enemyAttackFlash',
    run: async () => {
      const a0 = params.target.alpha;
      await tween({
        ticker: params.app.ticker,
        durationMs: 160,
        onUpdate: (t) => {
          // flash by modulating alpha
          params.target.alpha = a0 * (0.6 + 0.4 * Math.sin(t * Math.PI));
        },
      });
      params.target.alpha = a0;
    },
  };
}
