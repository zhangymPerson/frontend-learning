<template>
    <!--
    首页 — Composition API 基础

    本页面演示 Vue 3 Composition API 的核心概念:
    1. ref() — 基本类型响应式
    2. reactive() — 对象类型响应式
    3. toRefs() — 解构 reactive 对象
    4. 模板引用 (ref attribute)
  -->
    <div class="page">
        <h2>🏠 Composition API 基础</h2>

        <!-- Section 1: ref() 基本用法 -->
        <section class="card">
            <h3>① ref() — 基本类型响应式</h3>
            <p class="desc">
                ref() 用于创建基本类型的响应式数据。在 JS/TS 中访问需要
                <code>.value</code>， 模板中会自动解包（不需要 .value）。
            </p>
            <div class="demo-area">
                <p>
                    计数器: <strong>{{ counter }}</strong>
                </p>
                <p>
                    两倍值: <strong>{{ doubleCounter }}</strong>
                </p>
                <button @click="counter++">+1</button>
                <button @click="counter--">-1</button>
                <button @click="counter = 0">重置</button>
            </div>
            <pre class="code-block"><code>// 定义
const counter = ref(0)

// JS/TS 中访问: counter.value
// 模板中访问: {{ counter }} (自动解包)</code></pre>
        </section>

        <!-- Section 2: reactive() 对象响应式 -->
        <section class="card">
            <h3>② reactive() — 对象类型响应式</h3>
            <p class="desc">
                reactive() 用于创建对象/数组的深层响应式代理。 注意：解构
                reactive 对象会丢失响应性，需要使用 toRefs()。
            </p>
            <div class="demo-area">
                <p>姓名: {{ user.name }}</p>
                <p>年龄: {{ user.age }}</p>
                <p>地址: {{ user.address.city }} {{ user.address.street }}</p>
                <button @click="user.age++">长一岁</button>
                <button
                    @click="user.name = user.name === '张三' ? '李四' : '张三'"
                >
                    换名字
                </button>
            </div>
        </section>

        <!-- Section 3: 模板引用 (ref attribute) -->
        <section class="card">
            <h3>③ 模板引用 — ref attribute</h3>
            <p class="desc">
                模板引用用于获取 DOM 元素或子组件的引用。 变量名必须与模板中 ref
                属性的值一致。
            </p>
            <div class="demo-area">
                <input ref="inputRef" type="text" placeholder="点击按钮聚焦" />
                <button @click="focusInput">聚焦输入框</button>
                <button @click="clearAndFocus">清空并聚焦</button>
                <p v-if="inputValue">当前输入: {{ inputValue }}</p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * Composition API 基础 — setup 语法
 *
 * Vue 3 的核心变化是从 Options API (data/methods/computed)
 * 转向 Composition API (ref/reactive/computed/watch)
 *
 * 优势:
 * - 更好的逻辑复用（composables）
 * - 更好的 TypeScript 类型推导
 * - 更灵活的代码组织方式
 */
import { ref, reactive, computed, onMounted } from "vue";

// ==================== ref() ====================
// ref() 接受一个内部值，返回一个响应式的 ref 对象
// .value 属性指向内部值
const counter = ref(0);

// computed() 创建一个计算属性，依赖变化时自动重新计算
// 返回的也是 ref 对象，模板中同样不需要 .value
const doubleCounter = computed(() => counter.value * 2);

// ==================== reactive() ====================
// reactive() 创建一个对象的深层响应式代理
// 直接访问属性即可（不需要 .value）
const user = reactive({
    name: "张三",
    age: 25,
    address: {
        city: "北京",
        street: "朝阳区",
    },
});

// ==================== 模板引用 ====================
// 使用与模板中 ref 属性同名的 ref 变量
// 初始值为 null，挂载后自动指向对应的 DOM 元素
const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref("");

/** 聚焦输入框 */
function focusInput() {
    // inputRef.value 就是原生 DOM 元素
    inputRef.value?.focus();
}

/** 清空并聚焦 */
function clearAndFocus() {
    if (inputRef.value) {
        inputRef.value.value = "";
        inputRef.value.focus();
        inputValue.value = "";
    }
}

// ==================== 生命周期钩子 ====================
// onMounted: 组件挂载到 DOM 后调用
// 在这里可以安全地访问 DOM
onMounted(() => {
    // 监听输入框的输入事件
    inputRef.value?.addEventListener("input", (e) => {
        inputValue.value = (e.target as HTMLInputElement).value;
    });
    console.log("HomeView 已挂载");
});
</script>
