import type { Board, Coord, MatchGroup, TileId } from '../match3';

export type DamageType = 'phys' | 'magic';

export type StatId = 'hpMax' | 'atk' | 'armor' | 'matk' | 'marmor';

export type Stats = Partial<Record<StatId, number>>;

export type Modifier = {
  stat: StatId;
  kind: 'flat' | 'mult';
  value: number; // flat: add; mult: multiply (e.g. 1.2)
};

export type EntityKind = 'hero' | 'enemy';

export type Entity = {
  id: string;
  kind: EntityKind;
  baseStats: Stats;
  mods: Modifier[];
  hp: number;
};

export type TileDef = {
  id: TileId;
  damageType?: DamageType;
  basePower: number; // power at length 3
  perExtra: number; // + per tile above 3
  harmfulToHero?: boolean;
  tags?: string[];
};

export type HeroDef = {
  id: string;
  baseStats: Stats;
};

export type EnemyDef = {
  id: string;
  name: string;
  baseStats: Stats;
  attackEveryTurns: number;
  attackPower: number;
  attackType: DamageType;
};

export type BattleStatus = 'active' | 'won' | 'lost';

export type CombatState = {
  hero: Entity;
  enemy: Entity;
  board: Board;
  turnCount: number; // number of completed valid player turns
  rngState: number; // persisted match3 rng state
  status: BattleStatus;
};

export type CombatEvent =
  | { type: 'PlayerMoveAttempted'; a: Coord; b: Coord }
  | { type: 'SwapRejected'; a: Coord; b: Coord }
  | { type: 'MatchStepResolved'; stepIndex: number; groups: MatchGroup[] }
  | { type: 'DamageDealt'; target: EntityKind; amount: number; damageType: DamageType; source: string }
  | { type: 'EnemyAttack'; amount: number; damageType: DamageType }
  | { type: 'TurnEnded'; turnCount: number }
  | { type: 'BattleEnded'; result: 'won' | 'lost' };
