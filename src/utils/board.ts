import type { Board } from '../types/game';

export const BOARD_SIZE = 4;

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
}

export function getEmptyCells(board: Board): { x: number; y: number }[] {
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
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
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      const value = board[y][x];
      if (value === 0) return true;
      
      if (x < BOARD_SIZE - 1 && board[y][x + 1] === value) return true;
      if (y < BOARD_SIZE - 1 && board[y + 1][x] === value) return true;
    }
  }
  return false;
}

export function isGameOver(board: Board): boolean {
  return isBoardFull(board) && !canMerge(board);
}
