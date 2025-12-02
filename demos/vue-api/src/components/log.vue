<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

// 定义日志项接口
interface LogItem {
  id: number
  timestamp: string
  data: any
  level: 'info' | 'warn' | 'error' | 'debug'
  isExpanded: boolean
}

// 组件属性
const props = defineProps<{
  data?: any
  autoScroll?: boolean
  maxLogs?: number
  showTimestamp?: boolean
  level?: 'info' | 'warn' | 'error' | 'debug'
}>()

// 默认属性值
const defaultProps = {
  autoScroll: true,
  maxLogs: 100,
  showTimestamp: true,
  level: 'info' as const,
}

console.log('props', props)
console.log('defaultProps', defaultProps)

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 日志列表
const logs = ref<LogItem[]>([])
let logId = 0

// 格式化数据函数
const formatData = (data: any): string => {
  if (data === null) return 'null'
  if (data === undefined) return 'undefined'
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data, null, 2)
    } catch (e) {
      return String(data)
    }
  }
  return String(data)
}

// 添加日志函数
const addLog = (
  data: any,
  level: 'info' | 'warn' | 'error' | 'debug' = mergedProps.level,
) => {
  const timestamp = new Date().toLocaleTimeString()
  const newLog: LogItem = {
    id: logId++,
    timestamp,
    data,
    level,
    isExpanded: false,
  }

  console.log('newLog', newLog)

  logs.value.push(newLog)

  // 限制日志数量
  if (logs.value.length > mergedProps.maxLogs) {
    logs.value.shift()
  }

  // 自动滚动
  if (mergedProps.autoScroll) {
    nextTick(() => {
      const container = document.getElementById('log-container')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    })
  }
}

// 切换展开/折叠状态
const toggleExpand = (index: number) => {
  logs.value[index].isExpanded = !logs.value[index].isExpanded
}

// 清空日志
const clearLogs = () => {
  logs.value = []
}

// 监听data属性变化
watch(
  () => props.data,
  newData => {
    if (newData !== undefined) {
      addLog(newData, mergedProps.level)
    }
  },
  { immediate: false },
)

// 暴露方法给父组件
defineExpose({
  addLog,
  clearLogs,
  info: (data: any) => addLog(data, 'info'),
  warn: (data: any) => addLog(data, 'warn'),
  error: (data: any) => addLog(data, 'error'),
  debug: (data: any) => addLog(data, 'debug'),
})
</script>

<template>
  <div class="log-component">
    <div class="log-header">
      <h3>控制台日志</h3>
      <button @click="clearLogs" class="clear-btn">清空</button>
    </div>
    <div id="log-container" class="log-container">
      <div
        v-for="(log, index) in logs"
        :key="log.id"
        :class="['log-item', `log-${log.level}`]"
        @click="toggleExpand(index)"
      >
        <div class="log-header-info">
          <span v-if="mergedProps.showTimestamp" class="timestamp">{{
            log.timestamp
          }}</span>
          <span class="level">{{ log.level.toUpperCase() }}</span>
          <span class="toggle-icon">{{ log.isExpanded ? '▼' : '▶' }}</span>
          <span class="log-preview"
            >{{ formatData(log.data).substring(0, 100)
            }}{{ formatData(log.data).length > 100 ? '...' : '' }}</span
          >
        </div>
        <div v-if="log.isExpanded" class="log-details">
          <pre class="log-content">{{ formatData(log.data) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-component {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f8f8f8;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #eaeaea;
  border-bottom: 1px solid #ddd;
}

.log-header h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.clear-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.clear-btn:hover {
  background: #ff5252;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.log-item {
  margin-bottom: 4px;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.5);
}

.log-info {
  background: rgba(52, 152, 219, 0.1);
  border-left: 3px solid #3498db;
}

.log-warn {
  background: rgba(241, 196, 15, 0.1);
  border-left: 3px solid #f1c40f;
}

.log-error {
  background: rgba(231, 76, 60, 0.1);
  border-left: 3px solid #e74c3c;
}

.log-debug {
  background: rgba(155, 89, 182, 0.1);
  border-left: 3px solid #9b59b6;
}

.log-header-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timestamp {
  color: #666;
  font-size: 11px;
}

.level {
  font-weight: bold;
  font-size: 11px;
  text-transform: uppercase;
}

.log-info .level {
  color: #3498db;
}
.log-warn .level {
  color: #f1c40f;
}
.log-error .level {
  color: #e74c3c;
}
.log-debug .level {
  color: #9b59b6;
}

.toggle-icon {
  font-size: 10px;
  color: #666;
  width: 12px;
  text-align: center;
}

.log-preview {
  flex: 1;
  word-break: break-word;
}

.log-details {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #ddd;
}

.log-content {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  background: #fff;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #eee;
  overflow-x: auto;
}
</style>
