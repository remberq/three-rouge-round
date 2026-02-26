import type { Application } from 'pixi.js';

import type { AnimStep } from './queue';
import { tween } from './queue';

export function invalidMoveShakeStep(params: {
  app: Application;
  sprites: Array<{ root: { x: number; y: number } }>;
}): AnimStep {
  return {
    name: 'invalidMoveShake',
    run: async () => {
      const bases = params.sprites.map((s) => ({ s, x0: s.root.x, y0: s.root.y }));
      const amp = 6;

      await tween({
        ticker: params.app.ticker,
        durationMs: 180,
        onUpdate: (t) => {
          const s = Math.sin(t * Math.PI * 6);
          for (const b of bases) {
            b.s.root.x = b.x0 + s * amp * (1 - t);
            b.s.root.y = b.y0;
          }
        },
      });

      for (const b of bases) {
        b.s.root.x = b.x0;
        b.s.root.y = b.y0;
      }
    },
  };
}
