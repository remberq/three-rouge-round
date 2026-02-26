import { Text } from 'pixi.js';
import type { Application, Container } from 'pixi.js';

import type { CombatEvent } from '../../game/combat';
import type { AnimStep } from './queue';
import { tween } from './queue';

export function damagePopupsStep(params: {
  app: Application;
  stage: Container;
  origin: { x: number; y: number };
  events: CombatEvent[];
}): AnimStep {
  return {
    name: 'damagePopups',
    run: async () => {
      const damage = params.events.filter((e) => e.type === 'DamageDealt');
      if (damage.length === 0) return;

      // Run sequentially (simple + deterministic for now)
      for (const d of damage) {
        const txt = new Text({
          text: `-${d.amount}`,
          style: {
            fill: d.target === 'hero' ? 0xff6666 : 0xffffff,
            fontSize: 18,
            fontFamily: 'monospace',
          },
        });
        txt.anchor.set(0.5);

        txt.x = params.origin.x + (d.target === 'hero' ? 40 : 160);
        txt.y = params.origin.y + (d.target === 'hero' ? 6 : 26);

        params.stage.addChild(txt);

        const y0 = txt.y;
        await tween({
          ticker: params.app.ticker,
          durationMs: 420,
          onUpdate: (t) => {
            txt.alpha = 1 - t;
            txt.y = y0 - 30 * t;
          },
        });
        txt.destroy();
      }
    },
  };
}
