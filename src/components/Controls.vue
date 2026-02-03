<template>
  <div class="controls">
    <div class="control-row">
      <button 
        class="control-button undo" 
        @click="$emit('undo')"
        :disabled="!canUndo"
        title="撤销 (Ctrl+Z)"
      >
        ↩️ 撤销
      </button>
      <button 
        class="control-button hint" 
        @click="$emit('hint')"
        title="提示下一步"
      >
        💡 提示
      </button>
      <button 
        class="control-button restart" 
        @click="$emit('restart')"
        title="新游戏"
      >
        🔄 新游戏
      </button>
    </div>
    
    <div class="mode-selector" v-if="showModeSelector">
      <button 
        class="mode-button"
        :class="{ active: mode === 'classic' }"
        @click="$emit('changeMode', 'classic')"
      >
        经典
      </button>
      <button 
        class="mode-button"
        :class="{ active: mode === 'endless' }"
        @click="$emit('changeMode', 'endless')"
      >
        无尽
      </button>
    </div>
    
    <p class="instructions">使用方向键或WASD移动，或滑动屏幕</p>
  </div>
</template>

<script setup lang="ts">
import type { BoardSize, GameMode } from '../types/game';

interface Props {
  canUndo: boolean;
  currentSize: BoardSize;
  mode: GameMode;
  showModeSelector?: boolean;
}

defineProps<Props>();

defineEmits<{
  restart: [];
  undo: [];
  hint: [];
  changeMode: [mode: GameMode];
}>();
</script>

<style scoped>
.controls {
  margin-top: 15px;
  text-align: center;
}

.control-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.control-button {
  padding: 10px 18px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.control-button:active:not(:disabled) {
  transform: translateY(0);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.undo {
  background: #8f7a66;
  color: white;
}

.undo:hover:not(:disabled) {
  background: #9f8b77;
}

.hint {
  background: #f2b179;
  color: white;
}

.hint:hover:not(:disabled) {
  background: #f3bc8a;
}

.restart {
  background: #8f7a66;
  color: white;
}

.restart:hover:not(:disabled) {
  background: #9f8b77;
}

.mode-selector {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
}

.mode-button {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: bold;
  border: 2px solid #f2b179;
  background: white;
  color: #f2b179;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-button:hover {
  background: #fff8f0;
}

.mode-button.active {
  background: #f2b179;
  color: white;
}

.instructions {
  color: #776e65;
  margin-top: 10px;
  font-size: 13px;
}

@media (max-width: 600px) {
  .control-button {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .mode-button {
    padding: 5px 10px;
    font-size: 12px;
  }
}
</style>
