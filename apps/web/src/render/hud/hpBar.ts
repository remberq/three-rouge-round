import { Container, Graphics } from 'pixi.js';

export class HpBar {
  readonly root = new Container();
  private bg = new Graphics();
  private fg = new Graphics();

  private widthPx: number;
  private heightPx: number;
  private color: number;

  constructor(widthPx: number, heightPx: number, color: number) {
    this.widthPx = widthPx;
    this.heightPx = heightPx;
    this.color = color;

    this.root.addChild(this.bg, this.fg);
    this.render(1);
  }

  render(ratio01: number) {
    const r = Math.max(0, Math.min(1, ratio01));

    this.bg.clear();
    this.bg.roundRect(0, 0, this.widthPx, this.heightPx, 6);
    this.bg.fill({ color: 0x202a44, alpha: 1 });

    this.fg.clear();
    this.fg.roundRect(0, 0, this.widthPx * r, this.heightPx, 6);
    this.fg.fill({ color: this.color, alpha: 1 });
  }
}
