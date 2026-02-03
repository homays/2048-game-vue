<template>
  <div class="achievements-panel">
    <div class="achievements-header">
      <h3>🏆 成就系统</h3>
      <span class="progress">{{ unlockedCount }}/{{ achievements.length }}</span>
    </div>
    
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>
    
    <div class="achievements-list">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-item"
        :class="{ unlocked: achievement.unlocked }"
      >
        <span class="achievement-icon">{{ achievement.icon }}</span>
        <div class="achievement-info">
          <div class="achievement-name">{{ achievement.name }}</div>
          <div class="achievement-desc">{{ achievement.description }}</div>
          <div v-if="!achievement.unlocked && achievement.maxProgress > 1" class="achievement-progress">
            <div class="progress-bar-small">
              <div class="progress-fill-small" :style="{ width: (achievement.progress / achievement.maxProgress * 100) + '%' }"></div>
            </div>
            <span class="progress-text">{{ achievement.progress }}/{{ achievement.maxProgress }}</span>
          </div>
        </div>
        <span v-if="achievement.unlocked" class="unlocked-badge">✓</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Achievement } from '../types/game';

interface Props {
  achievements: Achievement[];
}

const props = defineProps<Props>();

const unlockedCount = computed(() => 
  props.achievements.filter(a => a.unlocked).length
);

const progressPercent = computed(() => 
  (unlockedCount.value / props.achievements.length) * 100
);
</script>

<style scoped>
.achievements-panel {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.achievements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.achievements-header h3 {
  margin: 0;
  color: #776e65;
  font-size: 16px;
}

.progress {
  color: #8f7a66;
  font-weight: bold;
  font-size: 14px;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #edc22e, #f2b179);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  transition: all 0.2s;
  opacity: 0.7;
}

.achievement-item.unlocked {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
  opacity: 1;
  border: 1px solid #ffc107;
}

.achievement-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-weight: bold;
  color: #776e65;
  font-size: 14px;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 12px;
  color: #8f7a66;
}

.achievement-progress {
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar-small {
  flex: 1;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill-small {
  height: 100%;
  background: #8f7a66;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 11px;
  color: #8f7a66;
  flex-shrink: 0;
}

.unlocked-badge {
  width: 24px;
  height: 24px;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .achievements-panel {
    padding: 12px;
  }
  
  .achievement-icon {
    font-size: 20px;
  }
  
  .achievement-name {
    font-size: 13px;
  }
  
  .achievement-desc {
    font-size: 11px;
  }
}
</style>
