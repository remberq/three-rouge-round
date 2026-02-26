import './style.css';

import { createRng, createBoard } from './game/match3';
import { DEFAULT_ENEMY, DEFAULT_HERO } from './game/combat';
import { initCombatState, resolvePlayerMove } from './game/combat';

import { createPixiApp } from './render/pixi/app';
import { BoardView } from './render/board/boardView';
import { computeBoardLayout } from './render/board/layout';
import { AnimationQueue } from './render/animations/queue';

async function main() {
  const host = document.querySelector<HTMLDivElement>('#app');
  if (!host) throw new Error('Missing #app root element');

  const app = await createPixiApp(host);

  // Initial game state
  const seed = 123;
  const rng = createRng(seed);
  const board = createBoard(rng, { width: 8, height: 8, allowInitialMatches: false });
  let state = initCombatState({ hero: DEFAULT_HERO, enemy: DEFAULT_ENEMY, board, rngState: rng.getState() });

  // Views
  const boardView = new BoardView();
  app.stage.addChild(boardView.root);

  const animQueue = new AnimationQueue();

  const syncLayout = () => {
    const layout = computeBoardLayout({
      viewWidth: app.renderer.width,
      viewHeight: app.renderer.height,
      cols: state.board.width,
      rows: state.board.height,
      cellSize: 56,
    });
    boardView.setLayout(layout);
    boardView.syncBoard(state.board);
  };

  app.renderer.on('resize', syncLayout);
  syncLayout();

  // Temporary: demo a single move after 1s (until input layer is implemented)
  setTimeout(async () => {
    if (animQueue.isRunning) return;

    const a = { x: 1, y: 0 };
    const b = { x: 1, y: 1 };

    const res = resolvePlayerMove(state, a, b);

    // For now: no detailed animations, just lock + swap final board.
    await animQueue.runSequential(app.ticker, []);
    state = res.state;
    boardView.syncBoard(state.board);
  }, 1000);
}

main().catch((err) => {
  console.error(err);
});
