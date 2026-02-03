import { ref, reactive, computed } from 'vue';
import type { GameState, Direction, BoardSize, GameMode, GameHistory, Achievement } from '../types/game';
import { 
  createEmptyBoard, 
  getEmptyCells, 
  generateRandomValue, 
  cloneBoard,
  isGameOver,
  getMaxTile,
  getTargetScore,
  getInitialTiles
} from '../utils/board';
import { moveLeft, moveRight, moveUp, moveDown } from '../utils/move';
import { 
  saveBestScore, 
  getBestScore, 
  saveBestScoreBySize,
  getBestScoresBySize,
  addLeaderboardEntry,
  getAchievements,
  updateAchievementProgress,
  incrementAchievementProgress,
  getSettings,
  saveSettings
} from '../utils/storage';
import { soundManager } from '../utils/sound';
import { getBestMove } from '../utils/ai';

const MAX_UNDO = 10;

export function useGameLogic() {
  const settings = getSettings();
  
  const gameState = reactive<GameState>({
    board: createEmptyBoard(settings.boardSize),
    score: 0,
    bestScore: getBestScore(),
    gameOver: false,
    won: false,
    config: {
      size: settings.boardSize,
      targetScore: getTargetScore(settings.boardSize),
      initialTiles: getInitialTiles(settings.boardSize),
      mode: 'classic'
    },
    moveCount: 0,
    maxTile: 0,
    startTime: Date.now(),
    history: [],
    undoCount: 0
  });

  const achievements = ref<Achievement[]>(getAchievements());
  const bestScoresBySize = ref(getBestScoresBySize());
  
  const canUndo = computed(() => gameState.history.length > 0 && gameState.undoCount < MAX_UNDO);
  const currentBestScore = computed(() => {
    return Math.max(gameState.bestScore, bestScoresBySize.value[gameState.config.size] || 0);
  });

  function addRandomTile(): void {
    const emptyCells = getEmptyCells(gameState.board);
    if (emptyCells.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { x, y } = emptyCells[randomIndex];
    gameState.board[y][x] = generateRandomValue();
  }

  function saveState(): void {
    const historyEntry: GameHistory = {
      board: cloneBoard(gameState.board),
      score: gameState.score,
      moveCount: gameState.moveCount,
      maxTile: gameState.maxTile
    };
    
    if (gameState.history.length >= MAX_UNDO) {
      gameState.history.shift();
    }
    gameState.history.push(historyEntry);
  }

  function initGame(size?: BoardSize, mode?: GameMode): void {
    const newSize = size || gameState.config.size;
    const newMode = mode || gameState.config.mode;
    
    gameState.config.size = newSize;
    gameState.config.mode = newMode;
    gameState.config.targetScore = getTargetScore(newSize);
    gameState.config.initialTiles = getInitialTiles(newSize);
    
    gameState.board = createEmptyBoard(newSize);
    gameState.score = 0;
    gameState.gameOver = false;
    gameState.won = false;
    gameState.moveCount = 0;
    gameState.maxTile = 0;
    gameState.startTime = Date.now();
    gameState.history = [];
    gameState.undoCount = 0;
    
    for (let i = 0; i < gameState.config.initialTiles; i++) {
      addRandomTile();
    }
    
    saveSettings({ boardSize: newSize });
    
    if (newSize === 3) {
      incrementAchievementProgress('play-3x3', 1);
    } else if (newSize === 5) {
      incrementAchievementProgress('play-5x5', 1);
    } else if (newSize === 6) {
      incrementAchievementProgress('play-6x6', 1);
    }
    
    achievements.value = getAchievements();
  }

  function undo(): boolean {
    if (!canUndo.value) return false;
    
    const previousState = gameState.history.pop();
    if (!previousState) return false;
    
    gameState.board = previousState.board;
    gameState.score = previousState.score;
    gameState.moveCount = previousState.moveCount;
    gameState.maxTile = previousState.maxTile;
    gameState.undoCount++;
    
    soundManager.playButton();
    return true;
  }

  function checkAchievements(scoreGained: number): void {
    const newUnlocks: Achievement[] = [];
    
    const maxTile = getMaxTile(gameState.board);
    
    if (maxTile >= 512) {
      const ach = updateAchievementProgress('reach-512', 1);
      if (ach) newUnlocks.push(ach);
    }
    if (maxTile >= 1024) {
      const ach = updateAchievementProgress('reach-1024', 1);
      if (ach) newUnlocks.push(ach);
    }
    if (maxTile >= 2048) {
      const ach = updateAchievementProgress('reach-2048', 1);
      if (ach) newUnlocks.push(ach);
    }
    if (maxTile >= 4096) {
      const ach = updateAchievementProgress('reach-4096', 1);
      if (ach) newUnlocks.push(ach);
    }
    
    const ach = incrementAchievementProgress('merge-100', 1);
    if (ach) newUnlocks.push(ach);
    incrementAchievementProgress('merge-1000', 1);
    
    if (gameState.won && gameState.undoCount === 0) {
      const noUndoAch = updateAchievementProgress('no-undo-win', 1);
      if (noUndoAch) newUnlocks.push(noUndoAch);
    }
    
    if (newUnlocks.length > 0) {
      achievements.value = getAchievements();
    }
  }

  function move(direction: Direction): void {
    if (gameState.gameOver) return;
    
    saveState();
    
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
    
    if (!result.moved) {
      gameState.history.pop();
      return;
    }
    
    gameState.board = result.board;
    gameState.score += result.scoreGained;
    gameState.moveCount++;
    
    if (result.scoreGained > 0) {
      const mergeValue = result.scoreGained;
      soundManager.playMerge(mergeValue);
    } else {
      soundManager.playMove();
    }
    
    gameState.maxTile = getMaxTile(gameState.board);
    
    if (gameState.score > gameState.bestScore) {
      gameState.bestScore = gameState.score;
      saveBestScore(gameState.bestScore);
    }
    
    saveBestScoreBySize(gameState.config.size, gameState.score);
    bestScoresBySize.value = getBestScoresBySize();
    
    addRandomTile();
    
    checkAchievements(result.scoreGained);
    
    if (!gameState.won && gameState.maxTile >= gameState.config.targetScore) {
      gameState.won = true;
      soundManager.playWin();
      
      if (gameState.config.mode !== 'endless') {
        addLeaderboardEntry({
          score: gameState.score,
          maxTile: gameState.maxTile,
          moveCount: gameState.moveCount,
          boardSize: gameState.config.size,
          mode: gameState.config.mode
        });
      }
    }
    
    if (isGameOver(gameState.board)) {
      gameState.gameOver = true;
      soundManager.playGameOver();
      
      addLeaderboardEntry({
        score: gameState.score,
        maxTile: gameState.maxTile,
        moveCount: gameState.moveCount,
        boardSize: gameState.config.size,
        mode: gameState.config.mode
      });
    }
  }

  function continueEndless(): void {
    if (gameState.won && gameState.config.mode === 'classic') {
      gameState.config.mode = 'endless';
      gameState.won = false;
    }
  }

  function getHint(): Direction | null {
    return getBestMove(gameState.board);
  }

  function restart(): void {
    soundManager.playButton();
    initGame();
  }

  function changeBoardSize(size: BoardSize): void {
    soundManager.playButton();
    initGame(size);
  }

  return {
    gameState,
    achievements,
    bestScoresBySize,
    canUndo,
    currentBestScore,
    move,
    undo,
    restart,
    initGame,
    continueEndless,
    getHint,
    changeBoardSize
  };
}
