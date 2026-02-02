<template>
  <div v-if="gameOver || won" class="game-over-overlay">
    <div class="game-over-content">
      <h2 class="game-over-title">{{ won ? '你赢了!' : '游戏结束' }}</h2>
      <p class="game-over-score">最终得分: {{ score }}</p>
      <button class="restart-button" @click="$emit('restart')">
        再来一局
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gameOver: boolean;
  won: boolean;
  score: number;
}

defineProps<Props>();

defineEmits<{
  restart: []
}>();
</script>

<style scoped>
.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(238, 228, 218, 0.73);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  z-index: 100;
}

.game-over-content {
  text-align: center;
}

.game-over-title {
  font-size: 36px;
  font-weight: bold;
  color: #776e65;
  margin: 0 0 10px 0;
}

.game-over-score {
  font-size: 18px;
  color: #776e65;
  margin: 0 0 20px 0;
}

.restart-button {
  background: #8f7a66;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.restart-button:hover {
  background: #9f8b77;
}

.restart-button:active {
  transform: scale(0.98);
}
</style>
