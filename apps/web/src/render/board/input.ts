import type { Application, FederatedPointerEvent } from 'pixi.js';

import type { BoardLayout } from './layout';

export type SwapIntent = { a: { x: number; y: number }; b: { x: number; y: number } };

export class BoardInput {
  private selected: { x: number; y: number } | null = null;
  private draggingFrom: { x: number; y: number } | null = null;

  private app: Application;
  private getLayout: () => BoardLayout;
  private getBoardSize: () => { width: number; height: number };
  private isLocked: () => boolean;
  private onSwap: (intent: SwapIntent) => void;

  constructor(
    app: Application,
    getLayout: () => BoardLayout,
    getBoardSize: () => { width: number; height: number },
    isLocked: () => boolean,
    onSwap: (intent: SwapIntent) => void,
  ) {
    this.app = app;
    this.getLayout = getLayout;
    this.getBoardSize = getBoardSize;
    this.isLocked = isLocked;
    this.onSwap = onSwap;

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.on('pointerdown', this.onPointerDown);
    this.app.stage.on('pointerup', this.onPointerUp);
    this.app.stage.on('pointerupoutside', this.onPointerUp);
    this.app.stage.on('pointermove', this.onPointerMove);
  }

  destroy() {
    this.app.stage.off('pointerdown', this.onPointerDown);
    this.app.stage.off('pointerup', this.onPointerUp);
    this.app.stage.off('pointerupoutside', this.onPointerUp);
    this.app.stage.off('pointermove', this.onPointerMove);
  }

  getSelected() {
    return this.selected;
  }

  clearSelected() {
    this.selected = null;
  }

  private onPointerDown = (e: FederatedPointerEvent) => {
    if (this.isLocked()) return;
    const cell = this.pointToCell(e.global.x, e.global.y);
    if (!cell) return;
    this.draggingFrom = cell;
  };

  private onPointerUp = (e: FederatedPointerEvent) => {
    if (this.isLocked()) return;
    const cell = this.pointToCell(e.global.x, e.global.y);
    this.draggingFrom = null;
    if (!cell) return;

    // click-select flow
    if (!this.selected) {
      this.selected = cell;
      return;
    }

    const a = this.selected;
    const b = cell;
    if (areNeighbors(a, b)) {
      this.selected = null;
      this.onSwap({ a, b });
      return;
    }

    // select new
    this.selected = cell;
  };

  private onPointerMove = (e: FederatedPointerEvent) => {
    if (this.isLocked()) return;
    if (!this.draggingFrom) return;

    const from = this.draggingFrom;
    const layout = this.getLayout();
    const dx = e.global.x - (layout.originX + from.x * layout.cellSize + layout.cellSize / 2);
    const dy = e.global.y - (layout.originY + from.y * layout.cellSize + layout.cellSize / 2);

    const threshold = layout.cellSize * 0.35;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

    const dir = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    const to = { x: from.x + dir.x, y: from.y + dir.y };
    if (!this.isInBounds(to)) return;

    this.draggingFrom = null;
    this.selected = null;
    this.onSwap({ a: from, b: to });
  };

  private isInBounds(c: { x: number; y: number }) {
    const s = this.getBoardSize();
    return c.x >= 0 && c.y >= 0 && c.x < s.width && c.y < s.height;
  }

  private pointToCell(px: number, py: number): { x: number; y: number } | null {
    const layout = this.getLayout();
    const { width, height } = this.getBoardSize();

    const x = Math.floor((px - layout.originX) / layout.cellSize);
    const y = Math.floor((py - layout.originY) / layout.cellSize);

    if (x < 0 || y < 0 || x >= width || y >= height) return null;
    return { x, y };
  }
}

function areNeighbors(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}
