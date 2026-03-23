import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * Vite 构建配置文件
 * Vite 是 Vue 3 官方推荐的构建工具，使用 ESBuild 实现极快的冷启动和热更新
 */
export default defineConfig({
  plugins: [
    vue(), // Vue 3 SFC (单文件组件) 支持插件
  ],
  resolve: {
    alias: {
      // 配置路径别名 @ 指向 src 目录
      // 用法: import xxx from '@/components/xxx'
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000, // 开发服务器端口
    open: true, // 启动时自动打开浏览器
  },
})
