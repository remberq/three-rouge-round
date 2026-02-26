import type { CombatEvent, CombatState } from './types';
import { applyDamage } from './stats';

export function applyEvent(state: CombatState, event: CombatEvent): CombatState {
  switch (event.type) {
    case 'DamageDealt': {
      if (state.status !== 'active') return state;
      if (event.target === 'hero') {
        const { next } = applyDamage(state.hero, event.amount, event.damageType);
        const status = next.hp <= 0 ? 'lost' : state.status;
        return { ...state, hero: next, status };
      }
      const { next } = applyDamage(state.enemy, event.amount, event.damageType);
      const status = next.hp <= 0 ? 'won' : state.status;
      return { ...state, enemy: next, status };
    }

    case 'TurnEnded':
      return { ...state, turnCount: event.turnCount };

    case 'BattleEnded':
      return { ...state, status: event.result };

    default:
      return state;
  }
}
