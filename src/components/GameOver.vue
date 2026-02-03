<template>
  <div v-if="gameOver || won" class="game-over-overlay">
    <div class="game-over-content">
      <h2 class="game-over-title" :class="{ 'win': won && !gameOver }">
        {{ titleText }}
      </h2>
      <p class="game-over-score">最终得分: {{ score }}</p>
      <p v-if="newRecord" class="new-record">🎉 新纪录!</p>
      <div class="button-group">
        <button 
          v-if="won && !gameOver && mode !== 'endless'" 
          class="continue-button" 
          @click="$emit('continue')"
        >
          继续挑战
        </button>
        <button class="restart-button" @click="$emit('restart')">
          {{ gameOver ? '再来一局' : '新游戏' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GameMode } from '../types/game';

interface Props {
  gameOver: boolean;
  won: boolean;
  score: number;
  mode: GameMode;
  newRecord?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  restart: [];
  continue: [];
}>();

const titleText = computed(() => {
  if (props.gameOver) return '游戏结束';
  if (props.won) return '你赢了! 🎉';
  return '';
});
</script>

<style scoped>
.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(238, 228, 218, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-over-content {
  text-align: center;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.game-over-title {
  font-size: 36px;
  font-weight: bold;
  color: #776e65;
  margin: 0 0 10px 0;
}

.game-over-title.win {
  color: #edc22e;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.game-over-score {
  font-size: 20px;
  color: #776e65;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.new-record {
  font-size: 18px;
  color: #f65e3b;
  margin: 0 0 20px 0;
  font-weight: bold;
  animation: pulse 1s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.restart-button, .continue-button {
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.restart-button {
  background: #8f7a66;
  color: white;
}

.restart-button:hover {
  background: #9f8b77;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.continue-button {
  background: #edc22e;
  color: #f9f6f2;
}

.continue-button:hover {
  background: #edd073;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.restart-button:active, .continue-button:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .game-over-title {
    font-size: 28px;
  }
  
  .game-over-score {
    font-size: 16px;
  }
  
  .restart-button, .continue-button {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
