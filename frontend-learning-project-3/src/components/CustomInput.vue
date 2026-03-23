<template>
    <!--
    自定义输入组件 — v-model 实现

    v-model 的底层实现:
    - 父组件: <CustomInput v-model="value" />
    - 等价于: <CustomInput :modelValue="value" @update:modelValue="value = $event" />

    子组件需要:
    1. 接收 modelValue prop
    2. 触发 update:modelValue 事件
  -->
    <div class="custom-input">
        <input
            :value="modelValue"
            :placeholder="placeholder"
            type="text"
            class="custom-input-field"
            @input="
                $emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).value,
                )
            "
        />
        <button
            v-if="modelValue"
            class="clear-btn"
            @click="$emit('update:modelValue', '')"
        >
            ✕
        </button>
        <span class="char-count">{{ modelValue.length }} 字符</span>
    </div>
</template>

<script setup lang="ts">
/**
 * 自定义 v-model 组件
 *
 * Vue 3 的 v-model:
 * - 默认绑定的 prop 是 modelValue
 * - 默认触发的事件是 update:modelValue
 * - 可以使用 v-model:xxx 实现多个双向绑定
 *   例如: v-model:title → prop: title, event: update:title
 */
defineProps<{
    /** 当前绑定的值（v-model 传入） */
    modelValue: string;
    /** 输入框占位文本 */
    placeholder?: string;
}>();

/**
 * 声明 update:modelValue 事件
 * 这是 v-model 能够工作的关键:
 * 当子组件触发这个事件时，父组件的 v-model 绑定值会自动更新
 */
defineEmits<{
    "update:modelValue": [value: string];
}>();
</script>
