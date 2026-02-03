<template>
  <div 
    :class="['tile', { 'merged': merged, 'new': isNew }]" 
    :style="tileStyle"
  >
    <span class="tile-value" :style="valueStyle">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { Theme } from '../types/game';
import { getTileColor } from '../utils/theme';

interface Props {
  value: number;
  x: number;
  y: number;
  size: number;
  cellSize: number;
  gap: number;
  theme: Theme;
  merged: boolean;
}

const props = defineProps<Props>();

const isNew = ref(true);

onMounted(() => {
  setTimeout(() => {
    isNew.value = false;
  }, 200);
});

const tileColor = computed(() => getTileColor(props.theme, props.value));

const fontSize = computed(() => {
  const digits = props.value.toString().length;
  if (digits <= 2) return props.cellSize * 0.5;
  if (digits === 3) return props.cellSize * 0.4;
  return props.cellSize * 0.32;
});

const tileStyle = computed(() => ({
  position: 'absolute',
  left: `${props.x * (props.cellSize + props.gap)}px`,
  top: `${props.y * (props.cellSize + props.gap)}px`,
  width: `${props.cellSize}px`,
  height: `${props.cellSize}px`,
  background: tileColor.value.background,
  color: tileColor.value.text,
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  transition: 'all 150ms ease-in-out',
  zIndex: 10,
  animation: isNew.value ? 'appear 200ms ease-in-out' : undefined
}));

const valueStyle = computed(() => ({
  fontSize: `${fontSize.value}px`,
  zIndex: 1
}));
</script>

<style scoped>
.tile {
  will-change: transform, left, top;
}

.merged {
  animation: pop 200ms ease-in-out;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes appear {
  0% { 
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
  }
}

.tile-value {
  user-select: none;
}
</style>
