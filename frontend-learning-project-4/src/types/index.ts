/**
 * Todo 应用类型定义文件
 *
 * 本文件定义了整个应用中使用到的核心 TypeScript 类型
 * 集中管理类型定义有助于：
 * 1. 保持类型的一致性
 * 2. 方便重构和维护
 * 3. 提供更好的代码提示和类型检查
 */

/**
 * Todo 项的唯一标识符类型
 * 使用 string 类型，通常由 Date.now().toString() 或 UUID 生成
 */
export type TodoId = string;

/**
 * Todo 项的优先级枚举
 *
 * 使用 const enum 可以在编译时内联，减少运行时开销
 * - Low: 低优先级，默认值
 * - Medium: 中优先级
 * - High: 高优先级，需要优先处理
 */
export const enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

/**
 * Todo 项的完成状态
 *
 * 使用联合类型而非布尔值，便于：
 * 1. 语义更清晰
 * 2. 未来可扩展（如添加 'archived' 状态）
 */
export type TodoStatus = "pending" | "completed";

/**
 * Todo 项的完整数据结构
 *
 * 这是应用中最重要的数据类型，包含：
 * - id: 唯一标识符
 * - title: 任务标题
 * - description: 任务详细描述（可选）
 * - priority: 优先级
 * - status: 完成状态
 * - createdAt: 创建时间（ISO 字符串格式）
 * - updatedAt: 最后更新时间（ISO 字符串格式）
 */
export interface Todo {
  id: TodoId;
  title: string;
  description?: string; // 使用 ? 表示可选属性
  priority: Priority;
  status: TodoStatus;
  createdAt: string; // ISO 8601 格式的日期字符串
  updatedAt: string;
}

/**
 * 筛选条件类型
 *
 * 用户可以根据状态和优先级筛选 Todo 列表
 * - status: null 表示显示全部状态
 * - priority: null 表示显示全部优先级
 */
export interface FilterOptions {
  status: TodoStatus | null;
  priority: Priority | null;
}

/**
 * 排序方向
 */
export type SortDirection = "asc" | "desc";

/**
 * 排序字段类型
 *
 * 可以按创建时间、更新时间、优先级或标题排序
 */
export type SortField = "createdAt" | "updatedAt" | "priority" | "title";

/**
 * 排序配置
 */
export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

/**
 * 创建 Todo 时需要的字段
 *
 * 使用 Omit 工具类型排除自动生成的字段：
 * - id: 由系统生成
 * - createdAt: 创建时生成
 * - updatedAt: 创建时生成
 *
 * 这样用户只需要提供业务相关的字段
 */
export type CreateTodoInput = Omit<Todo, "id" | "createdAt" | "updatedAt">;

/**
 * 更新 Todo 时需要的字段
 *
 * 使用 Partial 工具类型使所有字段变为可选，
 * 并且必须包含 id 用于定位要更新的 Todo
 *
 * updatedAt 会在更新时自动设置，不需要用户传入
 */
export type UpdateTodoInput = Partial<Omit<Todo, "id" | "updatedAt">> & {
  id: TodoId;
};

/**
 * Todo 列表统计信息
 *
 * 用于展示概览数据，帮助用户了解任务完成情况
 */
export interface TodoStats {
  total: number; // 总任务数
  completed: number; // 已完成任务数
  pending: number; // 待完成任务数
  highPriority: number; // 高优先级任务数
  mediumPriority: number; // 中优先级任务数
  lowPriority: number; // 低优先级任务数
}

/**
 * Todo Store 的操作类型
 *
 * 使用联合类型定义所有可能的 action，便于 reducer 进行类型推断
 * 每个 action 都有明确的 payload 类型
 */
export type TodoAction =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: TodoId }
  | { type: "TOGGLE_TODO"; payload: TodoId }
  | { type: "SET_FILTER"; payload: Partial<FilterOptions> }
  | { type: "SET_SORT"; payload: SortOptions }
  | { type: "CLEAR_COMPLETED" }
  | { type: "LOAD_TODOS"; payload: Todo[] };

/**
 * Todo Store 的完整状态类型
 *
 * 包含：
 * - todos: Todo 数组
 * - filter: 当前筛选条件
 * - sort: 当前排序配置
 * - stats: 统计信息（由 todos 派生计算）
 */
export interface TodoState {
  todos: Todo[];
  filter: FilterOptions;
  sort: SortOptions;
  stats: TodoStats;
}
