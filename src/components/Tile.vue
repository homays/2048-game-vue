<template>
  <div 
    :class="['tile', `tile-${value}`, { 'merged': merged }]" 
    :style="tileStyle"
  >
    <span class="tile-value">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: number;
  x: number;
  y: number;
  merged: boolean;
}

const props = defineProps<Props>();

const tileStyle = computed(() => ({
  gridColumn: props.x + 1,
  gridRow: props.y + 1
}));
</script>

<style scoped>
.tile {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  border-radius: 6px;
  transition: transform 100ms ease-in-out;
  z-index: 10;
}

.tile-2 { background: #eee4da; color: #776e65; }
.tile-4 { background: #ede0c8; color: #776e65; }
.tile-8 { background: #f2b179; color: #f9f6f2; }
.tile-16 { background: #f59563; color: #f9f6f2; }
.tile-32 { background: #f67c5f; color: #f9f6f2; }
.tile-64 { background: #f65e3b; color: #f9f6f2; }
.tile-128 { background: #edcf72; color: #f9f6f2; font-size: 28px; }
.tile-256 { background: #edcc61; color: #f9f6f2; font-size: 28px; }
.tile-512 { background: #edc850; color: #f9f6f2; font-size: 28px; }
.tile-1024 { background: #edc53f; color: #f9f6f2; font-size: 24px; }
.tile-2048 { background: #edc22e; color: #f9f6f2; font-size: 24px; }

.merged {
  animation: pop 200ms ease-in-out;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.tile-value {
  z-index: 1;
}
</style>
