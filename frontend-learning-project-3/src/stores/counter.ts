/**
 * Pinia 状态管理 — 计数器 Store
 *
 * Pinia 是 Vue 3 官方推荐的状态管理库，相比 Vuex 有以下优势:
 * 1. 完整的 TypeScript 支持，无需额外的类型声明
 * 2. 更简洁的 API，没有 mutations（直接用 actions 修改状态）
 * 3. 支持 Composition API 风格（setup store）和 Options API 风格
 * 4. 内置 devtools 支持
 * 5. 轻量，无依赖
 *
 * 两种定义方式:
 * - Option Store: 类似 Vuex，用 state/getters/actions
 * - Setup Store: 类似 Composition API，用 ref/computed/function
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";

// 使用 defineStore 定义一个 Store
// 第一个参数是 Store 的唯一 ID（必须唯一，用于 devtools 和 SSR）
export const useCounterStore = defineStore("counter", () => {
  // ============ State (状态) ============
  // 使用 ref() 定义响应式状态，替代 Vuex 中的 state
  const count = ref(0);
  const step = ref(1);
  const history = ref<number[]>([0]); // 记录每次变化后的历史值

  // ============ Getters (计算属性) ============
  // 使用 computed() 定义派生状态，替代 Vuex 中的 getters
  const doubleCount = computed(() => count.value * 2);
  const isPositive = computed(() => count.value > 0);
  const isEven = computed(() => count.value % 2 === 0);

  // ============ Actions (操作) ============
  // 直接定义函数来修改状态，替代 Vuex 中的 mutations + actions

  /** 递增计数器 */
  function increment() {
    count.value += step.value;
    history.value.push(count.value);
  }

  /** 递减计数器 */
  function decrement() {
    count.value -= step.value;
    history.value.push(count.value);
  }

  /** 重置计数器 */
  function reset() {
    count.value = 0;
    step.value = 1;
    history.value = [0];
  }

  /** 设置步长 */
  function setStep(newStep: number) {
    if (newStep > 0) {
      step.value = newStep;
    }
  }

  /** 异步操作 — 模拟 API 调用 */
  async function fetchCount(): Promise<void> {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    count.value = Math.floor(Math.random() * 100);
    history.value.push(count.value);
  }

  // 暴露所有状态、计算属性和操作
  return {
    // state
    count,
    step,
    history,
    // getters
    doubleCount,
    isPositive,
    isEven,
    // actions
    increment,
    decrement,
    reset,
    setStep,
    fetchCount,
  };
});
