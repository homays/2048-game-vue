<template>
  <div 
    class="game-board" 
    @keydown="handleKeydown"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    tabindex="0"
  >
    <div class="grid-container">
      <div 
        v-for="(row, y) in gameState.board" 
        :key="y"
        class="grid-row"
      >
        <div 
          v-for="(value, x) in row" 
          :key="`${x}-${y}`"
          class="grid-cell"
        ></div>
      </div>
    </div>
    <div class="tiles-container">
      <template v-for="(row, y) in gameState.board" :key="y">
        <template v-for="(value, x) in row" :key="`${x}-${y}`">
          <Tile
            v-if="value !== 0"
            :key="`${x}-${y}-${value}`"
            :value="value"
            :x="x"
            :y="y"
            :merged="false"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { GameState } from '../types/game';
import Tile from './Tile.vue';

interface Props {
  gameState: GameState;
  boardSize: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  move: [direction: 'up' | 'down' | 'left' | 'right']
}>();

const touchStart = ref<{ x: number; y: number } | null>(null);

function handleKeydown(event: KeyboardEvent): void {
  const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right'
  };
  
  const direction = keyMap[event.key];
  if (direction) {
    event.preventDefault();
    emit('move', direction);
  }
}

function handleTouchStart(event: TouchEvent): void {
  touchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
  };
}

function handleTouchEnd(event: TouchEvent): void {
  if (!touchStart.value) return;
  
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStart.value.x;
  const deltaY = touch.clientY - touchStart.value.y;
  
  const minSwipe = 50;
  
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > minSwipe) {
      emit('move', deltaX > 0 ? 'right' : 'left');
    }
  } else {
    if (Math.abs(deltaY) > minSwipe) {
      emit('move', deltaY > 0 ? 'down' : 'up');
    }
  }
  
  touchStart.value = null;
}
</script>

<style scoped>
.game-board {
  position: relative;
  width: v-bind('boardSize + "px"');
  height: v-bind('boardSize + "px"');
  background: #bbada0;
  border-radius: 6px;
  padding: v-bind('boardSize / 30 + "px"');
  outline: none;
}

.grid-container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: v-bind('boardSize / 30 + "px"');
}

.grid-row {
  display: contents;
}

.grid-cell {
  background: rgba(238, 228, 218, 0.35);
  border-radius: 6px;
}

.tiles-container {
  position: absolute;
  top: v-bind('boardSize / 30 + "px"');
  left: v-bind('boardSize / 30 + "px"');
  width: calc(100% - v-bind('boardSize / 15 + "px"'));
  height: calc(100% - v-bind('boardSize / 15 + "px"'));
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: v-bind('boardSize / 30 + "px"');
  pointer-events: none;
}

@media (max-width: 600px) {
  .game-board {
    width: 90vw;
    height: 90vw;
    max-width: 400px;
    max-height: 400px;
    padding: 10px;
  }
  
  .tiles-container {
    top: 10px;
    left: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    gap: 10px;
  }
  
  .grid-container {
    gap: 10px;
  }
}
</style>
