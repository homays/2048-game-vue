<template>
  <div class="score-board">
    <div class="score-row">
      <div class="score-container">
        <div class="score-label">得分</div>
        <div class="score-value" :class="{ 'highlight': scoreChanged }">{{ score }}</div>
      </div>
      <div class="score-container">
        <div class="score-label">最高分</div>
        <div class="score-value">{{ bestScore }}</div>
      </div>
      <div class="score-container">
        <div class="score-label">步数</div>
        <div class="score-value">{{ moveCount }}</div>
      </div>
      <div class="score-container">
        <div class="score-label">最大</div>
        <div class="score-value">{{ maxTile }}</div>
      </div>
    </div>
    <div class="game-info">
      <span class="board-size">{{ boardSize }}×{{ boardSize }}</span>
      <span v-if="mode === 'endless'" class="mode-badge">无尽</span>
      <span class="undo-count">撤销: {{ undoCount }}/{{ maxUndo }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BoardSize, GameMode } from '../types/game';

interface Props {
  score: number;
  bestScore: number;
  moveCount: number;
  maxTile: number;
  boardSize: BoardSize;
  mode: GameMode;
  undoCount: number;
}

const props = defineProps<Props>();

const scoreChanged = ref(false);
const maxUndo = 10;

watch(() => props.score, () => {
  scoreChanged.value = true;
  setTimeout(() => {
    scoreChanged.value = false;
  }, 300);
});
</script>

<style scoped>
.score-board {
  margin-bottom: 15px;
}

.score-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.score-container {
  background: #bbada0;
  padding: 8px 16px;
  border-radius: 6px;
  text-align: center;
  min-width: 60px;
}

.score-label {
  color: #eee4da;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.score-value {
  color: white;
  font-size: 20px;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.score-value.highlight {
  animation: scorePop 0.3s ease;
}

@keyframes scorePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); color: #f2b179; }
  100% { transform: scale(1); }
}

.game-info {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #8f7a66;
}

.board-size {
  background: #d6cdc4;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: bold;
}

.mode-badge {
  background: #f2b179;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: bold;
}

.undo-count {
  color: #8f7a66;
}

@media (max-width: 600px) {
  .score-row {
    gap: 5px;
  }
  
  .score-container {
    padding: 6px 12px;
    min-width: 50px;
  }
  
  .score-label {
    font-size: 10px;
  }
  
  .score-value {
    font-size: 16px;
  }
  
  .game-info {
    font-size: 11px;
  }
}
</style>
