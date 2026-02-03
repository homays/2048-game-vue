<template>
  <div 
    class="game-board" 
    :style="boardStyle"
    @keydown="handleKeydown"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    tabindex="0"
  >
    <div class="grid-container" :style="gridStyle">
      <div 
        v-for="(row, y) in gameState.board" 
        :key="y"
        class="grid-row"
        :style="rowStyle"
      >
        <div 
          v-for="(value, x) in row" 
          :key="`${x}-${y}`"
          class="grid-cell"
          :style="cellStyle"
        ></div>
      </div>
    </div>
    <div class="tiles-container" :style="tilesContainerStyle">
      <template v-for="(row, y) in gameState.board" :key="y">
        <template v-for="(value, x) in row" :key="`${x}-${y}`">
          <Tile
            v-if="value !== 0"
            :key="`${x}-${y}-${value}-${animationKey}`"
            :value="value"
            :x="x"
            :y="y"
            :size="boardConfig.size"
            :cell-size="cellSize"
            :gap="gap"
            :theme="theme"
            :merged="false"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { GameState, Theme } from '../types/game';
import Tile from './Tile.vue';

interface Props {
  gameState: GameState;
  containerSize: number;
  theme: Theme;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  move: [direction: 'up' | 'down' | 'left' | 'right'];
}>();

const touchStart = ref<{ x: number; y: number } | null>(null);
const animationKey = ref(0);

const boardConfig = computed(() => ({
  size: props.gameState.config.size
}));

const gap = computed(() => Math.max(8, props.containerSize / 40));
const cellSize = computed(() => {
  const totalGap = gap.value * (boardConfig.value.size + 1);
  return (props.containerSize - totalGap) / boardConfig.value.size;
});

const boardStyle = computed(() => ({
  width: `${props.containerSize}px`,
  height: `${props.containerSize}px`,
  background: props.theme.colors.board,
  padding: `${gap.value}px`,
  borderRadius: '8px'
}));

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${boardConfig.value.size}, 1fr)`,
  gridTemplateRows: `repeat(${boardConfig.value.size}, 1fr)`,
  gap: `${gap.value}px`,
  width: '100%',
  height: '100%'
}));

const rowStyle = computed(() => ({
  display: 'contents'
}));

const cellStyle = computed(() => ({
  background: props.theme.colors.cell,
  borderRadius: '6px',
  width: `${cellSize.value}px`,
  height: `${cellSize.value}px`
}));

const tilesContainerStyle = computed(() => ({
  position: 'absolute',
  top: `${gap.value}px`,
  left: `${gap.value}px`,
  width: `${props.containerSize - gap.value * 2}px`,
  height: `${props.containerSize - gap.value * 2}px`,
  pointerEvents: 'none'
}));

watch(() => props.gameState.board, () => {
  animationKey.value++;
}, { deep: true });

function handleKeydown(event: KeyboardEvent): void {
  const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'w': 'up',
    's': 'down',
    'a': 'left',
    'd': 'right',
    'W': 'up',
    'S': 'down',
    'A': 'left',
    'D': 'right'
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
  outline: none;
  touch-action: none;
  user-select: none;
}

.grid-container {
  width: 100%;
  height: 100%;
}

.grid-row {
  display: contents;
}

.grid-cell {
  border-radius: 6px;
}

.tiles-container {
  position: absolute;
}

@media (max-width: 600px) {
  .game-board {
    max-width: 95vw;
    max-height: 95vw;
  }
}
</style>
