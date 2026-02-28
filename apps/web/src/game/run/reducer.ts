import type { RunAction, RunState } from './types';
import { initFloorCombat, initRunState, makeEmptyRunState } from './state';
import { DEFAULT_ENEMY, DEFAULT_HERO } from '../combat';

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'NewRun': {
      return initRunState({ seed: action.seed, floorsCount: action.floorsCount });
    }

    case 'ContinueRunLoaded': {
      return action.state;
    }

    case 'ResetRun': {
      return makeEmptyRunState();
    }

    case 'StartBattle': {
      if (state.endResult) return state;

      const combat = initFloorCombat({
        seed: state.seed,
        floorIndex: state.floorIndex,
        heroDef: DEFAULT_HERO,
        enemyDef: DEFAULT_ENEMY,
      });

      return {
        ...state,
        screen: 'battle',
        combat,
      };
    }

    case 'BattleEnded': {
      if (action.result === 'lost') {
        return { ...state, screen: 'end', endResult: 'defeat' };
      }

      // won
      const isLastFloor = state.floorIndex >= state.config.floorsCount - 1;
      if (isLastFloor) {
        return { ...state, screen: 'end', endResult: 'victory' };
      }

      return { ...state, screen: 'between' };
    }

    case 'NextFloor': {
      const nextFloorIndex = Math.min(state.floorIndex + 1, state.config.floorsCount - 1);
      return {
        ...state,
        floorIndex: nextFloorIndex,
        screen: 'battle',
        combat: initFloorCombat({
          seed: state.seed,
          floorIndex: nextFloorIndex,
          heroDef: DEFAULT_HERO,
          enemyDef: DEFAULT_ENEMY,
        }),
      };
    }

    default: {
      return state;
    }
  }
}
