<template>
  <div class="api-demo-container">
    <div class="feature-list">
      <button
        v-for="feature in features"
        :key="feature.value"
        :class="['feature-item', { active: currentFeature === feature.value }]"
        @click="currentFeature = feature.value"
      >
        {{ feature.label }}
      </button>
    </div>
    <div class="demo-content">
      <component
        :is="componentMap[currentFeature]"
        v-if="currentFeature"
      ></component>
      <div v-else class="empty-state">请选择一个功能进行查看</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import WatchDemo from '@/components/WatchDemo.vue'

// 功能列表
const features = [{ value: 'watch', label: 'Watch' }]

const componentMap = {
  watch: WatchDemo,
}

// 当前选中的功能
const currentFeature = ref('watch')
</script>

<style scoped>
.api-demo-container {
  padding: 20px;
}

/* 横向列表样式 */
.feature-list {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding: 10px 0;
  border-bottom: 2px solid #f0f0f0;
}

.feature-item {
  padding: 10px 20px;
  border: none;
  color: #333;
  background-color: #f8f8f8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.feature-item:hover {
  background-color: #e8e8e8;
}

.feature-item.active {
  background-color: #42b883;
  color: white;
}

/* 内容区域样式 */
.demo-content {
  min-height: 400px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
  font-size: 18px;
}
</style>
