import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

/**
 * Vite 构建配置文件
 * Vite 是 React 官方推荐的现代构建工具，具有极快的开发服务器启动速度
 */
export default defineConfig({
  plugins: [
    react(), // React 18 + JSX 转换支持插件
  ],
  resolve: {
    alias: {
      // 配置路径别名 @ 指向 src 目录
      // 用法: import xxx from '@/components/xxx'
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3001, // 开发服务器端口 (避免与 Vue 项目冲突)
    open: true, // 启动时自动打开浏览器
  },
});
