export type Vec2 = { x: number; y: number };

export type BoardSize = { cols: number; rows: number };

// Deterministic placeholder state for now.
export type BoardState = {
  size: BoardSize;
};

export function createBoardState(size: BoardSize): BoardState {
  return { size };
}

export function* iterCells(size: BoardSize): Generator<Vec2> {
  for (let y = 0; y < size.rows; y++) {
    for (let x = 0; x < size.cols; x++) {
      yield { x, y };
    }
  }
}
