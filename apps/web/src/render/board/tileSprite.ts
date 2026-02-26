import { Container, Graphics, Text } from 'pixi.js';
import type { TileId } from '../../game/match3';

export class TileSprite {
  readonly root = new Container();
  readonly gfx = new Graphics();
  readonly label: Text;

  tile: TileId;
  coord: { x: number; y: number };

  constructor(tile: TileId, coord: { x: number; y: number }) {
    this.tile = tile;
    this.coord = coord;

    this.label = new Text({
      text: tile,
      style: {
        fill: 0xffffff,
        fontSize: 20,
        fontFamily: 'monospace',
      },
    });

    this.label.anchor.set(0.5);

    this.root.addChild(this.gfx);
    this.root.addChild(this.label);
  }

  setTile(tile: TileId) {
    this.tile = tile;
    this.label.text = tile;
  }

  render(cellSize: number) {
    this.gfx.clear();
    this.gfx.roundRect(0, 0, cellSize - 4, cellSize - 4, 10);
    this.gfx.fill({ color: colorForTile(this.tile), alpha: 1 });

    this.label.x = (cellSize - 4) / 2;
    this.label.y = (cellSize - 4) / 2;
  }
}

function colorForTile(tile: TileId): number {
  switch (tile) {
    case 'A':
      return 0x2f6fff;
    case 'B':
      return 0xff5fd7;
    case 'C':
      return 0xff4d4d;
    case 'D':
      return 0x44dd88;
    case 'E':
      return 0xffcc33;
    case 'F':
      return 0xbb66ff;
  }
}
