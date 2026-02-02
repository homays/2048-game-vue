<template>
  <div class="app">
    <div class="header">
      <h1 class="title">2048</h1>
      <Settings v-model="scale" />
    </div>
    <ScoreBoard 
      :score="gameState.score" 
      :bestScore="gameState.bestScore"
    />
    <div class="game-container">
      <GameBoard 
        :game-state="gameState"
        :board-size="boardSize"
        @move="handleMove"
      />
      <GameOver
        :game-over="gameState.gameOver"
        :won="gameState.won"
        :score="gameState.score"
        @restart="handleRestart"
      />
    </div>
    <Controls @restart="handleRestart" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useGameLogic } from './composables/useGameLogic';
import GameBoard from './components/GameBoard.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import GameOver from './components/GameOver.vue';
import Controls from './components/Controls.vue';
import Settings from './components/Settings.vue';

const { gameState, move, restart } = useGameLogic();

// 基础棋盘大小（像素）
const BASE_BOARD_SIZE = 800;

// 缩放比例（通过设置控制）
const scale = ref(1.0);

// 计算实际棋盘大小 = 基础大小 * 缩放比例
const boardSize = computed(() => BASE_BOARD_SIZE * scale.value);

function handleMove(direction: 'up' | 'down' | 'left' | 'right'): void {
  move(direction);
}

function handleRestart(): void {
  restart();
}

onMounted(() => {
  restart();
});
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background: #faf8ef;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  color: #776e65;
  margin: 0;
}

.game-container {
  position: relative;
  margin: 20px 0;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #faf8ef;
  color: #776e65;
}

#app {
  width: 100%;
}
</style>
