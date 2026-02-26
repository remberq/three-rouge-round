import { Container, Text } from 'pixi.js';
import type { CombatState } from '../../game/combat';
import { HpBar } from './hpBar';

export class HudView {
  readonly root = new Container();

  private heroLabel = new Text({ text: 'HERO', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 12 } });
  private enemyLabel = new Text({ text: 'ENEMY', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 12 } });
  private turnText = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 14 } });

  private heroHpBar = new HpBar(180, 12, 0x44dd88);
  private enemyHpBar = new HpBar(180, 12, 0xff4d4d);

  constructor() {
    this.heroLabel.x = 12;
    this.heroLabel.y = 10;

    this.heroHpBar.root.x = 64;
    this.heroHpBar.root.y = 12;

    this.enemyLabel.x = 12;
    this.enemyLabel.y = 30;

    this.enemyHpBar.root.x = 64;
    this.enemyHpBar.root.y = 32;

    this.turnText.x = 12;
    this.turnText.y = 54;

    this.root.addChild(
      this.heroLabel,
      this.heroHpBar.root,
      this.enemyLabel,
      this.enemyHpBar.root,
      this.turnText,
    );
  }

  sync(state: CombatState) {
    const heroMax = state.hero.baseStats.hpMax ?? 1;
    const enemyMax = state.enemy.baseStats.hpMax ?? 1;

    this.heroHpBar.render(state.hero.hp / heroMax);
    this.enemyHpBar.render(state.enemy.hp / enemyMax);
    this.turnText.text = `Turn: ${state.turnCount} (${state.status})`;
  }
}
