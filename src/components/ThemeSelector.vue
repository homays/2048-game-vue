<template>
  <div class="theme-selector">
    <span class="label">主题:</span>
    <div class="theme-buttons">
      <button
        v-for="theme in themes"
        :key="theme.id"
        class="theme-button"
        :class="{ active: currentTheme === theme.id }"
        :style="{ background: theme.colors.board }"
        @click="$emit('changeTheme', theme.id)"
        :title="theme.name"
      >
        <span class="theme-preview" :style="{ background: theme.colors.tiles[4]?.background || theme.colors.tiles[2]?.background }"></span>
        <span class="theme-name">{{ theme.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { themes } from '../utils/theme';

interface Props {
  currentTheme: string;
}

defineProps<Props>();

defineEmits<{
  changeTheme: [themeId: string];
}>();
</script>

<style scoped>
.theme-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.label {
  color: #8f7a66;
  font-size: 14px;
  font-weight: bold;
}

.theme-buttons {
  display: flex;
  gap: 8px;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.theme-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.theme-button.active {
  border-color: #8f7a66;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.theme-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.theme-name {
  font-size: 13px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@media (max-width: 600px) {
  .theme-selector {
    gap: 8px;
  }
  
  .theme-button {
    padding: 5px 10px;
  }
  
  .theme-preview {
    width: 16px;
    height: 16px;
  }
  
  .theme-name {
    font-size: 12px;
  }
}
</style>
