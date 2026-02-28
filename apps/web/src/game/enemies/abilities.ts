import type { CombatEvent } from '../combat';
import type { RunState } from '../run';

export function applyEnemyAbilities(state: RunState, events: CombatEvent[]): RunState {
  const ability = state.enemyDef.ability;
  if (!ability || ability.kind === 'none') return state;

  switch (ability.kind) {
    case 'clawRage': {
      const attacks = events.filter((e) => e.type === 'EnemyAttack').length;
      if (attacks <= 0) return state;

      const nextWeight = state.config.enemyClawWeight + attacks * ability.addEnemyClawWeightOnEnemyAttack;
      return {
        ...state,
        config: {
          ...state.config,
          enemyClawWeight: nextWeight,
        },
      };
    }

    default:
      return state;
  }
}
