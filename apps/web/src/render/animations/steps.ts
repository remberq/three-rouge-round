import { Text } from 'pixi.js';
import type { Application } from 'pixi.js';

import type { Coord, DropMove, SpawnMove } from '../../game/match3';
import type { CombatEvent } from '../../game/combat';

import type { AnimStep } from './queue';
import { tween } from './queue';
import { easeInOutQuad } from './easing';
import type { BoardView } from '../board/boardView';
import type { BoardLayout } from '../board/layout';
import { cellToWorld } from '../board/layout';

export function swapStep(params: {
  name?: string;
  app: Application;
  boardView: BoardView;
  layout: BoardLayout;
  a: Coord;
  b: Coord;
  durationMs?: number;
}): AnimStep {
  const { app, boardView, layout, a, b } = params;
  const durationMs = params.durationMs ?? 140;

  return {
    name: params.name ?? 'swap',
    run: async () => {
      const sa = boardView.getSpriteAt(a);
      const sb = boardView.getSpriteAt(b);
      if (!sa || !sb) return;

      const pa0 = { x: sa.root.x, y: sa.root.y };
      const pb0 = { x: sb.root.x, y: sb.root.y };

      await tween({
        ticker: app.ticker,
        durationMs,
        onUpdate: (t) => {
          const e = easeInOutQuad(t);
          sa.root.x = pa0.x + (pb0.x - pa0.x) * e;
          sa.root.y = pa0.y + (pb0.y - pa0.y) * e;
          sb.root.x = pb0.x + (pa0.x - pb0.x) * e;
          sb.root.y = pb0.y + (pa0.y - pb0.y) * e;
        },
      });

      // update internal mapping
      boardView.swapCoords(a, b);

      // snap to grid
      boardView.snapToLayout(layout);
    },
  };
}

export function highlightStep(params: {
  name?: string;
  app: Application;
  boardView: BoardView;
  cells: Coord[];
  durationMs?: number;
}): AnimStep {
  const durationMs = params.durationMs ?? 120;
  return {
    name: params.name ?? 'highlight',
    run: async () => {
      params.boardView.setHighlight(params.cells, true);
      await new Promise((r) => setTimeout(r, durationMs));
      params.boardView.setHighlight(params.cells, false);
    },
  };
}

export function clearStep(params: {
  name?: string;
  app: Application;
  boardView: BoardView;
  cells: Coord[];
  durationMs?: number;
}): AnimStep {
  const durationMs = params.durationMs ?? 140;
  return {
    name: params.name ?? 'clear',
    run: async () => {
      const sprites = params.cells
        .map((c) => params.boardView.getSpriteAt(c))
        .filter((s): s is NonNullable<typeof s> => Boolean(s));

      await tween({
        ticker: params.app.ticker,
        durationMs,
        onUpdate: (t) => {
          const e = easeInOutQuad(t);
          for (const s of sprites) {
            s.root.alpha = 1 - e;
            s.root.scale.set(1 - 0.2 * e);
          }
        },
      });

      params.boardView.removeAt(params.cells);
    },
  };
}

export function dropStep(params: {
  name?: string;
  app: Application;
  boardView: BoardView;
  layout: BoardLayout;
  drops: DropMove[];
  durationMs?: number;
}): AnimStep {
  const durationMs = params.durationMs ?? 160;
  return {
    name: params.name ?? 'drop',
    run: async () => {
      const moves = params.drops
        .map((m) => {
          const s = params.boardView.getSpriteAt(m.from);
          if (!s) return null;
          return { m, s, fromX: s.root.x, fromY: s.root.y };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x));

      await tween({
        ticker: params.app.ticker,
        durationMs,
        onUpdate: (t) => {
          const e = easeInOutQuad(t);
          for (const { m, s, fromX, fromY } of moves) {
            const to = cellToWorld(params.layout, m.to);
            s.root.x = fromX + (to.x + 2 - fromX) * e;
            s.root.y = fromY + (to.y + 2 - fromY) * e;
          }
        },
      });

      params.boardView.applyDrops(params.drops);
      params.boardView.snapToLayout(params.layout);
    },
  };
}

export function spawnStep(params: {
  name?: string;
  app: Application;
  boardView: BoardView;
  layout: BoardLayout;
  spawns: SpawnMove[];
  durationMs?: number;
}): AnimStep {
  const durationMs = params.durationMs ?? 180;
  return {
    name: params.name ?? 'spawn',
    run: async () => {
      const created = params.boardView.createSpawns(params.spawns, params.layout);

      await tween({
        ticker: params.app.ticker,
        durationMs,
        onUpdate: (t) => {
          const e = easeInOutQuad(t);
          for (const c of created) {
            c.sprite.root.y = c.fromY + (c.toY - c.fromY) * e;
            c.sprite.root.alpha = 0.7 + 0.3 * e;
          }
        },
      });

      params.boardView.snapToLayout(params.layout);
    },
  };
}

export function damagePopupStep(params: {
  app: Application;
  layout: BoardLayout;
  stage: import('pixi.js').Container;
  events: CombatEvent[];
}): AnimStep {
  return {
    name: 'damagePopups',
    run: async () => {
      const damage = params.events.filter((e) => e.type === 'DamageDealt');
      if (damage.length === 0) return;

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
        txt.x = params.layout.originX + 30;
        txt.y = params.layout.originY - 30 + (d.target === 'hero' ? 0 : -24);

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

export function shakeBoardStep(params: { app: Application; boardView: BoardView }): AnimStep {
  return {
    name: 'shake',
    run: async () => {
      const x0 = params.boardView.root.x;
      const y0 = params.boardView.root.y;
      const amp = 6;

      await tween({
        ticker: params.app.ticker,
        durationMs: 180,
        onUpdate: (t) => {
          const s = Math.sin(t * Math.PI * 6);
          params.boardView.root.x = x0 + s * amp * (1 - t);
          params.boardView.root.y = y0;
        },
      });

      params.boardView.root.x = x0;
      params.boardView.root.y = y0;
    },
  };
}
