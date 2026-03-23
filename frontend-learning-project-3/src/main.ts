/**
 * 应用入口文件
 *
 * Vue 3 的 createApp 函数取代了 Vue 2 的 new Vue() 构造函数
 * 这种设计使得每个应用实例完全独立，避免了全局污染
 */
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/style.css";

// 1. 创建应用实例 — Vue 3 的应用实例是一个独立的对象
const app = createApp(App);

// 2. 创建 Pinia 状态管理实例
// Pinia 是 Vue 3 官方推荐的状态管理库，替代了 Vuex
const pinia = createPinia();

// 3. 注册插件
// use() 方法将插件挂载到应用上，类似于 Express/Koa 的中间件机制
app.use(pinia); // 状态管理
app.use(router); // 路由管理

// 4. 将应用挂载到 DOM 节点上
// #app 对应 index.html 中的 <div id="app"></div>
app.mount("#app");
