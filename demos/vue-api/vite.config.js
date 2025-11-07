import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path' // 添加这行引入

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.vue', '.ts', '.js', '.json'],
    dedupe: ['vue'], // 整个项目引入的vue，都指向同一个实例
  },
})
