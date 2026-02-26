import './style.css';

import { createRng, createBoard } from './game/match3';
import { DEFAULT_ENEMY, DEFAULT_HERO } from './game/combat';
import { initCombatState, resolvePlayerMove } from './game/combat';

import { createPixiApp } from './render/pixi/app';
import { BoardView } from './render/board/boardView';
import { BoardInput } from './render/board/input';
import { computeBoardLayout } from './render/board/layout';
import { AnimationQueue } from './render/animations/queue';
import {
  clearStep,
  dropStep,
  highlightStep,
  shakeBoardStep,
  spawnStep,
  swapStep,
} from './render/animations/steps';
import { enemyAttackFlashStep } from './render/animations/enemyAttack';
import { HudView } from './render/hud/hudView';
import { groupDamageEventsByMatchStep } from './render/animations/script';
import { damagePopupsStep } from './render/animations/damage';
import { waitStep } from './render/animations/wait';

async function main() {
  const host = document.querySelector<HTMLDivElement>('#app');
  if (!host) throw new Error('Missing #app root element');

  const app = await createPixiApp(host);

  // Ensure Pixi resizes reliably to the host element.
  // - On first load, resizeTo can start at 64x64.
  // - Host size can change after CSS/layout settles.
  const ro = new ResizeObserver(() => {
    app.resize();
    // Never full-sync during resize; only reposition current sprites.
    syncLayout({ fullSync: false });
  });
  ro.observe(host);

  // Force initial resize + layout sync.
  app.resize();

  // Initial game state
  const seed = 123;
  const rng = createRng(seed);
  const board = createBoard(rng, { width: 8, height: 8, allowInitialMatches: false });
  let state = initCombatState({ hero: DEFAULT_HERO, enemy: DEFAULT_ENEMY, board, rngState: rng.getState() });

  // Views
  const boardView = new BoardView();
  app.stage.addChild(boardView.root);

  const hud = new HudView();
  app.stage.addChild(hud.root);
  hud.sync(state);

  const animQueue = new AnimationQueue();

  let layout = computeBoardLayout({
    viewWidth: app.renderer.width,
    viewHeight: app.renderer.height,
    cols: state.board.width,
    rows: state.board.height,
    cellSize: 56,
  });

  const syncLayout = (opts: { fullSync?: boolean } = {}) => {
    // On first load, Pixi's resizeTo can lag a tick; guard against 0-sized renderer.
    if (app.renderer.width < 10 || app.renderer.height < 10) return;

    layout = computeBoardLayout({
      viewWidth: app.renderer.width,
      viewHeight: app.renderer.height,
      cols: state.board.width,
      rows: state.board.height,
      cellSize: 56,
    });
    boardView.setLayout(layout);

    // During animations the BoardView is a temporary "view state" and should NOT be reset
    // from game state (otherwise tiles can appear to teleport/re-roll).
    if (opts.fullSync && !animQueue.isRunning) {
      boardView.syncBoard(state.board);
    } else {
      boardView.snapToLayout(layout);
    }
  };

  app.renderer.on('resize', () => syncLayout({ fullSync: false }));

  // Kick initial sync after layout settles.
  syncLayout({ fullSync: true });
  requestAnimationFrame(() => syncLayout({ fullSync: true }));
  setTimeout(() => syncLayout({ fullSync: true }), 0);

  const input = new BoardInput(
    app,
    () => layout,
    () => ({ width: state.board.width, height: state.board.height }),
    () => animQueue.isRunning,
    async ({ a, b }) => {
      if (animQueue.isRunning) return;

      const res = resolvePlayerMove(state, a, b);
      const swap = res.swapResult;

      if (!swap || !swap.ok) {
        // Better invalid UX: shake only the attempted tiles if present.
        const sa = boardView.getSpriteAt(a);
        const sb = boardView.getSpriteAt(b);
        if (sa && sb) {
          const { invalidMoveShakeStep } = await import('./render/animations/invalidMove');
          await animQueue.runSequential(app.ticker, [invalidMoveShakeStep({ app, sprites: [sa, sb] })]);
        } else {
          await animQueue.runSequential(app.ticker, [shakeBoardStep({ app, boardView })]);
        }
        return;
      }

      // Build animation script
      const steps = [] as import('./render/animations/queue').AnimStep[];

      steps.push(swapStep({ app, boardView, layout, a, b }));

      const dmgByStep = groupDamageEventsByMatchStep(res.events);

      // For each resolve step (cascades), animate based on detailed mapping.
      // Convention: combat MatchStepResolved.stepIndex aligns with match3 cascade index.
      for (let i = 0; i < swap.cascades.length; i++) {
        const cs = swap.cascades[i];

        steps.push(highlightStep({ app, boardView, cells: cs.matches.flatMap((g) => g.cells) }));
        steps.push(clearStep({ app, boardView, cells: cs.clearedCells }));
        steps.push(dropStep({ app, boardView, layout, drops: cs.drops }));
        steps.push(waitStep({ app, ms: 70, name: 'settle' }));
        steps.push(spawnStep({ app, boardView, layout, spawns: cs.spawns }));

        const dmg = dmgByStep.get(i) ?? [];
        steps.push(damagePopupsStep({ app, stage: app.stage, origin: { x: layout.originX, y: layout.originY }, events: dmg }));
      }

      // Enemy attack visual (simple): flash HUD if an enemy attack happened.
      if (res.events.some((e) => e.type === 'EnemyAttack')) {
        steps.push(enemyAttackFlashStep({ app, target: hud.root }));
      }

      await animQueue.runSequential(app.ticker, steps);

      // Commit state and sync HUD/board
      state = res.state;
      hud.sync(state);
      boardView.syncBoard(state.board);
      // After committing state, it's safe to do a full sync.
      syncLayout({ fullSync: true });
    },
  );

  // Selected cell highlight (cheap; updates only on change)
  let lastSelected: { x: number; y: number } | null = null;
  app.ticker.add(() => {
    const sel = input.getSelected();
    if (sel?.x === lastSelected?.x && sel?.y === lastSelected?.y) return;
    lastSelected = sel ? { ...sel } : null;
    boardView.setSelected(lastSelected);
  });

  // keep for now
  void input;
}

main().catch((err) => {
  console.error(err);
});
