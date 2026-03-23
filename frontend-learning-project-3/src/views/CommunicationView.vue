<template>
    <!--
    组件通信 — 父子组件数据传递

    Vue 3 组件通信的几种方式:
    1. Props: 父 → 子 (单向数据流)
    2. Emits: 子 → 父 (事件通知)
    3. v-model: 双向绑定的语法糖
    4. Slots: 父 → 子 (内容分发)
    5. provide/inject: 跨层级传递
    6. Pinia: 任意组件间共享状态
  -->
    <div class="page">
        <h2>🔗 组件通信</h2>

        <!-- Section 1: Props + Emits -->
        <section class="card">
            <h3>① Props + Emits</h3>
            <p class="desc">
                Props 是父组件传递给子组件的数据（只读，子组件不应直接修改）。
                Emits 是子组件向父组件发送事件的方式。
            </p>
            <div class="demo-area">
                <p>
                    父组件状态: 消息 = "{{ parentMessage }}"，计数 =
                    {{ parentCount }}
                </p>
                <input v-model="parentMessage" placeholder="修改消息内容" />
                <button @click="parentCount++">增加计数</button>

                <!--
          向子组件传递 props
          :message 是 prop 绑定
          @update 是子组件 emit 的事件
        -->
                <ChildComponent
                    :message="parentMessage"
                    :count="parentCount"
                    @update:message="parentMessage = $event"
                    @update:count="parentCount = $event"
                />
            </div>
        </section>

        <!-- Section 2: v-model 语法糖 -->
        <section class="card">
            <h3>② v-model 双向绑定</h3>
            <p class="desc">
                v-model 是 :modelValue + @update:modelValue 的语法糖。 Vue 3
                支持多个 v-model: v-model:title, v-model:content。 也可以用
                .lazy 等修饰符。
            </p>
            <div class="demo-area">
                <p>当前值: {{ formValue }}</p>
                <CustomInput v-model="formValue" placeholder="自定义输入组件" />
            </div>
        </section>

        <!-- Section 3: 插槽 -->
        <section class="card">
            <h3>③ 插槽 (Slots) — 内容分发</h3>
            <p class="desc">
                插槽允许父组件向子组件传递模板内容。 Vue 3 支持:
                默认插槽、具名插槽、作用域插槽。
            </p>
            <div class="demo-area">
                <SlotDemo>
                    <!-- 默认插槽: 直接写在子组件标签内的内容 -->
                    <p>这是通过默认插槽传入的内容 🎉</p>

                    <!-- 具名插槽: 使用 v-slot:名称 或 #名称 -->
                    <template #header>
                        <h4 style="color: #42b883">
                            这是具名插槽 #header 的内容
                        </h4>
                    </template>

                    <!-- 作用域插槽: 子组件通过 slot props 向父组件传递数据 -->
                    <template #footer="{ info, count }">
                        <p style="color: #888">
                            作用域插槽接收的数据: info = "{{ info }}", count =
                            {{ count }}
                        </p>
                    </template>
                </SlotDemo>
            </div>
        </section>

        <!-- Section 4: provide / inject -->
        <section class="card">
            <h3>④ provide / inject — 跨层级传递</h3>
            <p class="desc">
                provide/inject 允许祖先组件向所有后代组件注入数据，
                无论层级多深。适合主题配置、全局配置等场景。 注意: provide
                的值默认不是响应式的，需要传入 ref/reactive 对象。
            </p>
            <div class="demo-area">
                <p>当前主题: {{ theme }}</p>
                <button @click="toggleTheme">切换主题</button>
                <InjectedChild />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * 组件通信 — Composition API 方式
 *
 * Vue 3 中组件通信的方式更加清晰和类型安全
 * 所有通信方式都支持完整的 TypeScript 类型推导
 */
import { ref, provide, readonly } from "vue";
import ChildComponent from "@/components/ChildComponent.vue";
import CustomInput from "@/components/CustomInput.vue";
import SlotDemo from "@/components/SlotDemo.vue";
import InjectedChild from "@/components/InjectedChild.vue";

// ==================== Props + Emits 示例 ====================
const parentMessage = ref("来自父组件的问候");
const parentCount = ref(0);

// ==================== v-model 示例 ====================
const formValue = ref("初始值");

// ==================== provide / inject 示例 ====================
const theme = ref<"light" | "dark">("light");

/**
 * provide(key, value): 向后代组件提供数据
 *
 * 使用 readonly 包裹可以防止后代组件修改 provide 的值
 * 如果需要后代组件修改，提供一个修改函数
 */
provide("theme", readonly(theme));
provide("toggleTheme", () => {
    theme.value = theme.value === "light" ? "dark" : "light";
});

function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
}
</script>
