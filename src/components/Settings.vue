<template>
  <div class="settings" ref="settingsRef">
    <button class="settings-btn" @click="toggleSettings">
      ⚙️ 设置
    </button>
    <div v-if="isOpen" class="settings-panel">
      <h3>游戏设置</h3>
      <div class="setting-item">
        <label>全局缩放:</label>
        <div class="size-options">
          <button
            v-for="scale in scaleOptions"
            :key="scale.value"
            :class="['size-btn', { active: modelValue === scale.value }]"
            @click="selectScale(scale.value)"
          >
            {{ scale.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>();

const isOpen = ref(false);
const settingsRef = ref<HTMLElement | null>(null);

const scaleOptions = [
  { value: 0.7, label: '70%' },
  { value: 0.8, label: '80%' },
  { value: 0.9, label: '90%' },
  { value: 1.0, label: '100%' },
  { value: 1.1, label: '110%' },
  { value: 1.2, label: '120%' },
  { value: 1.5, label: '150%' },
  { value: 2.0, label: '200%' }
];

function toggleSettings(): void {
  isOpen.value = !isOpen.value;
}

function selectScale(scale: number): void {
  emit('update:modelValue', scale);
}

function handleClickOutside(event: MouseEvent): void {
  if (settingsRef.value && !settingsRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.settings {
  position: relative;
}

.settings-btn {
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

.settings-btn:hover {
  background: #9f8b77;
}

.settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  z-index: 1000;
}

.settings-panel h3 {
  margin: 0 0 15px 0;
  color: #776e65;
  font-size: 18px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-item label {
  color: #776e65;
  font-weight: 600;
}

.size-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-btn {
  background: #eee4da;
  color: #776e65;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.size-btn:hover {
  background: #dcd0c6;
}

.size-btn.active {
  background: #8f7a66;
  color: white;
}
</style>
