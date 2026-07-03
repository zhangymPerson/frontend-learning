/**
 * 应用入口文件
 *
 * 这是整个应用的起点，负责：
 * 1. 引入 React 和 ReactDOM
 * 2. 渲染根组件到 DOM
 * 3. 引入全局样式
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";

/**
 * createRoot 是 React 18 的新 API
 *
 * 相比旧的 render 方法：
 * - 支持并发特性（Concurrent Features）
 * - 更好的性能
 * - 自动批量更新
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  /**
   * StrictMode 是开发模式下的辅助组件
   *
   * 它会：
   * - 检测潜在问题
   * - 对组件进行双重渲染（仅开发模式）
   * - 警告使用过时的 API
   *
   * 注意：StrictMode 不会渲染任何可见 UI
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
