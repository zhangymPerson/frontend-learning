<template>
    <!--
    待办清单 — 综合运用 computed / watch / 组件通信

    本页面综合运用了以下 Vue 3 知识点:
    1. ref() 和 reactive() 管理状态
    2. computed() 派生过滤数据
    3. watch() 监听变化并持久化
    4. v-model 双向绑定
    5. v-for / v-if 列表渲染和条件渲染
    6. 事件处理和修饰符
  -->
    <div class="page">
        <h2>✅ 待办清单</h2>

        <!-- 输入区域 -->
        <section class="card">
            <h3>添加待办</h3>
            <!--
        @submit.prevent 是事件修饰符组合:
        - @submit 监听表单提交事件
        - .prevent 调用 event.preventDefault() 阻止默认行为
      -->
            <form @submit.prevent="addTodo" class="add-form">
                <!--
          v-model 实现双向数据绑定
          底层原理: :value + @input 的语法糖
          .trim 修饰符自动去除首尾空格
        -->
                <input
                    v-model.trim="newTodoText"
                    type="text"
                    placeholder="输入待办事项..."
                    class="todo-input"
                />
                <button type="submit" :disabled="!newTodoText">添加</button>
            </form>
        </section>

        <!-- 过滤和统计 -->
        <section class="card">
            <h3>过滤与统计</h3>
            <div class="filter-bar">
                <!--
          使用 :class 动态绑定类名
          对象语法: { '类名': 条件 }
          当条件为 true 时添加该类名
        -->
                <button
                    v-for="f in filters"
                    :key="f.value"
                    :class="{ active: currentFilter === f.value }"
                    @click="currentFilter = f.value"
                >
                    {{ f.label }}
                </button>
            </div>
            <div class="stats">
                <p>
                    总计: {{ totalCount }} | 已完成: {{ completedCount }} |
                    待办: {{ pendingCount }}
                </p>
                <p>完成进度: {{ progress }}%</p>
                <div class="progress-bar">
                    <div
                        class="progress-fill"
                        :style="{ width: progress + '%' }"
                    />
                </div>
            </div>
        </section>

        <!-- 待办列表 -->
        <section class="card">
            <h3>待办列表</h3>
            <!--
        v-if / v-else 条件渲染
        v-if 是真正的条件渲染，条件为假时元素会被销毁
        v-show 只是切换 display 属性，元素始终存在于 DOM 中
      -->
            <p v-if="filteredTodos.length === 0" class="empty-tip">
                {{
                    currentFilter === "all"
                        ? "暂无待办事项，添加一个吧！"
                        : "没有匹配的待办事项"
                }}
            </p>

            <!--
        v-for 列表渲染
        :key 是必须的，用于 Vue 的虚拟 DOM diff 算法
        key 应该是唯一的、稳定的标识符（不要用 index）
      -->
            <TransitionGroup name="list" tag="ul" class="todo-list">
                <li
                    v-for="todo in filteredTodos"
                    :key="todo.id"
                    :class="{ completed: todo.completed }"
                    class="todo-item"
                >
                    <!--
            :checked + @change 实现 checkbox 的受控模式
            这比直接用 v-model 更清晰，适合需要额外逻辑的场景
          -->
                    <input
                        type="checkbox"
                        :checked="todo.completed"
                        @change="toggleTodo(todo.id)"
                    />
                    <span class="todo-text">{{ todo.text }}</span>
                    <span class="todo-date">{{
                        formatDate(todo.createdAt)
                    }}</span>
                    <button class="delete-btn" @click="removeTodo(todo.id)">
                        删除
                    </button>
                </li>
            </TransitionGroup>
        </section>

        <!-- 批量操作 -->
        <section class="card" v-if="totalCount > 0">
            <h3>批量操作</h3>
            <div class="batch-actions">
                <button @click="markAllCompleted">全部完成</button>
                <button
                    @click="clearCompleted"
                    :disabled="completedCount === 0"
                >
                    清除已完成
                </button>
                <button @click="clearAll">清空全部</button>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
/**
 * 待办清单 — 核心逻辑
 *
 * 本组件展示了 Vue 3 中最常见的数据处理模式:
 * 1. 使用 ref 管理简单状态
 * 2. 使用 computed 过滤和派生数据
 * 3. 使用 watch 监听变化并执行副作用
 */
import { ref, computed, watch } from "vue";
import type { TodoItem } from "@/types";

// ==================== 状态定义 ====================
const newTodoText = ref("");
const todos = ref<TodoItem[]>([]);
const currentFilter = ref<"all" | "pending" | "completed">("all");
let nextId = 1;

// 过滤选项配置
const filters = [
    { label: "全部", value: "all" as const },
    { label: "待办", value: "pending" as const },
    { label: "已完成", value: "completed" as const },
];

// ==================== 计算属性 ====================
/**
 * filteredTodos: 根据当前过滤条件返回对应的待办列表
 * computed 的特点:
 * - 有缓存，只有依赖变化时才重新计算
 * - 适合从现有状态派生新数据
 */
const filteredTodos = computed(() => {
    switch (currentFilter.value) {
        case "pending":
            return todos.value.filter((t) => !t.completed);
        case "completed":
            return todos.value.filter((t) => t.completed);
        default:
            return todos.value;
    }
});

const totalCount = computed(() => todos.value.length);
const completedCount = computed(
    () => todos.value.filter((t) => t.completed).length,
);
const pendingCount = computed(() => totalCount.value - completedCount.value);
const progress = computed(() =>
    totalCount.value > 0
        ? Math.round((completedCount.value / totalCount.value) * 100)
        : 0,
);

// ==================== 操作方法 ====================
/** 添加待办事项 */
function addTodo() {
    if (!newTodoText.value) return;
    todos.value.push({
        id: nextId++,
        text: newTodoText.value,
        completed: false,
        createdAt: new Date(),
    });
    newTodoText.value = ""; // 清空输入框
}

/** 切换完成状态 */
function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
    }
}

/** 删除待办 */
function removeTodo(id: number) {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index > -1) {
        todos.value.splice(index, 1);
    }
}

/** 全部标记为已完成 */
function markAllCompleted() {
    todos.value.forEach((t) => {
        t.completed = true;
    });
}

/** 清除已完成的 */
function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.completed);
}

/** 清空全部 */
function clearAll() {
    todos.value = [];
}

/** 格式化日期 */
function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// ==================== watch 持久化 ====================
/**
 * watch 深度监听 todos 变化，自动保存到 localStorage
 * deep: true 表示深度监听（检测对象内部属性变化）
 */
watch(
    todos,
    (newTodos) => {
        localStorage.setItem("vue3-todos", JSON.stringify(newTodos));
        console.log(`[持久化] 已保存 ${newTodos.length} 条待办`);
    },
    { deep: true },
);

// 初始化时从 localStorage 加载数据
const savedTodos = localStorage.getItem("vue3-todos");
if (savedTodos) {
    try {
        todos.value = JSON.parse(savedTodos);
        // 更新 nextId 避免 ID 冲突
        nextId = Math.max(...todos.value.map((t) => t.id), 0) + 1;
    } catch {
        console.warn("localStorage 数据格式错误");
    }
}
</script>
