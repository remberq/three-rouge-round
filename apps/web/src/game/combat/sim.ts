import type { Coord } from '../match3';
import type { CombatState } from './types';
import { resolvePlayerMove } from './resolver';

export function runMoves(state: CombatState, moves: Array<[Coord, Coord]>): CombatState {
  let s = state;
  for (const [a, b] of moves) {
    s = resolvePlayerMove(s, a, b).state;
    if (s.status !== 'active') break;
  }
  return s;
}
