<template>
    <!--
    根组件 — App.vue

    Vue 3 的应用根组件，所有页面都渲染在这里
    <router-view> 是路由出口，根据当前 URL 渲染对应的页面组件
  -->
    <div class="app">
        <!-- 顶部导航栏 -->
        <nav class="nav-bar">
            <div class="nav-brand">
                <h1>Vue 3 + TS 学习项目</h1>
            </div>
            <div class="nav-links">
                <!--
          router-link 是 Vue Router 提供的导航组件
          会自动渲染为 <a> 标签，并处理点击事件
          active-class 属性会在当前路由匹配时添加对应的 CSS 类
        -->
                <router-link to="/" active-class="active">首页</router-link>
                <router-link to="/reactive" active-class="active"
                    >响应式</router-link
                >
                <router-link to="/todo" active-class="active"
                    >待办清单</router-link
                >
                <router-link to="/lifecycle" active-class="active"
                    >生命周期</router-link
                >
                <router-link to="/store" active-class="active"
                    >状态管理</router-link
                >
                <router-link to="/communication" active-class="active"
                    >组件通信</router-link
                >
            </div>
        </nav>

        <!-- 路由出口 — 当前路由匹配的组件将渲染在这里 -->
        <main class="main-content">
            <router-view />
        </main>

        <!-- 页脚 -->
        <footer class="footer">
            <p>Vue 3 Composition API + TypeScript + Pinia + Vue Router</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
/**
 * <script setup> 是 Vue 3.2+ 引入的语法糖
 *
 * 特点:
 * 1. 无需显式 export default，编译器自动处理
 * 2. 所有顶层的绑定（变量、函数、import）自动暴露给模板
 * 3. 支持 defineProps、defineEmits 等编译宏
 * 4. 更简洁的代码，更少的样板
 * 5. 更好的 TypeScript 类型推导
 *
 * 注意: <script setup> 中不需要 defineComponent()
 */
</script>
