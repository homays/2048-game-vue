import type { Board, BoardSize } from '../types/game';

export const DEFAULT_BOARD_SIZE: BoardSize = 4;

export function createEmptyBoard(size: BoardSize = DEFAULT_BOARD_SIZE): Board {
  return Array(size).fill(null).map(() => Array(size).fill(0));
}

export function getEmptyCells(board: Board): { x: number; y: number }[] {
  const cells: { x: number; y: number }[] = [];
  const size = board.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === 0) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
}

export function hasEmptyCells(board: Board): boolean {
  return getEmptyCells(board).length > 0;
}

export function generateRandomValue(): number {
  return Math.random() < 0.9 ? 2 : 4;
}

export function cloneBoard(board: Board): Board {
  return board.map(row => [...row]);
}

export function isBoardFull(board: Board): boolean {
  return !hasEmptyCells(board);
}

export function canMerge(board: Board): boolean {
  const size = board.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = board[y][x];
      if (value === 0) return true;
      
      if (x < size - 1 && board[y][x + 1] === value) return true;
      if (y < size - 1 && board[y + 1][x] === value) return true;
    }
  }
  return false;
}

export function isGameOver(board: Board): boolean {
  return isBoardFull(board) && !canMerge(board);
}

export function getMaxTile(board: Board): number {
  let max = 0;
  const size = board.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] > max) {
        max = board[y][x];
      }
    }
  }
  return max;
}

export function getTargetScore(size: BoardSize): number {
  const targets: Record<BoardSize, number> = {
    3: 512,
    4: 2048,
    5: 4096,
    6: 8192
  };
  return targets[size];
}

export function getInitialTiles(size: BoardSize): number {
  return size <= 4 ? 2 : 3;
}
