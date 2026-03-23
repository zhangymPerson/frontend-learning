<template>
    <!--
    插槽演示组件

    Vue 3 插槽类型:
    1. 默认插槽: <slot /> — 未指定名称的内容
    2. 具名插槽: <slot name="xxx" /> — 通过 v-slot:xxx 分发
    3. 作用域插槽: <slot :data="xxx" /> — 子组件向父组件传递数据
  -->
    <div class="slot-demo">
        <h4>插槽容器</h4>

        <!-- 具名插槽: header -->
        <div class="slot-section header-section">
            <p class="slot-label">Header Slot:</p>
            <!--
        <slot name="header"> 具名插槽
        如果父组件没有提供 #header 的内容，则显示默认内容
      -->
            <slot name="header">
                <p style="color: #999">（默认 header 内容）</p>
            </slot>
        </div>

        <!-- 默认插槽 -->
        <div class="slot-section default-section">
            <p class="slot-label">Default Slot:</p>
            <!--
        <slot /> 默认插槽
        父组件中直接写在子组件标签内的内容会放在这里
      -->
            <slot>
                <p style="color: #999">（默认内容）</p>
            </slot>
        </div>

        <!-- 作用域插槽: footer -->
        <div class="slot-section footer-section">
            <p class="slot-label">Scoped Slot (footer):</p>
            <!--
        作用域插槽的关键:
        在 <slot> 上绑定属性，父组件通过 v-slot="scope" 接收

        作用域插槽允许子组件向父组件暴露数据，
        父组件可以根据这些数据决定如何渲染
      -->
            <slot name="footer" :info="slotInfo" :count="slotCount" />
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 插槽组件 — 作用域插槽的数据提供者
 *
 * 作用域插槽的工作原理:
 * 1. 子组件在 <slot> 上绑定属性（slot props）
 * 2. 父组件通过 v-slot="变量名" 接收这些属性
 * 3. 父组件可以使用这些数据来决定如何渲染
 *
 * 这是 Vue 中 "renderless component"（无渲染组件）模式的基础
 * 常见应用: 数据表格、下拉选择、虚拟滚动等可复用组件
 */
import { ref } from "vue";

// 作用域插槽暴露给父组件的数据
const slotInfo = ref("来自子组件的作用域数据");
const slotCount = ref(42);
</script>
