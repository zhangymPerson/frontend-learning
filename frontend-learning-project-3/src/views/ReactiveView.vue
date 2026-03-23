<template>
    <!--
    响应式系统深入 — watch / watchEffect / computed

    Vue 3 的响应式系统基于 Proxy 实现（Vue 2 使用 Object.defineProperty）
    Proxy 可以拦截对象的所有操作，包括:
    - 属性的读取 (get)
    - 属性的设置 (set)
    - 属性的删除 (delete)
    - in 操作符
    - for...in 遍历
  -->
    <div class="page">
        <h2>⚡ 响应式系统深入</h2>

        <!-- Section 1: watch — 精确监听 -->
        <section class="card">
            <h3>① watch — 精确监听特定数据源</h3>
            <p class="desc">
                watch 接受一个响应式数据源，当数据变化时执行回调。
                可以获取新值和旧值，支持 deep（深度监听）和
                immediate（立即执行）选项。
            </p>
            <div class="demo-area">
                <label>
                    搜索关键词:
                    <input
                        v-model="searchKeyword"
                        placeholder="输入搜索词..."
                    />
                </label>
                <p>搜索次数: {{ searchCount }}</p>
                <p>上一次搜索词: {{ lastKeyword || "(无)" }}</p>
                <p v-if="isSearching" class="loading">🔍 搜索中...</p>
                <ul v-if="searchResults.length">
                    <li v-for="item in searchResults" :key="item">
                        {{ item }}
                    </li>
                </ul>
            </div>
        </section>

        <!-- Section 2: watchEffect — 自动追踪依赖 -->
        <section class="card">
            <h3>② watchEffect — 自动收集依赖</h3>
            <p class="desc">
                watchEffect
                会立即执行一次，并在执行过程中自动追踪所有响应式依赖。
                依赖变化时自动重新执行。不需要手动指定监听目标。
            </p>
            <div class="demo-area">
                <label>
                    宽度:
                    <input
                        v-model.number="width"
                        type="range"
                        min="50"
                        max="300"
                    />
                    {{ width }}px
                </label>
                <label>
                    高度:
                    <input
                        v-model.number="height"
                        type="range"
                        min="50"
                        max="300"
                    />
                    {{ height }}px
                </label>
                <label> 颜色: <input v-model="boxColor" type="color" /> </label>
                <div
                    class="dynamic-box"
                    :style="{
                        width: width + 'px',
                        height: height + 'px',
                        backgroundColor: boxColor,
                    }"
                />
                <p class="log">变化日志: {{ changeLog }}</p>
            </div>
        </section>

        <!-- Section 3: toRaw / markRaw -->
        <section class="card">
            <h3>③ toRaw / markRaw — 非响应式处理</h3>
            <p class="desc">
                toRaw: 返回 reactive 或 readonly 代理的原始对象 markRaw:
                标记一个对象，使其永远不会被转为代理（适合第三方库实例）
            </p>
            <div class="demo-area">
                <p>Reactive 对象: {{ state.count }}</p>
                <button @click="state.count++">
                    修改 reactive (会触发更新)
                </button>
                <button @click="modifyRaw">修改 raw (不会触发更新)</button>
                <button @click="checkIdentity">检查原始对象身份</button>
                <p>检查结果: {{ identityResult }}</p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * 响应式系统的核心 API
 *
 * Vue 3 的响应式原理:
 * 1. reactive() 使用 Proxy 代理整个对象
 * 2. ref() 对基本类型使用 getter/setter 包装，对对象类型内部调用 reactive()
 * 3. 当读取响应式数据时（track），将当前副作用函数收集到依赖中
 * 4. 当修改响应式数据时（trigger），执行所有收集到的副作用函数
 */
import { ref, reactive, watch, watchEffect, toRaw, markRaw } from "vue";

// ==================== watch 示例 ====================
const searchKeyword = ref("");
const searchCount = ref(0);
const lastKeyword = ref("");
const isSearching = ref(false);
const searchResults = ref<string[]>([]);

// 模拟搜索数据
const mockData = [
    "Vue 3 响应式原理",
    "Vue 3 Composition API",
    "Vue 3 生命周期",
    "TypeScript 泛型",
    "TypeScript 类型推导",
    "Pinia 状态管理",
    "Vue Router 路由守卫",
    "Vite 构建优化",
];

/**
 * watch 的三种用法:
 * 1. 监听 ref: watch(myRef, (newVal, oldVal) => {})
 * 2. 监听 reactive 属性: watch(() => obj.key, cb)
 * 3. 监听多个源: watch([a, b], ([newA, newB], [oldA, oldB]) => {})
 *
 * 选项:
 * - immediate: true → 立即执行一次
 * - deep: true → 深度监听对象内部变化
 * - flush: 'pre' | 'post' | 'sync' → 回调执行时机
 */
watch(
    searchKeyword,
    async (newVal, oldVal) => {
        // 获取新旧值，用于对比变化
        lastKeyword.value = oldVal || "";
        searchCount.value++;

        if (newVal.trim()) {
            isSearching.value = true;
            // 模拟异步搜索（实际项目中通常是 API 调用）
            await new Promise((resolve) => setTimeout(resolve, 500));
            searchResults.value = mockData.filter((item) =>
                item.toLowerCase().includes(newVal.toLowerCase()),
            );
            isSearching.value = false;
        } else {
            searchResults.value = [];
        }
    },
    // { immediate: true } // 如果需要立即执行一次，取消注释
);

// ==================== watchEffect 示例 ====================
const width = ref(150);
const height = ref(150);
const boxColor = ref("#42b883");
const changeLog = ref("等待变化...");

/**
 * watchEffect 的特点:
 * 1. 立即执行一次（不需要 immediate 选项）
 * 2. 自动追踪函数内使用的所有响应式数据
 * 3. 无法获取旧值（只能获取当前值）
 * 4. 返回一个停止函数: const stop = watchEffect(...)
 */
watchEffect(() => {
    // 这里使用了 width, height, boxColor 三个响应式数据
    // 它们任何一个变化都会触发重新执行
    changeLog.value = `尺寸 ${width.value}x${height.value}, 颜色 ${boxColor.value}`;
    // console.log 在 watchEffect 中也会被追踪（但不会导致重新执行）
    console.log("[watchEffect] 检测到依赖变化");
});

// ==================== toRaw / markRaw 示例 ====================
const state = reactive({ count: 0 });
const identityResult = ref("");

/** toRaw: 获取原始对象，修改它不会触发响应式更新 */
function modifyRaw() {
    const raw = toRaw(state);
    raw.count = 999; // 不会触发视图更新！
    // 但是 state.count 的值确实变成了 999
    identityResult.value = `原始对象 count 已改为 ${raw.count}，但视图未更新（因为绕过了 Proxy）`;
}

/** 验证 toRaw 返回的是否是同一个对象 */
function checkIdentity() {
    const raw = toRaw(state);
    identityResult.value = `toRaw(state) === state 的原始对象: ${raw === reactive(state) ? "否（Proxy 包装）" : "是同一对象"}`;
    // 重新触发一次响应式更新以同步视图
    state.count = raw.count;
}
</script>
