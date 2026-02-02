<template>
  <div class="controls">
    <button class="restart-button" @click="$emit('restart')">
      新游戏
    </button>
    <p class="instructions">使用方向键或滑动屏幕来移动方块</p>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  restart: []
}>();
</script>

<style scoped>
.controls {
  margin-top: 20px;
  text-align: center;
}

.restart-button {
  background: #8f7a66;
  color: white;
  border: none;
  padding: 12px 25px;
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

.instructions {
  color: #776e65;
  margin-top: 15px;
  font-size: 14px;
}
</style>
