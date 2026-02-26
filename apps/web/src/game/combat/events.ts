import type { CombatEvent } from './types';

export type EventQueue = CombatEvent[];

export function push(q: EventQueue, e: CombatEvent): void {
  q.push(e);
}
