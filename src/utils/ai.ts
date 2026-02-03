import type { Board, Direction } from '../types/game';
import { moveLeft, moveRight, moveUp, moveDown } from './move';

interface EvaluationWeights {
  emptyCells: number;
  maxTilePosition: number;
  monotonicity: number;
  smoothness: number;
  mergePotential: number;
}

const WEIGHTS: EvaluationWeights = {
  emptyCells: 100,
  maxTilePosition: 50,
  monotonicity: 30,
  smoothness: 20,
  mergePotential: 40
};

function simulateMove(board: Board, direction: Direction): { board: Board; moved: boolean; scoreGained: number } {
  switch (direction) {
    case 'left':
      return moveLeft(board);
    case 'right':
      return moveRight(board);
    case 'up':
      return moveUp(board);
    case 'down':
      return moveDown(board);
    default:
      return { board: board.map(row => [...row]), moved: false, scoreGained: 0 };
  }
}

function countEmptyCells(board: Board): number {
  let count = 0;
  const size = board.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] === 0) count++;
    }
  }
  return count;
}

function findMaxTilePosition(board: Board): { x: number; y: number; value: number } {
  let max = 0;
  let pos = { x: 0, y: 0 };
  const size = board.length;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board[y][x] > max) {
        max = board[y][x];
        pos = { x, y };
      }
    }
  }
  return { ...pos, value: max };
}

function isCorner(x: number, y: number, size: number): boolean {
  return (x === 0 || x === size - 1) && (y === 0 || y === size - 1);
}

function calculateMonotonicity(board: Board): number {
  const size = board.length;
  let score = 0;
  
  for (let y = 0; y < size; y++) {
    let rowDecreasing = true;
    let rowIncreasing = true;
    for (let x = 0; x < size - 1; x++) {
      if (board[y][x] < board[y][x + 1]) rowDecreasing = false;
      if (board[y][x] > board[y][x + 1]) rowIncreasing = false;
    }
    if (rowDecreasing || rowIncreasing) score += 1;
  }
  
  for (let x = 0; x < size; x++) {
    let colDecreasing = true;
    let colIncreasing = true;
    for (let y = 0; y < size - 1; y++) {
      if (board[y][x] < board[y + 1][x]) colDecreasing = false;
      if (board[y][x] > board[y + 1][x]) colIncreasing = false;
    }
    if (colDecreasing || colIncreasing) score += 1;
  }
  
  return score;
}

function calculateSmoothness(board: Board): number {
  const size = board.length;
  let score = 0;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size - 1; x++) {
      const diff = Math.abs(board[y][x] - board[y][x + 1]);
      score += diff === 0 ? 2 : 1 / (diff + 1);
    }
  }
  
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size - 1; y++) {
      const diff = Math.abs(board[y][x] - board[y + 1][x]);
      score += diff === 0 ? 2 : 1 / (diff + 1);
    }
  }
  
  return score;
}

function calculateMergePotential(board: Board): number {
  const size = board.length;
  let potential = 0;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size - 1; x++) {
      if (board[y][x] !== 0 && board[y][x] === board[y][x + 1]) {
        potential += board[y][x];
      }
    }
  }
  
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size - 1; y++) {
      if (board[y][x] !== 0 && board[y][x] === board[y + 1][x]) {
        potential += board[y][x];
      }
    }
  }
  
  return potential;
}

export function evaluateBoard(board: Board): number {
  let score = 0;
  
  const emptyCells = countEmptyCells(board);
  score += emptyCells * WEIGHTS.emptyCells;
  
  const maxTilePos = findMaxTilePosition(board);
  const size = board.length;
  const cornerBonus = isCorner(maxTilePos.x, maxTilePos.y, size) ? 100 : 0;
  score += cornerBonus * WEIGHTS.maxTilePosition;
  
  const monotonicity = calculateMonotonicity(board);
  score += monotonicity * WEIGHTS.monotonicity;
  
  const smoothness = calculateSmoothness(board);
  score += smoothness * WEIGHTS.smoothness;
  
  const mergePotential = calculateMergePotential(board);
  score += mergePotential * WEIGHTS.mergePotential;
  
  return score;
}

export function getBestMove(board: Board): Direction | null {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  let bestScore = -Infinity;
  let bestDirection: Direction | null = null;
  
  for (const direction of directions) {
    const result = simulateMove(board, direction);
    if (!result.moved) continue;
    
    const score = evaluateBoard(result.board);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  }
  
  return bestDirection;
}

export function getMoveSuggestion(board: Board): { direction: Direction; reasoning: string } | null {
  const bestMove = getBestMove(board);
  if (!bestMove) return null;
  
  const reasons: Record<Direction, string> = {
    up: '向上移动可以更好地组织大数字',
    down: '向下移动可以更好地组织大数字',
    left: '向左移动可以更好地组织大数字',
    right: '向右移动可以更好地组织大数字'
  };
  
  return {
    direction: bestMove,
    reasoning: reasons[bestMove]
  };
}
