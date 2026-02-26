import { Container, Graphics } from 'pixi.js';
import type { Board, TileId } from '../../game/match3';
import type { BoardLayout } from './layout';
import { cellToWorld } from './layout';
import { TileSprite } from './tileSprite';

export class BoardView {
  readonly root = new Container();

  private readonly frame = new Graphics();
  private layout: BoardLayout | null = null;

  private tilesByKey = new Map<string, TileSprite>();
  private highlighted = new Set<string>();
  private selectedKey: string | null = null;

  // simple pool to avoid frequent allocations
  private pool: TileSprite[] = [];

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
          ts = this.acquire(t, { x, y });
          this.tilesByKey.set(key, ts);
          this.root.addChild(ts.root);
        } else {
          ts.setTile(t);
          ts.coord = { x, y };
        }

        const p = cellToWorld(this.layout, { x, y });
        ts.root.x = p.x + 2;
        ts.root.y = p.y + 2;
        ts.root.alpha = 1;
        ts.root.scale.set(1);
        ts.render(cellSize);
        ts.root.tint = this.selectedKey === key ? 0xaaffff : this.highlighted.has(key) ? 0xffffaa : 0xffffff;
      }
    }

    // Remove sprites for empty cells
    for (const [key, ts] of this.tilesByKey.entries()) {
      if (nextKeys.has(key)) continue;
      this.tilesByKey.delete(key);
      this.release(ts);
    }
  }

  private acquire(tile: TileId, coord: { x: number; y: number }) {
    const ts = this.pool.pop() ?? new TileSprite(tile, coord);
    ts.setTile(tile);
    ts.coord = { ...coord };
    ts.root.visible = true;
    ts.root.alpha = 1;
    ts.root.scale.set(1);
    return ts;
  }

  private release(ts: TileSprite) {
    ts.root.visible = false;
    ts.root.removeFromParent();
    this.pool.push(ts);
  }

  getSpriteAt(c: { x: number; y: number }): TileSprite | undefined {
    return this.tilesByKey.get(`${c.x},${c.y}`);
  }

  swapCoords(a: { x: number; y: number }, b: { x: number; y: number }) {
    const ka = `${a.x},${a.y}`;
    const kb = `${b.x},${b.y}`;
    const sa = this.tilesByKey.get(ka);
    const sb = this.tilesByKey.get(kb);
    if (!sa || !sb) return;

    this.tilesByKey.set(ka, sb);
    this.tilesByKey.set(kb, sa);

    sa.coord = { ...b };
    sb.coord = { ...a };
  }

  applyDrops(drops: Array<{ from: { x: number; y: number }; to: { x: number; y: number } }>) {
    for (const m of drops) {
      const fromKey = `${m.from.x},${m.from.y}`;
      const toKey = `${m.to.x},${m.to.y}`;
      const s = this.tilesByKey.get(fromKey);
      if (!s) continue;
      this.tilesByKey.delete(fromKey);
      this.tilesByKey.set(toKey, s);
      s.coord = { ...m.to };
    }
  }

  createSpawns(
    spawns: Array<{ to: { x: number; y: number }; tile: TileId; spawnFromY: number }>,
    layout: BoardLayout,
  ): Array<{ sprite: TileSprite; fromY: number; toY: number }> {
    const created: Array<{ sprite: TileSprite; fromY: number; toY: number }> = [];
    const cellSize = layout.cellSize;

    for (const s of spawns) {
      const key = `${s.to.x},${s.to.y}`;
      const ts = this.acquire(s.tile, { ...s.to });
      this.tilesByKey.set(key, ts);
      this.root.addChild(ts.root);

      const to = cellToWorld(layout, s.to);
      const from = cellToWorld(layout, { x: s.to.x, y: s.spawnFromY });

      ts.root.x = to.x + 2;
      ts.root.y = from.y + 2;
      ts.root.alpha = 0.7;
      ts.render(cellSize);

      created.push({ sprite: ts, fromY: ts.root.y, toY: to.y + 2 });
    }

    return created;
  }

  removeAt(cells: Array<{ x: number; y: number }>) {
    for (const c of cells) {
      const key = `${c.x},${c.y}`;
      const s = this.tilesByKey.get(key);
      if (!s) continue;
      this.tilesByKey.delete(key);
      this.release(s);
    }
  }

  setHighlight(cells: Array<{ x: number; y: number }>, on: boolean) {
    for (const c of cells) {
      const key = `${c.x},${c.y}`;
      if (on) this.highlighted.add(key);
      else this.highlighted.delete(key);
      const s = this.tilesByKey.get(key);
      if (s) s.root.tint = this.selectedKey === key ? 0xaaffff : on ? 0xffffaa : 0xffffff;
    }
  }

  setSelected(cell: { x: number; y: number } | null) {
    const nextKey = cell ? `${cell.x},${cell.y}` : null;
    if (this.selectedKey === nextKey) return;

    // un-tint previous
    if (this.selectedKey) {
      const s = this.tilesByKey.get(this.selectedKey);
      if (s) s.root.tint = this.highlighted.has(this.selectedKey) ? 0xffffaa : 0xffffff;
    }

    this.selectedKey = nextKey;

    if (this.selectedKey) {
      const s = this.tilesByKey.get(this.selectedKey);
      if (s) s.root.tint = 0xaaffff;
    }
  }

  snapToLayout(layout: BoardLayout) {
    for (const [key, s] of this.tilesByKey.entries()) {
      const [xStr, yStr] = key.split(',');
      const x = Number(xStr);
      const y = Number(yStr);
      const p = cellToWorld(layout, { x, y });
      s.root.x = p.x + 2;
      s.root.y = p.y + 2;
    }
  }
}
