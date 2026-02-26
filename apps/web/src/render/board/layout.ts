export type BoardLayout = {
  cellSize: number;
  originX: number;
  originY: number;
};

export function computeBoardLayout(params: {
  viewWidth: number;
  viewHeight: number;
  cols: number;
  rows: number;
  cellSize?: number;
}): BoardLayout {
  const cellSize = params.cellSize ?? 56;
  const boardW = params.cols * cellSize;
  const boardH = params.rows * cellSize;
  const originX = Math.floor((params.viewWidth - boardW) / 2);
  const originY = Math.floor((params.viewHeight - boardH) / 2);

  return { cellSize, originX, originY };
}

export function cellToWorld(layout: BoardLayout, c: { x: number; y: number }) {
  return {
    x: layout.originX + c.x * layout.cellSize,
    y: layout.originY + c.y * layout.cellSize,
  };
}
