import './style.css';

import { DEFAULT_HERO } from './game/combat';
import type { CombatState } from './game/combat';
import { resolvePlayerMove } from './game/combat';
import { initFloorCombat, initRunState, makeEmptyRunState, runReducer } from './game/run';
import type { RunState } from './game/run';
import { clearRunFromLocalStorage, createOverlays, loadRunFromLocalStorage, saveRunToLocalStorage } from './ui/overlays';

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

  // --- Run state (EP-0004)
  // Keep a battle initialized even on start screen so the baseline visuals remain stable.
  const defaultSeed = 123;

  const makePreviewRun = (): RunState => {
    const base = makeEmptyRunState();
    const combat = initFloorCombat({ seed: defaultSeed, floorIndex: 0, floorsCount: 5, heroDef: DEFAULT_HERO });
    return { ...base, seed: defaultSeed, combat, screen: 'start' };
  };

  let runState: RunState = makePreviewRun();
  const loaded = loadRunFromLocalStorage();
  if (loaded) {
    // Show Start screen with Continue rather than auto-resuming.
    // The saved state will be restored when the user presses Continue.
    runState = { ...loaded, screen: 'start' };
  }

  if (!runState.combat) {
    // Ensure we always have a battle state available for rendering, even on Start screen.
    runState = {
      ...runState,
      combat: initFloorCombat({ seed: runState.seed, floorIndex: runState.floorIndex, floorsCount: runState.config.floorsCount, heroDef: DEFAULT_HERO }),
    };
  }

  const combat = runState.combat;
  if (!combat) throw new Error('Missing combat state');

  let state: CombatState = combat;

  // Views
  const boardView = new BoardView();
  app.stage.addChild(boardView.root);

  const hud = new HudView();
  app.stage.addChild(hud.root);
  hud.sync(state);

  const syncFromRun = (next: RunState) => {
    runState = next;

    if (!runState.combat) {
      runState = {
        ...runState,
        combat: initFloorCombat({ seed: runState.seed, floorIndex: runState.floorIndex, floorsCount: runState.config.floorsCount, heroDef: DEFAULT_HERO }),
      };
    }

    const combat = runState.combat;
    if (!combat) throw new Error('Missing combat state after syncFromRun');
    state = combat;
    hud.sync(state);
    boardView.syncBoard(state.board);
    syncLayout({ fullSync: true });
    overlays.render(runState);
  };

  // UI overlays
  const overlays = createOverlays({
    onNewRun: (seed) => {
      const s = seed ?? (Date.now() >>> 0);
      const next = initRunState({ seed: s, floorsCount: 5 });
      saveRunToLocalStorage(next);
      syncFromRun(next);
    },
    onContinue: () => {
      const loadedRun = loadRunFromLocalStorage();
      if (!loadedRun) return;

      // Ended run → end screen.
      if (loadedRun.endResult) {
        const next = { ...loadedRun, screen: 'end' as const };
        saveRunToLocalStorage(next);
        syncFromRun(next);
        return;
      }

      // Restore whatever screen we were on (battle/reward/between).
      const next = { ...loadedRun };
      saveRunToLocalStorage(next);
      syncFromRun(next);
    },
    onReset: () => {
      clearRunFromLocalStorage();
      const next = makePreviewRun();
      syncFromRun(next);
    },
    onChooseUpgrade: (upgradeId) => {
      const next = runReducer(runState, { type: 'UpgradeChosen', upgradeId });
      saveRunToLocalStorage(next);
      syncFromRun(next);
    },
    onNextBattle: () => {
      const next = runReducer(runState, { type: 'NextFloor' });
      saveRunToLocalStorage(next);
      syncFromRun(next);
    },
    onStartNewAfterEnd: () => {
      const s = Date.now() >>> 0;
      const next = initRunState({ seed: s, floorsCount: 5 });
      saveRunToLocalStorage(next);
      syncFromRun(next);
    },
  });
  overlays.mount(host);
  overlays.render(runState);

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
    () => animQueue.isRunning || overlays.isBlockingInput(),
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

      // Commit combat state and sync HUD/board
      state = res.state;
      runState = { ...runState, combat: state };
      hud.sync(state);
      boardView.syncBoard(state.board);
      // After committing state, it's safe to do a full sync.
      syncLayout({ fullSync: true });

      // Run-screen transitions (MVP): react to combat status.
      if (state.status === 'won') {
        runState = runReducer(runState, { type: 'BattleEnded', result: 'won' });
      } else if (state.status === 'lost') {
        runState = runReducer(runState, { type: 'BattleEnded', result: 'lost' });
      }

      // Persist progress except on pure start screen.
      if (runState.screen !== 'start') saveRunToLocalStorage(runState);
      overlays.render(runState);
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

  // Debug hooks for Playwright e2e integration tests.
  (window as unknown as Record<string, unknown>).__TRR_DEBUG__ = {
    forceWin: () => {
      state = { ...state, status: 'won' };
      runState = runReducer({ ...runState, combat: state }, { type: 'BattleEnded', result: 'won' });
      saveRunToLocalStorage(runState);
      overlays.render(runState);
    },
    forceLose: () => {
      state = { ...state, status: 'lost' };
      runState = runReducer({ ...runState, combat: state }, { type: 'BattleEnded', result: 'lost' });
      saveRunToLocalStorage(runState);
      overlays.render(runState);
    },
  };

  // keep for now
  void input;
}

main().catch((err) => {
  console.error(err);
});
