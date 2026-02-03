<template>
  <div class="app" :style="appStyle">
    <div class="header">
      <h1 class="title">2048</h1>
      <div class="header-controls">
        <button 
          class="header-btn"
          @click="showAchievements = !showAchievements"
          title="成就"
        >
          🏆
        </button>
        <button 
          class="header-btn"
          @click="toggleSound"
          :title="soundEnabled ? '关闭音效' : '开启音效'"
        >
          {{ soundEnabled ? '🔊' : '🔇' }}
        </button>
        <button 
          class="header-btn"
          @click="showSettings = !showSettings"
          title="设置"
        >
          ⚙️
        </button>
      </div>
    </div>
    
    <ScoreBoard 
      :score="gameState.score" 
      :best-score="currentBestScore"
      :move-count="gameState.moveCount"
      :max-tile="gameState.maxTile"
      :board-size="gameState.config.size"
      :mode="gameState.config.mode"
      :undo-count="gameState.undoCount"
    />
    
    <div class="game-container" :style="gameContainerStyle">
      <GameBoard 
        :game-state="gameState"
        :container-size="boardSize"
        :theme="currentTheme"
        @move="handleMove"
      />
      <GameOver
        :game-over="gameState.gameOver"
        :won="gameState.won"
        :score="gameState.score"
        :mode="gameState.config.mode"
        :new-record="isNewRecord"
        @restart="handleRestart"
        @continue="handleContinue"
      />
    </div>
    
    <Controls 
      :can-undo="canUndo"
      :current-size="gameState.config.size"
      :mode="gameState.config.mode"
      :show-mode-selector="gameState.won"
      @restart="handleRestart"
      @undo="handleUndo"
      @hint="handleHint"
      @change-mode="handleChangeMode"
    />
    
    <!-- 成就面板 -->
    <Teleport to="body">
      <Transition name="settings">
        <div v-if="showAchievements" class="settings-overlay" @click.self="showAchievements = false">
          <div class="settings-modal achievements-modal">
            <div class="settings-header">
              <h3>🏆 成就系统</h3>
              <button class="settings-close" @click="showAchievements = false">✕</button>
            </div>
            
            <div class="settings-body">
              <div class="achievements-summary">
                <div class="achievement-progress-ring">
                  <svg viewBox="0 0 100 100" class="progress-ring">
                    <circle class="progress-ring-bg" cx="50" cy="50" r="45" />
                    <circle 
                      class="progress-ring-fill" 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      :style="{ strokeDashoffset: 283 - (283 * unlockedCount / totalAchievements) }"
                    />
                  </svg>
                  <div class="progress-text">
                    <span class="progress-number">{{ unlockedCount }}</span>
                    <span class="progress-total">/{{ totalAchievements }}</span>
                  </div>
                </div>
                <div class="achievement-stats">
                  <div class="stat-item">
                    <span class="stat-label">已解锁</span>
                    <span class="stat-value unlocked">{{ unlockedCount }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">待完成</span>
                    <span class="stat-value locked">{{ totalAchievements - unlockedCount }}</span>
                  </div>
                </div>
              </div>

              <div class="achievements-list">
                <div
                  v-for="achievement in achievements"
                  :key="achievement.id"
                  class="achievement-item"
                  :class="{ unlocked: achievement.unlocked }"
                >
                  <div class="achievement-icon-wrapper">
                    <span class="achievement-icon">{{ achievement.icon }}</span>
                    <span v-if="achievement.unlocked" class="achievement-check">✓</span>
                  </div>
                  <div class="achievement-info">
                    <div class="achievement-name">{{ achievement.name }}</div>
                    <div class="achievement-desc">{{ achievement.description }}</div>
                    <div v-if="!achievement.unlocked && achievement.maxProgress > 1" class="achievement-progress-bar">
                      <div class="progress-track">
                        <div class="progress-fill" :style="{ width: (achievement.progress / achievement.maxProgress * 100) + '%' }"></div>
                      </div>
                      <span class="progress-count">{{ achievement.progress }}/{{ achievement.maxProgress }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- 设置面板 -->
    <Teleport to="body">
      <Transition name="settings">
        <div v-if="showSettings" class="settings-overlay" @click.self="showSettings = false">
          <div class="settings-modal">
            <div class="settings-header">
              <h3>⚙️ 游戏设置</h3>
              <button class="settings-close" @click="showSettings = false">✕</button>
            </div>
            
            <div class="settings-body">
              <!-- 主题设置 -->
              <div class="setting-section">
                <label class="section-label">🎨 主题风格</label>
                <div class="theme-options">
                  <button
                    v-for="theme in themes"
                    :key="theme.id"
                    class="theme-option"
                    :class="{ active: currentThemeId === theme.id }"
                    :style="{ 
                      background: theme.colors.board,
                      borderColor: currentThemeId === theme.id ? theme.colors.tiles[8]?.background : 'transparent'
                    }"
                    @click="changeTheme(theme.id)"
                  >
                    <span 
                      class="theme-preview" 
                      :style="{ background: theme.colors.tiles[4]?.background || theme.colors.tiles[2]?.background }"
                    ></span>
                    <span class="theme-name">{{ theme.name }}</span>
                  </button>
                </div>
              </div>

              <!-- 棋盘尺寸 -->
              <div class="setting-section">
                <label class="section-label">📐 棋盘尺寸</label>
                <div class="size-options">
                  <button
                    v-for="size in [3, 4, 5, 6]"
                    :key="size"
                    class="size-option"
                    :class="{ active: gameState.config.size === size }"
                    @click="handleChangeSize(size)"
                  >
                    {{ size }}×{{ size }}
                  </button>
                </div>
              </div>

              <!-- 音效开关 -->
              <div class="setting-section">
                <label class="section-label">🔊 音效</label>
                <button class="toggle-switch" :class="{ active: soundEnabled }" @click="toggleSound">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">{{ soundEnabled ? '开启' : '关闭' }}</span>
                </button>
              </div>

              <!-- 动画开关 -->
              <div class="setting-section">
                <label class="section-label">✨ 动画效果</label>
                <button class="toggle-switch" :class="{ active: animationEnabled }" @click="toggleAnimation">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">{{ animationEnabled ? '开启' : '关闭' }}</span>
                </button>
              </div>

              <!-- 棋盘缩放 -->
              <div class="setting-section">
                <label class="section-label">🔍 棋盘缩放 (50%-200%)</label>
                <div class="scale-slider">
                  <button class="scale-btn" @click="adjustScale(-0.1)">−</button>
                  <span class="scale-value">{{ Math.round(scale * 100) }}%</span>
                  <button class="scale-btn" @click="adjustScale(0.1)">+</button>
                </div>
                <div class="scale-hint">当前尺寸: {{ Math.round(boardSize) }}px</div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <div v-if="hintDirection" class="hint-toast" @click="clearHint">
      💡 提示: {{ hintText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useGameLogic } from './composables/useGameLogic';
import GameBoard from './components/GameBoard.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import GameOver from './components/GameOver.vue';
import Controls from './components/Controls.vue';
import Achievements from './components/Achievements.vue';
import { themes, getThemeById } from './utils/theme';
import { soundManager } from './utils/sound';
import { getSettings, saveSettings } from './utils/storage';
import type { Direction, BoardSize, GameMode } from './types/game';

const { 
  gameState, 
  achievements, 
  bestScoresBySize,
  canUndo, 
  currentBestScore,
  move, 
  undo, 
  restart, 
  initGame,
  continueEndless,
  getHint,
  changeBoardSize
} = useGameLogic();

const BASE_BOARD_SIZE = 800;
const scale = ref(1.0);

const currentThemeId = ref(getSettings().theme);
const soundEnabled = ref(soundManager.isEnabled());
const animationEnabled = ref(getSettings().animationEnabled);
const hintDirection = ref<Direction | null>(null);
const showSettings = ref(false);
const showAchievements = ref(false);

const unlockedCount = computed(() => achievements.value.filter(a => a.unlocked).length);
const totalAchievements = computed(() => achievements.value.length);

const currentTheme = computed(() => getThemeById(currentThemeId.value));

const boardSize = computed(() => {
  // 计算可用空间，留出足够空间给其他UI元素
  const availableWidth = window.innerWidth * 0.95;
  const availableHeight = window.innerHeight - 250; // 预留header、分数、按钮等空间
  const maxSize = Math.min(availableWidth, availableHeight);
  const size = Math.min(BASE_BOARD_SIZE * scale.value, maxSize);
  return Math.max(280, size);
});

const appStyle = computed(() => ({
  background: currentTheme.value.colors.background,
  color: currentTheme.value.colors.text
}));

const gameContainerStyle = computed(() => ({
  position: 'relative' as const,
  margin: '15px 0'
}));

const isNewRecord = computed(() => {
  if (gameState.gameOver || gameState.won) {
    return gameState.score >= currentBestScore.value;
  }
  return false;
});

const hintText = computed(() => {
  const texts: Record<Direction, string> = {
    up: '↑ 向上',
    down: '↓ 向下',
    left: '← 向左',
    right: '→ 向右'
  };
  return hintDirection.value ? texts[hintDirection.value] : '';
});

function handleMove(direction: Direction): void {
  hintDirection.value = null;
  move(direction);
}

function handleRestart(): void {
  hintDirection.value = null;
  restart();
}

function handleUndo(): void {
  undo();
}

function handleHint(): void {
  const hint = getHint();
  if (hint) {
    hintDirection.value = hint;
    setTimeout(() => {
      hintDirection.value = null;
    }, 3000);
  }
}

function handleChangeSize(size: BoardSize): void {
  hintDirection.value = null;
  changeBoardSize(size);
}

function handleChangeMode(mode: GameMode): void {
  if (mode === 'endless' && gameState.won) {
    continueEndless();
  }
}

function handleContinue(): void {
  continueEndless();
}

function changeTheme(themeId: string): void {
  currentThemeId.value = themeId;
  saveSettings({ theme: themeId });
}

function toggleSound(): void {
  soundEnabled.value = !soundEnabled.value;
  soundManager.setEnabled(soundEnabled.value);
}

function toggleAnimation(): void {
  animationEnabled.value = !animationEnabled.value;
  saveSettings({ animationEnabled: animationEnabled.value });
}

function adjustScale(delta: number): void {
  scale.value = Math.max(0.5, Math.min(2.0, scale.value + delta));
}

function clearHint(): void {
  hintDirection.value = null;
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    handleUndo();
  }
}

onMounted(() => {
  restart();
  window.addEventListener('keydown', handleKeydown);
});

watch(() => gameState.config.size, () => {
  // 根据棋盘尺寸自动调整缩放，大棋盘默认小一点，小棋盘默认大一点
  const defaultScale = Math.max(0.6, Math.min(1.0, 4 / gameState.config.size));
  scale.value = defaultScale;
});
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 15px;
  transition: background 0.3s ease;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: 10px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin: 0;
  transition: color 0.3s ease;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.header-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  transition: background 0.2s;
  position: relative;
}

.header-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.header-btn::after {
  content: attr(title);
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #8f7a66;
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.header-btn:hover::after {
  opacity: 1;
}

/* 设置面板样式 */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.settings-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #8f7a66, #a08060);
  color: white;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
}

.settings-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.settings-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.settings-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 70px);
}

.setting-section {
  margin-bottom: 24px;
}

.setting-section:last-child {
  margin-bottom: 0;
}

.section-label {
  display: block;
  color: #776e65;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 12px;
}

/* 主题选项 */
.theme-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  border: 3px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.theme-option.active {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.theme-preview {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.theme-name {
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 尺寸选项 */
.size-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.size-option {
  padding: 12px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #776e65;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s;
}

.size-option:hover {
  border-color: #bbada0;
  background: #faf8ef;
}

.size-option.active {
  background: #8f7a66;
  color: white;
  border-color: #8f7a66;
}

/* 切换开关 */
.toggle-switch {
  display: flex;
  align-items: center;
  padding: 4px;
  background: #e0e0e0;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  width: 100%;
  height: 36px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: #8f7a66;
}

.toggle-slider {
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
}

.toggle-switch.active .toggle-slider {
  transform: translateY(-50%) translateX(calc(100vw - 100px));
}

@media (min-width: 400px) {
  .toggle-switch.active .toggle-slider {
    transform: translateY(-50%) translateX(320px);
  }
}

.toggle-text {
  font-weight: bold;
  color: #776e65;
  font-size: 14px;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.toggle-switch.active .toggle-text {
  color: white;
  left: 16px;
  right: auto;
}

/* 缩放滑块 */
.scale-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.scale-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #8f7a66;
  background: white;
  color: #8f7a66;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s;
}

.scale-btn:hover {
  background: #8f7a66;
  color: white;
}

.scale-value {
  font-size: 18px;
  font-weight: bold;
  color: #776e65;
  min-width: 60px;
  text-align: center;
}

.scale-hint {
  text-align: center;
  font-size: 12px;
  color: #8f7a66;
  margin-top: 8px;
}

/* 成就弹窗样式 */
.achievements-modal {
  max-width: 450px;
}

.achievements-summary {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #faf8ef, #f5f0e6);
  border-radius: 12px;
  margin-bottom: 20px;
}

.achievement-progress-ring {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 8;
}

.progress-ring-fill {
  fill: none;
  stroke: #edc22e;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-number {
  font-size: 28px;
  font-weight: bold;
  color: #776e65;
}

.progress-total {
  font-size: 14px;
  color: #8f7a66;
}

.achievement-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  color: #8f7a66;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

.stat-value.unlocked {
  color: #4caf50;
}

.stat-value.locked {
  color: #9e9e9e;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 10px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.achievement-item.unlocked {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
  border-color: #ffc107;
}

.achievement-icon-wrapper {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.achievement-icon {
  font-size: 28px;
}

.achievement-check {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-weight: bold;
  color: #776e65;
  font-size: 15px;
  margin-bottom: 4px;
}

.achievement-desc {
  font-size: 12px;
  color: #8f7a66;
}

.achievement-progress-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #8f7a66;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-count {
  font-size: 11px;
  color: #8f7a66;
  font-weight: bold;
  min-width: 35px;
  text-align: right;
}

/* 动画过渡 */
.settings-enter-active,
.settings-leave-active {
  transition: opacity 0.3s ease;
}

.settings-enter-from,
.settings-leave-to {
  opacity: 0;
}

.settings-enter-active .settings-modal,
.settings-leave-active .settings-modal {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.settings-enter-from .settings-modal,
.settings-leave-to .settings-modal {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* 提示toast */
.hint-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #f2b179;
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  cursor: pointer;
  z-index: 1000;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 600px) {
  .title {
    font-size: 36px;
  }
  
  .app {
    padding: 10px;
  }
  
  .settings-modal {
    width: 95%;
    max-height: 90vh;
  }
  
  .theme-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .size-options {
    grid-template-columns: repeat(4, 1fr);
  }
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
  overflow-x: hidden;
}

#app {
  width: 100%;
}
</style>
