<template>
    <!--
    Pinia 状态管理

    Pinia 是 Vue 3 的官方状态管理库，具有以下特点:
    1. 完整的 TypeScript 支持
    2. 直观的 API（没有 mutations）
    3. 支持 DevTools
    4. 轻量级（约 1KB）
    5. 支持插件系统
    6. 支持服务端渲染 (SSR)
  -->
    <div class="page">
        <h2>📦 Pinia 状态管理</h2>

        <!-- Store 状态展示 -->
        <section class="card">
            <h3>① 基本状态管理</h3>
            <p class="desc">
                Pinia 中的 state 类似于组件的 data，但可以在任意组件间共享。
                使用 storeToRefs() 解构可以保持响应性。
            </p>
            <div class="demo-area">
                <div class="counter-display">
                    <p>
                        当前值: <strong class="big-num">{{ count }}</strong>
                    </p>
                    <p>
                        两倍值: <strong>{{ doubleCount }}</strong>
                    </p>
                    <p>步长: {{ step }}</p>
                    <p>
                        状态:
                        <span :class="isPositive ? 'tag-green' : 'tag-gray'">
                            {{ isPositive ? "正数" : "非正数" }}
                        </span>
                        <span :class="isEven ? 'tag-blue' : 'tag-orange'">
                            {{ isEven ? "偶数" : "奇数" }}
                        </span>
                    </p>
                </div>
                <div class="counter-actions">
                    <button @click="counterStore.decrement()">
                        - {{ step }}
                    </button>
                    <button @click="counterStore.increment()">
                        + {{ step }}
                    </button>
                    <button @click="counterStore.reset()">重置</button>
                </div>
            </div>
        </section>

        <!-- 步长设置 -->
        <section class="card">
            <h3>② 修改状态 — Actions</h3>
            <p class="desc">
                Pinia 没有 mutations，直接在 actions 中修改 state 即可。 Actions
                可以是同步的也可以是异步的。
            </p>
            <div class="demo-area">
                <label>
                    设置步长:
                    <input
                        :value="step"
                        type="number"
                        min="1"
                        max="10"
                        @change="
                            counterStore.setStep(
                                Number(
                                    ($event.target as HTMLInputElement).value,
                                ),
                            )
                        "
                    />
                </label>
                <button @click="counterStore.fetchCount()">
                    随机获取值 (异步)
                </button>
            </div>
        </section>

        <!-- 历史记录 -->
        <section class="card">
            <h3>③ 响应式状态变化追踪</h3>
            <p class="desc">
                Store
                中的所有状态都是响应式的，当它们变化时，所有使用它们的组件都会自动更新。
                这是 Pinia 区别于简单全局变量的关键。
            </p>
            <div class="demo-area">
                <p>变化历史 (最多显示最近 10 次):</p>
                <div class="history-list">
                    <span
                        v-for="(val, idx) in recentHistory"
                        :key="idx"
                        class="history-item"
                    >
                        {{ val }}
                    </span>
                </div>
            </div>
        </section>

        <!-- 与组件内状态对比 -->
        <section class="card">
            <h3>④ Pinia vs 组件内状态</h3>
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>特性</th>
                        <th>组件内 ref/reactive</th>
                        <th>Pinia Store</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>作用域</td>
                        <td>单个组件</td>
                        <td>全局（所有组件共享）</td>
                    </tr>
                    <tr>
                        <td>TypeScript</td>
                        <td>完整支持</td>
                        <td>完整支持</td>
                    </tr>
                    <tr>
                        <td>DevTools</td>
                        <td>有限</td>
                        <td>完整支持（时间旅行调试）</td>
                    </tr>
                    <tr>
                        <td>SSR</td>
                        <td>需要额外处理</td>
                        <td>内置支持</td>
                    </tr>
                    <tr>
                        <td>适合场景</td>
                        <td>局部 UI 状态</td>
                        <td>需要跨组件共享的状态</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * Pinia 状态管理 — 使用示例
 *
 * 核心 API:
 * 1. useXxxStore() — 获取 Store 实例
 * 2. storeToRefs(store) — 解构 Store，保持响应性
 * 3. store.xxx — 直接访问状态/操作
 * 4. store.$subscribe() — 订阅状态变化
 * 5. store.$patch() — 批量更新
 * 6. store.$reset() — 重置状态
 */
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

// 获取 Store 实例
const counterStore = useCounterStore();

/**
 * storeToRefs: 将 Store 中的 state 和 getters 转为 ref
 *
 * 为什么要用 storeToRefs?
 * 直接解构 { count, step } 会丢失响应性（类似于解构 reactive 对象）
 * storeToRefs 只转换 state 和 getters，不转换 actions（actions 本身不需要响应性）
 */
const { count, step, doubleCount, isPositive, isEven, history } =
    storeToRefs(counterStore);

// actions 可以直接解构，不需要 storeToRefs
// const { increment, decrement, reset } = counterStore

// computed 可以对 Store 数据做进一步处理
const recentHistory = computed(() => {
    return history.value.slice(-10).reverse();
});

/**
 * $subscribe: 监听 Store 状态变化
 * 类似于 watch，但专门用于 Store
 * 可以用于日志记录、持久化等
 */
counterStore.$subscribe((mutation, state) => {
    console.log("[Pinia 订阅]", {
        type: mutation.type, // 'direct' | 'patch object' | 'patch function'
        storeId: mutation.storeId,
        currentState: state,
    });
});
</script>
