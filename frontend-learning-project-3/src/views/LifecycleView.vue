<template>
    <!--
    生命周期钩子 — 理解组件的各个阶段

    Vue 3 生命周期钩子 (Composition API):
    - onBeforeMount: 组件挂载到 DOM 之前
    - onMounted: 组件挂载到 DOM 之后（可以访问 DOM）
    - onBeforeUpdate: 响应式数据变化，DOM 更新之前
    - onUpdated: DOM 更新之后
    - onBeforeUnmount: 组件卸载之前（清理定时器、事件监听等）
    - onUnmounted: 组件卸载之后
    - onErrorCaptured: 捕获后代组件错误
    - onActivated / onDeactivated: keep-alive 缓存组件的激活/停用
  -->
    <div class="page">
        <h2>🔄 生命周期钩子</h2>

        <!-- 生命周期日志 -->
        <section class="card">
            <h3>生命周期执行日志</h3>
            <p class="desc">
                下方按钮会触发组件的创建/销毁，观察控制台输出或下方日志来理解生命周期的执行顺序。
            </p>
            <div class="demo-area">
                <button @click="showChild = !showChild">
                    {{ showChild ? "销毁子组件" : "创建子组件" }}
                </button>
                <button @click="childKey++">强制重建子组件 (key 变化)</button>
            </div>
            <!-- 使用 key 强制销毁重建组件 -->
            <LifecycleChild v-if="showChild" :key="childKey" @log="addLog" />
        </section>

        <!-- 日志显示 -->
        <section class="card">
            <h3>执行日志 (最新在上)</h3>
            <button @click="logs = []">清空日志</button>
            <ul class="log-list">
                <li v-for="(log, i) in logs" :key="i" :class="log.type">
                    [{{ log.time }}] {{ log.hook }} — {{ log.message }}
                </li>
            </ul>
            <p v-if="logs.length === 0" class="empty-tip">
                暂无日志，点击上方按钮触发生命周期
            </p>
        </section>

        <!-- 定时器示例 -->
        <section class="card">
            <h3>定时器管理 — onBeforeUnmount 清理</h3>
            <p class="desc">
                组件销毁时必须清理定时器、事件监听等，否则会造成内存泄漏。
                onBeforeUnmount 是清理副作用的最佳位置。
            </p>
            <div class="demo-area">
                <p>计时器: {{ timerCount }} 秒</p>
                <button @click="startTimer" :disabled="timerRunning">
                    开始计时
                </button>
                <button @click="stopTimer" :disabled="!timerRunning">
                    停止计时
                </button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * 生命周期钩子详解
 *
 * Composition API 中的生命周期钩子必须在 setup() 或 <script setup> 中同步调用
 * 因为它们依赖于当前组件实例的上下文
 *
 * 与 Vue 2 Options API 的对应关系:
 * - beforeCreate → setup() 本身
 * - created → setup() 本身
 * - beforeMount → onBeforeMount
 * - mounted → onMounted
 * - beforeUpdate → onBeforeUpdate
 * - updated → onUpdated
 * - beforeDestroy → onBeforeUnmount
 * - destroyed → onUnmounted
 */
import {
    ref,
    onMounted,
    onBeforeMount,
    onBeforeUnmount,
    onUpdated,
    onBeforeUpdate,
} from "vue";
import LifecycleChild from "@/components/LifecycleChild.vue";

// ==================== 状态 ====================
const showChild = ref(false);
const childKey = ref(0);
const logs = ref<
    Array<{ time: string; hook: string; message: string; type: string }>
>([]);

// 定时器
const timerCount = ref(0);
const timerRunning = ref(false);
let timerId: ReturnType<typeof setInterval> | null = null;

// ==================== 辅助函数 ====================
function addLog(hook: string, message: string, type: string = "info") {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
    logs.value.unshift({ time, hook, message, type });
    // 最多保留 20 条
    if (logs.value.length > 20) logs.value.pop();
}

// ==================== 生命周期钩子 ====================
/**
 * onBeforeMount: 组件挂载之前
 * 此时模板已编译，但尚未渲染到 DOM
 * 很少使用，一般用于一些准备工作
 */
onBeforeMount(() => {
    console.log("[父组件] onBeforeMount — 即将挂载到 DOM");
    addLog("onBeforeMount", "父组件即将挂载到 DOM", "parent");
});

/**
 * onMounted: 组件挂载之后
 * 此时组件已渲染到 DOM，可以安全地访问 DOM 元素
 * 常用场景:
 * - 操作 DOM（获取元素尺寸、位置）
 * - 初始化第三方库（图表、编辑器等）
 * - 发起初始数据请求
 */
onMounted(() => {
    console.log("[父组件] onMounted — 已挂载到 DOM");
    addLog("onMounted", "父组件已挂载到 DOM，可以安全访问元素了", "parent");
});

/**
 * onBeforeUpdate: 数据变化后、DOM 更新前
 * 此时可以访问更新前的 DOM 状态
 * 常用于保存 DOM 状态（如滚动位置）
 */
onBeforeUpdate(() => {
    console.log("[父组件] onBeforeUpdate — 即将更新 DOM");
    addLog("onBeforeUpdate", "响应式数据变化，DOM 即将更新", "parent");
});

/**
 * onUpdated: DOM 更新完成后
 * 此时 DOM 已经反映了最新的数据状态
 * 注意: 在这里修改数据可能导致无限循环
 */
onUpdated(() => {
    console.log("[父组件] onUpdated — DOM 已更新");
    addLog("onUpdated", "DOM 已更新完成", "parent");
});

/**
 * onBeforeUnmount: 组件卸载之前
 * 这是清理副作用（定时器、事件监听、WebSocket 连接等）的最佳时机
 * 此时组件仍然完全可用
 */
onBeforeUnmount(() => {
    console.log("[父组件] onBeforeUnmount — 即将卸载");
    // 清理定时器
    stopTimer();
    addLog("onBeforeUnmount", "父组件即将卸载，正在清理副作用...", "parent");
});

// ==================== 定时器管理 ====================
function startTimer() {
    timerRunning.value = true;
    timerId = setInterval(() => {
        timerCount.value++;
    }, 1000);
}

function stopTimer() {
    timerRunning.value = false;
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}
</script>
