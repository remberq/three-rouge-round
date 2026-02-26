import { createRng, trySwap } from '../match3';
import type { Coord, SwapResult } from '../match3';
import type { BridgeConfig } from './bridge';
import { eventsForSwapResult } from './bridge';
import { DEFAULT_ENEMY, DEFAULT_HERO, DEFAULT_TILE_DEFS } from './defs';
import type { CombatEvent, CombatState, EnemyDef, HeroDef, TileDef } from './types';
import { applyEvent } from './reducer';

export type ResolveConfig = {
  hero?: HeroDef;
  enemy?: EnemyDef;
  tileDefs?: Record<string, TileDef>;
};

export function resolvePlayerMove(
  state: CombatState,
  a: Coord,
  b: Coord,
  cfg: ResolveConfig = {},
): { state: CombatState; events: CombatEvent[]; swapResult?: SwapResult } {
  const events: CombatEvent[] = [];
  if (state.status !== 'active') return { state, events };

  // hero def is currently unused (reserved for future formulas/effects)
  void (cfg.hero ?? DEFAULT_HERO);
  const enemy = cfg.enemy ?? DEFAULT_ENEMY;
  const tileDefs = cfg.tileDefs ?? DEFAULT_TILE_DEFS;

  events.push({ type: 'PlayerMoveAttempted', a, b });

  const rng = createRng(state.rngState);
  const swap = trySwap(state.board, a, b, rng);
  const nextRngState = rng.getState();

  if (!swap.ok) {
    events.push({ type: 'SwapRejected', a, b });
    return { state: { ...state, rngState: nextRngState }, events, swapResult: swap };
  }

  // Bridge match3 -> combat events
  const bridgeCfg: BridgeConfig = { tileDefs };
  events.push(...eventsForSwapResult(swap, bridgeCfg));

  // Update board immediately
  let next: CombatState = { ...state, board: swap.finalBoard, rngState: nextRngState };

  // Apply damage events
  for (const e of events) {
    next = applyEvent(next, e);
    if (next.status !== 'active') break;
  }

  // Turn ends only for valid swaps
  const turnCount = state.turnCount + 1;
  events.push({ type: 'TurnEnded', turnCount });
  next = applyEvent(next, { type: 'TurnEnded', turnCount });

  // Enemy attack after player turn resolution
  if (next.status === 'active' && enemy.attackEveryTurns > 0 && turnCount % enemy.attackEveryTurns === 0) {
    events.push({ type: 'EnemyAttack', amount: enemy.attackPower, damageType: enemy.attackType });
    events.push({
      type: 'DamageDealt',
      target: 'hero',
      amount: enemy.attackPower,
      damageType: enemy.attackType,
      source: `enemy:${enemy.id}`,
    });

    next = applyEvent(next, {
      type: 'DamageDealt',
      target: 'hero',
      amount: enemy.attackPower,
      damageType: enemy.attackType,
      source: `enemy:${enemy.id}`,
    });
  }

  // Battle ended event
  if (next.status !== 'active') {
    events.push({ type: 'BattleEnded', result: next.status });
  }

  return { state: next, events, swapResult: swap };
}
