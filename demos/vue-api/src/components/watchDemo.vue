<template>
  <div class="watch-demo">
    <div class="demo-item">
      <div class="title">watch ref</div>
      <div class="content">
        <div>x: {{ x }}</div>
        <div>y: {{ y }}</div>
        <div>
          x: <input v-model="x" type="number" /> y:
          <input v-model="y" type="number" />
        </div>
      </div>
    </div>
    <div class="demo-item">
      <div class="title">watch reactive</div>
      <div class="content">
        <div>name: {{ user.name }}</div>
        <div>age: {{ user.age }}</div>
        <div>
          name: <input v-model="user.name" type="text" /> age:
          <input v-model="user.age" type="number" />
        </div>
      </div>
    </div>
    <div class="demo-item">
      <div class="title">watch deep reactive</div>
      <div class="content">
        <div>deep user name: {{ deepUser.name }}</div>
        <div>deep user age: {{ deepUser.age }}</div>
        <div>
          deep user name: <input v-model="deepUser.name" type="text" /> deep
          user age:
          <input v-model="deepUser.age" type="number" />
        </div>
      </div>
    </div>
    <div class="demo-item">
      <div class="title">watchEffect</div>
      <div class="content">
        <div>todoId: {{ todoId }}</div>
        <div>data: {{ data }}</div>
        <div>todoId: <input v-model="todoId" type="number" /></div>
      </div>
    </div>
    <log ref="logRef" :data="logs"></log>
  </div>
</template>
<script setup lang="ts">
import { on } from 'events'
import { ref, reactive, watch, watchEffect, onMounted } from 'vue'

import log from '@/components/log.vue'
/**
 * immediate: true 表示立即执行回调函数
 * 触发时机，执行setup时，比生命周期早
 * 生命周期在setup执行完成后，在各自时间点触发
 *
 * once: true 表示只执行一次回调函数
 *
 * flush: 'post'
 * pre 表示在更新前执行回调函数，添加到微任务队列（在dom更新前微任务前）
 * post 表示在更新后执行回调函数，添加到微任务队列（在dom更新后微任务后）
 * sync 表示同步执行回调函数，不添加到队列，立即执行
 *
 * watchEffect 会自动收集依赖项，当依赖项变化时，会自动执行回调函数
 * 依赖项不止一个时，推荐使用watchEffect而非watch
 * setup执行时，会自动执行一次回调函数，收集依赖项
 *
 *
 */

const logRef = ref(null)

const x = ref(0)
const y = ref(0)
const user = reactive({
  name: '张三',
  age: 18,
})

// 单个 ref
watch(x, newX => {
  console.log(`watch100 x is ${newX}`)
  console.log('logRef.value', logRef.value)
  logRef.value.info(`watch100 x is ${newX}`)
})

watch(
  x,
  newX => {
    console.log(`watch101 once x is ${newX}`)
  },
  { once: true },
)

// getter 函数
// () => x.value + y.value是一个getter函数
// 不要理解成() => x.value + y.value是谁的getter函数，找不到的吧
watch(
  () => x.value + y.value,
  sum => {
    console.log(`watch200 sum of x + y is: ${sum}`)
  },
)

// 多个来源组成的数组
// 此处 () => y.value 是一个getter函数
// [x, y]也可实现
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`watch300 x is ${newX} and y is ${newY}`)
})

watch(user, newUser => {
  console.log(`watch400 user is: ${newUser.name} and ${newUser.age}`)
})

// 监听响应式对象的属性需要处理成getter函数，不然监听静态值，不会触发回调
watch(
  () => user.name,
  newName => {
    console.log(`watch500 user name is: ${newName}`)
  },
)

const deepUser = reactive({
  name: '张三',
  age: 18,
})

// 响应式对象默认深度监听
watch(deepUser, newUser => {
  console.log('watch600 deep user name is:', newUser)
})

// 注意，监听getter函数，
// 1 当deepUser重新赋值，才会触发回调，修改deepUser的属性，不会触发回调
// 2 加上deep选项，才能监听deepUser的属性变化
watch(
  () => deepUser,
  newUser => {
    console.log(`watch700 deep user name is: ${newUser}`)
  },
)

const todoId = ref(1)
const data = ref(null)

/**
 * 监听todoId变化，获取todo详情
 * 这是一个高阶用法了，todoId只是作为请求的参数，都能被检测到作为依赖项
 */
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`,
  )
  data.value = await response.json()
})

// 清除副作用onCleanup触发时机：
// 1. 组件卸载时
// 2. 依赖项变化时
// 3. 停止监听时
// 销毁watch 触发时机：
// 1. 组件卸载时，注意要在最外层，例如放在setTimeout里创建则不会自动销毁
// 2. 主动销毁stopWatch()
const stopWatch = watchEffect(async onCleanup => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`,
  )
  data.value = await response.json()
  // 清除副作用
  onCleanup(() => {
    data.value = null
  })
})

onMounted(() => {
  // 停止监听，watch也可以这样停止监听：赋值给变量，调用变量函数
  stopWatch()
})
</script>
<style>
.demo-item {
  margin-bottom: 20px;
}
.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.content {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
