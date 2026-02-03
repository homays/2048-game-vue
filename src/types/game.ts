export type Board = number[][];

export type BoardSize = 3 | 4 | 5 | 6;

export type GameMode = 'classic' | 'endless' | 'time' | 'step' | 'challenge';

export interface GameConfig {
  size: BoardSize;
  targetScore: number;
  initialTiles: number;
  mode: GameMode;
}

export interface GameHistory {
  board: Board;
  score: number;
  moveCount: number;
  maxTile: number;
}

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  config: GameConfig;
  moveCount: number;
  maxTile: number;
  startTime: number;
  history: GameHistory[];
  undoCount: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface LeaderboardEntry {
  id: string;
  score: number;
  maxTile: number;
  moveCount: number;
  boardSize: BoardSize;
  mode: GameMode;
  date: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    board: string;
    cell: string;
    text: string;
    tiles: Record<number, {
      background: string;
      text: string;
    }>;
  };
}
