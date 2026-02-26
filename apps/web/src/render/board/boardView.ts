import { Container, Graphics } from 'pixi.js';
import type { Board } from '../../game/match3';
import type { BoardLayout } from './layout';
import { cellToWorld } from './layout';
import { TileSprite } from './tileSprite';

export class BoardView {
  readonly root = new Container();

  private readonly frame = new Graphics();
  private layout: BoardLayout | null = null;

  private tilesByKey = new Map<string, TileSprite>();

  constructor() {
    this.root.addChild(this.frame);
  }

  setLayout(layout: BoardLayout) {
    this.layout = layout;
  }

  syncBoard(board: Board) {
    if (!this.layout) throw new Error('BoardView layout not set');

    // Frame
    const cellSize = this.layout.cellSize;
    const boardW = board.width * cellSize;
    const boardH = board.height * cellSize;
    this.frame.clear();
    this.frame.roundRect(
      this.layout.originX - 12,
      this.layout.originY - 12,
      boardW + 24,
      boardH + 24,
      14,
    );
    this.frame.fill({ color: 0x121a33, alpha: 1 });

    // Tiles
    const nextKeys = new Set<string>();

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const t = board.tiles[y * board.width + x];
        if (!t) continue;

        const key = `${x},${y}`;
        nextKeys.add(key);

        let ts = this.tilesByKey.get(key);
        if (!ts) {
          ts = new TileSprite(t, { x, y });
          this.tilesByKey.set(key, ts);
          this.root.addChild(ts.root);
        } else {
          ts.setTile(t);
          ts.coord = { x, y };
        }

        const p = cellToWorld(this.layout, { x, y });
        ts.root.x = p.x + 2;
        ts.root.y = p.y + 2;
        ts.render(cellSize);
      }
    }

    // Remove sprites for empty cells
    for (const [key, ts] of this.tilesByKey.entries()) {
      if (nextKeys.has(key)) continue;
      this.tilesByKey.delete(key);
      ts.root.destroy({ children: true });
    }
  }
}
