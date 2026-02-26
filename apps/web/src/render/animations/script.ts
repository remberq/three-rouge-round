import type { CombatEvent } from '../../game/combat';

export type DamageEventsByStep = Map<number, CombatEvent[]>;

export function groupDamageEventsByMatchStep(events: CombatEvent[]): DamageEventsByStep {
  // We group DamageDealt events under the latest MatchStepResolved.stepIndex.
  // Anything after TurnEnded is not step-bound.
  const out = new Map<number, CombatEvent[]>();

  let currentStep: number | null = null;

  for (const e of events) {
    if (e.type === 'MatchStepResolved') {
      currentStep = e.stepIndex;
      if (!out.has(currentStep)) out.set(currentStep, []);
      continue;
    }

    if (e.type === 'TurnEnded' || e.type === 'EnemyAttack' || e.type === 'BattleEnded') {
      currentStep = null;
    }

    if (e.type === 'DamageDealt' && currentStep !== null) {
      out.get(currentStep)!.push(e);
    }
  }

  return out;
}
