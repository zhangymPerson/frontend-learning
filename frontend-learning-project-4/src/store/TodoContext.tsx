/**
 * Todo Store - 基于 Context API 和 useReducer 的状态管理
 *
 * 本文件展示了 React 中最常用的两种状态管理模式的组合：
 * 1. useReducer - 管理复杂的状态逻辑
 * 2. Context API - 实现跨组件的状态共享
 *
 * 这种组合的优势：
 * - 无需引入第三方库（如 Redux）
 * - 代码量适中，学习成本低
 * - TypeScript 类型支持完善
 * - 适合中小型应用的状态管理
 */

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
  type Reducer,
} from "react";
import type {
  Todo,
  TodoState,
  TodoAction,
  FilterOptions,
  SortOptions,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStats,
  Priority,
  TodoStatus,
} from "@/types";

// ============================================
// 工具函数：数据转换和计算
// ============================================

/**
 * 计算统计信息
 *
 * 这是从主状态派生出来的计算值（Derived State）
 * 使用 reduce 方法进行数组聚合，是函数式编程的常用技巧
 *
 * @param todos - Todo 数组
 * @returns 统计信息对象
 */
function calculateStats(todos: Todo[]): TodoStats {
  return todos.reduce(
    (stats, todo) => {
      // 统计完成状态
      if (todo.status === "completed") {
        stats.completed++;
      } else {
        stats.pending++;
      }

      // 统计优先级分布
      switch (todo.priority) {
        case "high":
          stats.highPriority++;
          break;
        case "medium":
          stats.mediumPriority++;
          break;
        case "low":
          stats.lowPriority++;
          break;
      }

      return stats;
    },
    {
      total: todos.length,
      completed: 0,
      pending: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    },
  );
}

/**
 * 根据筛选条件过滤 Todo 列表
 *
 * 这是一个纯函数，不修改原数组，返回新数组
 * 使用 filter 方法结合条件判断实现多条件筛选
 *
 * @param todos - 原始 Todo 数组
 * @param filter - 筛选条件
 * @returns 过滤后的 Todo 数组
 */
function filterTodos(todos: Todo[], filter: FilterOptions): Todo[] {
  return todos.filter((todo) => {
    // 状态筛选：null 表示不过滤，显示全部
    if (filter.status !== null && todo.status !== filter.status) {
      return false;
    }

    // 优先级筛选：null 表示不过滤，显示全部
    if (filter.priority !== null && todo.priority !== filter.priority) {
      return false;
    }

    return true;
  });
}

/**
 * 优先级排序权重映射
 *
 * 将优先级字符串转换为数字权重，便于排序比较
 * 数字越大优先级越高
 */
const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * 根据 Todo 项的字段值进行比较
 *
 * 使用泛型确保类型安全
 * 支持字符串和数字类型的字段比较
 *
 * @param a - 第一个比较项
 * @param b - 第二个比较项
 * @param field - 比较的字段名
 * @param direction - 排序方向
 */
function compareByField(
  a: Todo,
  b: Todo,
  field: "createdAt" | "updatedAt" | "priority" | "title",
  direction: "asc" | "desc",
): number {
  let comparison = 0;

  switch (field) {
    case "priority":
      // 优先级需要通过权重映射转换为数字进行比较
      comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      break;
    case "createdAt":
    case "updatedAt":
      // 日期字符串可以直接比较（ISO 8601 格式支持字符串比较）
      comparison = a[field].localeCompare(b[field]);
      break;
    case "title":
      // 标题按字母顺序排序
      comparison = a[field].localeCompare(b[field], "zh-CN"); // 支持中文排序
      break;
  }

  // 根据排序方向返回结果
  return direction === "asc" ? comparison : -comparison;
}

/**
 * 根据排序配置对 Todo 列表进行排序
 *
 * 使用展开运算符创建新数组，避免修改原数组（不可变性原则）
 *
 * @param todos - 原始 Todo 数组
 * @param sort - 排序配置
 * @returns 排序后的 Todo 数组
 */
function sortTodos(todos: Todo[], sort: SortOptions): Todo[] {
  return [...todos].sort((a, b) =>
    compareByField(a, b, sort.field, sort.direction),
  );
}

// ============================================
// Reducer 定义
// ============================================

/**
 * Todo Reducer - 状态更新的核心逻辑
 *
 * Reducer 是一个纯函数：(state, action) => newState
 * 它接收当前状态和 action，返回新状态
 *
 * 重要原则：
 * 1. 永远不要修改参数 state（使用展开运算符或 Object.assign）
 * 2. 不要执行副作用（如 API 调用）
 * 3. 根据 action.type 决定如何更新状态
 */
const todoReducer: Reducer<TodoState, TodoAction> = (state, action) => {
  switch (action.type) {
    case "ADD_TODO": {
      // 使用展开运算符将新 Todo 添加到数组开头
      // 这样最新的 Todo 会显示在列表最前面
      const newTodos = [action.payload, ...state.todos];
      return {
        ...state,
        todos: newTodos,
        // 统计信息需要重新计算
        stats: calculateStats(newTodos),
      };
    }

    case "UPDATE_TODO": {
      // 使用 map 更新匹配的 Todo
      // map 不改变原数组，返回新数组
      const newTodos = state.todos.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo,
      );
      return {
        ...state,
        todos: newTodos,
        stats: calculateStats(newTodos),
      };
    }

    case "DELETE_TODO": {
      // 使用 filter 删除 Todo
      // filter 返回新数组，包含所有满足条件的元素
      const newTodos = state.todos.filter((todo) => todo.id !== action.payload);
      return {
        ...state,
        todos: newTodos,
        stats: calculateStats(newTodos),
      };
    }

    case "TOGGLE_TODO": {
      // 切换 Todo 的完成状态
      const newTodos = state.todos.map((todo) =>
        todo.id === action.payload
          ? {
              ...todo,
              status: (todo.status === "completed"
                ? "pending"
                : "completed") as TodoStatus,
              updatedAt: new Date().toISOString(), // 更新修改时间
            }
          : todo,
      );
      return {
        ...state,
        todos: newTodos,
        stats: calculateStats(newTodos),
      };
    }

    case "SET_FILTER": {
      // 更新筛选条件，使用展开运算符合并旧值和新值
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };
    }

    case "SET_SORT": {
      return {
        ...state,
        sort: action.payload,
      };
    }

    case "CLEAR_COMPLETED": {
      // 清除所有已完成的 Todo
      const newTodos = state.todos.filter(
        (todo) => todo.status !== "completed",
      );
      return {
        ...state,
        todos: newTodos,
        stats: calculateStats(newTodos),
      };
    }

    case "LOAD_TODOS": {
      // 从本地存储加载 Todo 列表
      return {
        ...state,
        todos: action.payload,
        stats: calculateStats(action.payload),
      };
    }

    default:
      // 对于未知的 action 类型，返回原状态
      // 这是一种防御性编程，避免意外修改状态
      return state;
  }
};

// ============================================
// 初始状态
// ============================================

/**
 * 初始状态定义
 *
 * 使用 const 断言确保类型字面量被正确推断
 */
const initialState: TodoState = {
  todos: [],
  filter: {
    status: null, // null 表示不过滤，显示全部
    priority: null,
  },
  sort: {
    field: "createdAt", // 默认按创建时间排序
    direction: "desc", // 最新的在最前面
  },
  stats: {
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
  },
};

// ============================================
// Context 创建
// ============================================

/**
 * TodoContext - 状态上下文
 *
 * Context 提供了一个在组件树中共享数据的方式，
 * 无需通过 props 层层传递（避免 prop drilling）
 *
 * 我们创建两个 Context：
 * 1. TodoStateContext - 存储状态
 * 2. TodoDispatchContext - 存储操作函数
 *
 * 分离状态和操作的原因：
 * - 性能优化：某些组件只需要操作函数，不需要订阅状态变化
 * - 避免不必要的重渲染
 */
const TodoStateContext = createContext<TodoState | null>(null);
const TodoDispatchContext = createContext<{
  addTodo: (input: CreateTodoInput) => void;
  updateTodo: (input: UpdateTodoInput) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setFilter: (filter: Partial<FilterOptions>) => void;
  setSort: (sort: SortOptions) => void;
  clearCompleted: () => void;
} | null>(null);

// ============================================
// Provider 组件
// ============================================

/**
 * TodoProvider - Context 的提供者组件
 *
 * Provider 是 Context 的数据源，包裹在需要访问数据的组件树外部
 * 所有子组件都可以通过 useContext 访问到 Provider 提供的值
 *
 * @param children - 子组件
 */
export function TodoProvider({ children }: { children: ReactNode }) {
  // 使用 useReducer 管理状态
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // 从本地存储加载数据（副作用）
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        // JSON.parse 可能抛出异常，需要 try-catch
        const todos = JSON.parse(savedTodos) as Todo[];
        dispatch({ type: "LOAD_TODOS", payload: todos });
      } catch (error) {
        console.error("从本地存储加载 Todo 失败:", error);
      }
    }
  }, []); // 空依赖数组表示只在组件挂载时执行一次

  // 保存数据到本地存储（副作用）
  useEffect(() => {
    // 只有当 todos 不为空时才保存，避免覆盖已有数据
    if (state.todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(state.todos));
    }
  }, [state.todos]); // 依赖 state.todos，当 todos 变化时执行

  // 定义操作函数，使用 useCallback 避免不必要的重渲染
  const addTodo = useCallback((input: CreateTodoInput) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...input,
      id: `todo-${Date.now()}`, // 使用时间戳生成唯一 ID
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "ADD_TODO", payload: newTodo });
  }, []);

  const updateTodo = useCallback((input: UpdateTodoInput) => {
    dispatch({
      type: "UPDATE_TODO",
      payload: {
        ...input,
        updatedAt: new Date().toISOString(),
      } as Todo,
    });
  }, []);

  const deleteTodo = useCallback((id: string) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  }, []);

  const toggleTodo = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_TODO", payload: id });
  }, []);

  const setFilter = useCallback((filter: Partial<FilterOptions>) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  const setSort = useCallback((sort: SortOptions) => {
    dispatch({ type: "SET_SORT", payload: sort });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
  }, []);

  // 使用 useMemo 缓存操作对象，避免每次渲染都创建新对象
  const actions = useMemo(
    () => ({
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      setFilter,
      setSort,
      clearCompleted,
    }),
    [
      addTodo,
      updateTodo,
      deleteTodo,
      toggleTodo,
      setFilter,
      setSort,
      clearCompleted,
    ],
  );

  // 计算筛选和排序后的 Todo 列表
  // 使用 useMemo 避免不必要的重复计算
  const filteredTodos = useMemo(() => {
    return sortTodos(filterTodos(state.todos, state.filter), state.sort);
  }, [state.todos, state.filter, state.sort]);

  return (
    <TodoStateContext.Provider value={{ ...state, todos: filteredTodos }}>
      <TodoDispatchContext.Provider value={actions}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

// ============================================
// 自定义 Hooks
// ============================================

/**
 * useTodoState - 获取状态的 Hook
 *
 * 这是一个自定义 Hook，封装了 Context 的访问逻辑
 * 优点：
 * 1. 简化组件代码
 * 2. 添加错误检查，当在 Provider 外部使用时给出明确提示
 *
 * @returns TodoState
 */
export function useTodoState(): TodoState {
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error("useTodoState 必须在 TodoProvider 内部使用");
  }
  return context;
}

/**
 * useTodoActions - 获取操作函数的 Hook
 *
 * 分离状态和操作，让只需要操作的组件不需要订阅状态变化
 * 这是一个性能优化的技巧
 */
export function useTodoActions() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error("useTodoActions 必须在 TodoProvider 内部使用");
  }
  return context;
}
