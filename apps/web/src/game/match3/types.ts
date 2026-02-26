export type TileId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export const TILE_IDS: readonly TileId[] = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export type Coord = { x: number; y: number };

export type Board = {
  width: number;
  height: number;
  // row-major 1D array: tiles[y*width + x]
  tiles: (TileId | null)[];
};

export type MatchOrientation = 'h' | 'v';

export type MatchGroup = {
  orientation: MatchOrientation;
  cells: Coord[];
  length: number;
  tile: TileId;
};

export type SpawnedTile = { at: Coord; tile: TileId };

export type DropMove = { from: Coord; to: Coord; tile: TileId };

export type SpawnMove = {
  to: Coord;
  tile: TileId;
  // For animation: where it spawns from (above the board)
  spawnFromY: number;
};

export type CascadeStep = {
  matches: MatchGroup[];
  clearedCells: Coord[];

  // For precise animations:
  // - drops describe which existing tiles moved from -> to after gravity.
  // - spawns describe which tiles appeared and where they came from.
  drops: DropMove[];
  spawns: SpawnMove[];

  // legacy-ish, kept for debugging convenience
  spawnedTiles: SpawnedTile[];
};

export type SwapResult = {
  ok: boolean;
  swapped: [Coord, Coord];
  matches: MatchGroup[];
  cascades: CascadeStep[];
  finalBoard: Board;
  debug?: string[];
};
