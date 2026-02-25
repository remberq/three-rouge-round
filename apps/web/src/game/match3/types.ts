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

export type CascadeStep = {
  matches: MatchGroup[];
  clearedCells: Coord[];
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
