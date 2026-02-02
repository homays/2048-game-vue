import type { Board } from '../types/game';

interface MoveResult {
  board: Board;
  moved: boolean;
  scoreGained: number;
}

export function moveRow(row: number[]): { newRow: number[]; moved: boolean; score: number } {
  const nonZeros = row.filter(val => val !== 0);
  const newRow: number[] = [];
  let moved = false;
  let score = 0;
  
  for (let i = 0; i < nonZeros.length; i++) {
    if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
      const merged = nonZeros[i] * 2;
      newRow.push(merged);
      score += merged;
      moved = true;
      i++;
    } else {
      newRow.push(nonZeros[i]);
    }
  }
  
  while (newRow.length < 4) {
    newRow.push(0);
  }
  
  for (let i = 0; i < 4; i++) {
    if (row[i] !== newRow[i]) {
      moved = true;
    }
  }
  
  return { newRow, moved, score };
}

export function moveLeft(board: Board): MoveResult {
  let moved = false;
  let scoreGained = 0;
  const newBoard = board.map(row => {
    const result = moveRow(row);
    if (result.moved) moved = true;
    scoreGained += result.score;
    return result.newRow;
  });
  
  return { board: newBoard, moved, scoreGained };
}

export function moveRight(board: Board): MoveResult {
  let moved = false;
  let scoreGained = 0;
  const newBoard = board.map(row => {
    const result = moveRow([...row].reverse());
    if (result.moved) moved = true;
    scoreGained += result.score;
    return result.newRow.reverse();
  });
  
  return { board: newBoard, moved, scoreGained };
}

export function moveUp(board: Board): MoveResult {
  let moved = false;
  let scoreGained = 0;
  const newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(0));
  
  for (let x = 0; x < 4; x++) {
    const column = board.map(row => row[x]);
    const result = moveRow(column);
    if (result.moved) moved = true;
    scoreGained += result.score;
    
    for (let y = 0; y < 4; y++) {
      newBoard[y][x] = result.newRow[y];
    }
  }
  
  return { board: newBoard, moved, scoreGained };
}

export function moveDown(board: Board): MoveResult {
  let moved = false;
  let scoreGained = 0;
  const newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(0));
  
  for (let x = 0; x < 4; x++) {
    const column = board.map(row => row[x]).reverse();
    const result = moveRow(column);
    if (result.moved) moved = true;
    scoreGained += result.score;
    const reversed = result.newRow.reverse();
    
    for (let y = 0; y < 4; y++) {
      newBoard[y][x] = reversed[y];
    }
  }
  
  return { board: newBoard, moved, scoreGained };
}
