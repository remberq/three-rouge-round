import { Container, Text } from 'pixi.js';
import type { CombatState } from '../../game/combat';

export class HudView {
  readonly root = new Container();

  private heroText = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 14 } });
  private enemyText = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 14 } });
  private turnText = new Text({ text: '', style: { fill: 0xffffff, fontFamily: 'monospace', fontSize: 14 } });

  constructor() {
    this.heroText.x = 12;
    this.heroText.y = 10;

    this.enemyText.x = 12;
    this.enemyText.y = 30;

    this.turnText.x = 12;
    this.turnText.y = 50;

    this.root.addChild(this.heroText, this.enemyText, this.turnText);
  }

  sync(state: CombatState) {
    const heroMax = state.hero.baseStats.hpMax ?? 1;
    const enemyMax = state.enemy.baseStats.hpMax ?? 1;

    this.heroText.text = `Hero HP: ${state.hero.hp}/${heroMax}`;
    this.enemyText.text = `Enemy HP: ${state.enemy.hp}/${enemyMax}`;
    this.turnText.text = `Turn: ${state.turnCount} (${state.status})`;
  }
}
