import { ref, reactive } from 'vue';
import type { GameState, Direction } from '../types/game';
import { 
  createEmptyBoard, 
  getEmptyCells, 
  generateRandomValue, 
  cloneBoard,
  isGameOver 
} from '../utils/board';
import { moveLeft, moveRight, moveUp, moveDown } from '../utils/move';
import { saveBestScore, getBestScore } from '../utils/storage';

export function useGameLogic() {
  const gameState = reactive<GameState>({
    board: createEmptyBoard(),
    score: 0,
    bestScore: getBestScore(),
    gameOver: false,
    won: false
  });

  function addRandomTile(): void {
    const emptyCells = getEmptyCells(gameState.board);
    if (emptyCells.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { x, y } = emptyCells[randomIndex];
    gameState.board[y][x] = generateRandomValue();
  }

  function initGame(): void {
    gameState.board = createEmptyBoard();
    gameState.score = 0;
    gameState.gameOver = false;
    gameState.won = false;
    
    addRandomTile();
    addRandomTile();
  }

  function move(direction: Direction): void {
    if (gameState.gameOver || gameState.won) return;
    
    const oldBoard = cloneBoard(gameState.board);
    let result;
    
    switch (direction) {
      case 'left':
        result = moveLeft(gameState.board);
        break;
      case 'right':
        result = moveRight(gameState.board);
        break;
      case 'up':
        result = moveUp(gameState.board);
        break;
      case 'down':
        result = moveDown(gameState.board);
        break;
      default:
        return;
    }
    
    gameState.board = result.board;
    
    if (result.moved) {
      gameState.score += result.scoreGained;
      
      if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
        saveBestScore(gameState.bestScore);
      }
      
      addRandomTile();
      
      if (isGameOver(gameState.board)) {
        gameState.gameOver = true;
      }
      
      checkWin();
    }
  }

  function checkWin(): void {
    if (gameState.won) return;
    
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (gameState.board[y][x] === 2048) {
          gameState.won = true;
          return;
        }
      }
    }
  }

  function restart(): void {
    initGame();
  }

  return {
    gameState,
    move,
    restart
  };
}
