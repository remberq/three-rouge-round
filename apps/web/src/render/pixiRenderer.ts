import { Application, Container, Graphics } from 'pixi.js';
import type { BoardState } from '../game/board';
import { iterCells } from '../game/board';

export type RendererConfig = {
  cellSizePx: number;
  marginPx: number;
  background: number;
};

const DEFAULTS: RendererConfig = {
  cellSizePx: 48,
  marginPx: 16,
  background: 0x0b1020,
};

export async function createPixiApp(host: HTMLElement) {
  const app = new Application();
  await app.init({
    resizeTo: host,
    background: DEFAULTS.background,
    antialias: true,
  });

  host.appendChild(app.canvas);
  return app;
}

export function renderBoardPlaceholder(app: Application, board: BoardState) {
  app.stage.removeChildren();

  const root = new Container();
  app.stage.addChild(root);

  const g = new Graphics();

  const { cellSizePx, marginPx } = DEFAULTS;
  const boardW = board.size.cols * cellSizePx;
  const boardH = board.size.rows * cellSizePx;

  // center the board in the current renderer size
  const x0 = Math.floor((app.renderer.width - boardW) / 2);
  const y0 = Math.floor((app.renderer.height - boardH) / 2);

  // background frame
  g.roundRect(x0 - marginPx, y0 - marginPx, boardW + marginPx * 2, boardH + marginPx * 2, 12);
  g.fill({ color: 0x121a33, alpha: 1 });

  for (const cell of iterCells(board.size)) {
    const x = x0 + cell.x * cellSizePx;
    const y = y0 + cell.y * cellSizePx;

    g.rect(x + 2, y + 2, cellSizePx - 4, cellSizePx - 4);
    g.fill({ color: (cell.x + cell.y) % 2 === 0 ? 0x223066 : 0x1b264f, alpha: 1 });
  }

  root.addChild(g);

  // Re-render on resize
  const onResize = () => renderBoardPlaceholder(app, board);
  app.renderer.on('resize', onResize);
}
