<template>
    <!--
    注入组件 — demonstrate provide/inject

    provide/inject 用于跨层级组件通信:
    祖先组件 provide → 中间组件（不需要传递） → 后代组件 inject
  -->
    <div class="injected-child" :class="theme">
        <h4>🌱 后代注入组件</h4>
        <p>
            注入的 theme: <strong>{{ theme }}</strong>
        </p>
        <p>当前样式: {{ theme === "dark" ? "🌙 深色模式" : "☀️ 浅色模式" }}</p>
        <button @click="toggleTheme">在子组件中切换主题</button>
    </div>
</template>

<script setup lang="ts">
/**
 * inject: 从祖先组件接收 provide 的数据
 *
 * 用法:
 * const value = inject('key')                    // 类型为 T | undefined
 * const value = inject('key', defaultValue)      // 带默认值
 * const value = inject<Ref<string>>('key')       // 显式类型
 *
 * 注意:
 * - inject 的值默认不是响应式的，除非 provide 传入的是 ref/reactive 对象
 * - 如果 provide 使用了 readonly 包裹，子组件不能直接修改
 * - 可以通过 provide 一个修改函数来让后代组件间接修改
 */
import { inject, type Ref } from "vue";

// 注入主题（祖先组件 provide 的 readonly ref）
const theme = inject<Ref<string>>("theme");
// 注入切换主题的函数
const toggleTheme = inject<() => void>("toggleTheme")!;
</script>
