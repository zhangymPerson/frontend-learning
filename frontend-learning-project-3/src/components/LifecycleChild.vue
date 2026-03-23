<template>
    <!--
    生命周期子组件 — 用于演示父子组件生命周期的执行顺序

    组件的生命周期顺序:
    父 onBeforeMount → 子 onBeforeMount → 子 onMounted → 父 onMounted
    卸载顺序:
    父 onBeforeUnmount → 子 onBeforeUnmount → 子 onUnmounted → 父 onUnmounted
  -->
    <div class="lifecycle-child">
        <h4>👶 生命周期子组件</h4>
        <p>我已创建，生命周期钩子正在执行中...</p>
        <p>子组件内部计数: {{ localCount }}</p>
        <button @click="localCount++">子组件 +1</button>
    </div>
</template>

<script setup lang="ts">
/**
 * 子组件的生命周期钩子
 *
 * 用于演示父子组件之间生命周期的执行顺序
 * 通过 emit 将生命周期事件通知给父组件
 */
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
} from "vue";

// 接收父组件的 props
defineProps<{
    /** 预留 prop，当前未使用 */
    label?: string;
}>();

// 向父组件发送生命周期事件
const emit = defineEmits<{
    log: [hook: string, message: string, type: string];
}>();

const localCount = ref(0);

// ==================== 生命周期钩子 ====================

/**
 * onBeforeMount: 组件挂载前
 * 此时模板已编译为 render 函数，但尚未生成真实 DOM
 */
onBeforeMount(() => {
    console.log("[子组件] onBeforeMount — 即将挂载");
    emit("log", "onBeforeMount", "子组件即将挂载到 DOM", "child");
});

/**
 * onMounted: 组件挂载后
 * 此时组件已渲染为真实 DOM，可以安全操作
 * 子组件的 onMounted 先于父组件的 onMounted 执行
 */
onMounted(() => {
    console.log("[子组件] onMounted — 已挂载");
    emit("log", "onMounted", "子组件已挂载到 DOM", "child");
});

/** onBeforeUpdate: 数据变化，DOM 更新前 */
onBeforeUpdate(() => {
    console.log("[子组件] onBeforeUpdate");
    emit("log", "onBeforeUpdate", "子组件 DOM 即将更新", "child");
});

/** onUpdated: DOM 更新后 */
onUpdated(() => {
    console.log("[子组件] onUpdated");
    emit("log", "onUpdated", "子组件 DOM 已更新", "child");
});

/**
 * onBeforeUnmount: 组件卸载前
 * 这是清理副作用的最佳时机
 * 子组件的 onBeforeUnmount 先于父组件执行
 */
onBeforeUnmount(() => {
    console.log("[子组件] onBeforeUnmount — 即将卸载");
    emit("log", "onBeforeUnmount", "子组件即将卸载", "child");
});

/**
 * onUnmounted: 组件卸载后
 * 组件的所有指令绑定、事件监听器等都已移除
 * 子组件的 onUnmounted 先于父组件执行
 */
onUnmounted(() => {
    console.log("[子组件] onUnmounted — 已卸载");
    emit("log", "onUnmounted", "子组件已完全卸载", "child");
});
</script>
