export type Board = number[][];

export interface Tile {
  value: number;
  x: number;
  y: number;
  id: string;
  merged: boolean;
}

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
