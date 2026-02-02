<template>
  <div class="score-board">
    <div class="score-container">
      <div class="score-label">得分</div>
      <div class="score-value">{{ score }}</div>
    </div>
    <div class="score-container">
      <div class="score-label">最高分</div>
      <div class="score-value">{{ bestScore }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  score: number;
  bestScore: number;
}

defineProps<Props>();
</script>

<style scoped>
.score-board {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.score-container {
  background: #bbada0;
  padding: 10px 25px;
  border-radius: 6px;
  text-align: center;
  min-width: 80px;
}

.score-label {
  color: #eee4da;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.score-value {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

@media (max-width: 600px) {
  .score-board {
    gap: 5px;
  }
  
  .score-container {
    padding: 8px 15px;
    min-width: 60px;
  }
  
  .score-label {
    font-size: 12px;
  }
  
  .score-value {
    font-size: 18px;
  }
}
</style>
