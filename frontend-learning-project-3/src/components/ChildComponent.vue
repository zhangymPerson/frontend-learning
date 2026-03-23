<template>
    <!--
    子组件 — Props + Emits 示例

    这个组件展示了 Vue 3 中父子组件通信的标准模式:
    - defineProps: 声明接收的 props
    - defineEmits: 声明可以触发的事件
  -->
    <div class="child-component">
        <h4>📦 子组件</h4>
        <p>
            接收到的 message: <strong>{{ message }}</strong>
        </p>
        <p>
            接收到的 count: <strong>{{ count }}</strong>
        </p>
        <p>子组件内部状态: {{ localCounter }}</p>

        <div class="child-actions">
            <!--
        子组件通过 emit 触发事件，通知父组件
        emit('事件名', payload)
        父组件通过 @事件名="handler" 监听
      -->
            <button @click="$emit('update:message', '子组件修改了消息!')">
                修改父组件的 message
            </button>
            <button @click="$emit('update:count', count + 10)">
                父组件 count +10
            </button>
            <button @click="localCounter++">修改子组件本地状态</button>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * Props 和 Emits 的类型声明
 *
 * Vue 3 中使用 defineProps 和 defineEmits 编译宏来声明:
 * 1. defineProps: 接收父组件传递的数据
 * 2. defineEmits: 声明可以向父组件发送的事件
 *
 * 这两个宏不需要导入，编译器会自动处理
 * 它们只在 <script setup> 中可用
 */
import { ref } from "vue";

/**
 * defineProps: 声明 props
 *
 * 方式一（运行时声明）:
 * defineProps({ message: String, count: Number })
 *
 * 方式二（基于类型的声明，推荐用于 TypeScript）:
 * defineProps<{ message: string; count: number }>()
 *
 * 方式三（带默认值）:
 * withDefaults(defineProps<{ message?: string }>(), { message: '默认值' })
 */
defineProps<{
    /** 从父组件接收的消息文本 */
    message: string;
    /** 从父组件接收的计数值 */
    count: number;
}>();

/**
 * defineEmits: 声明组件可以触发的事件
 *
 * 使用类型声明来定义事件及其 payload 类型
 * 这样父组件监听事件时就能获得类型提示
 */
defineEmits<{
    /** 更新 message，payload 是新的字符串值 */
    "update:message": [value: string];
    /** 更新 count，payload 是新的数字值 */
    "update:count": [value: number];
}>();

// 子组件的本地状态（不受父组件控制）
const localCounter = ref(0);
</script>
