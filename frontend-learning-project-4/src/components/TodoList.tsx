/**
 * TodoList 组件 - Todo 列表容器
 *
 * 本组件展示了：
 * 1. 列表渲染和 key 的使用
 * 2. 空状态处理
 * 3. 条件渲染
 */

import { memo } from "react";
import { TodoItem } from "./TodoItem";
import { useTodoState } from "@/store/TodoContext";

/**
 * TodoList 组件
 *
 * 负责渲染 Todo 列表，不处理具体的交互逻辑
 * 单一职责：列表的展示
 */
function TodoListComponent() {
  // 从 Context 获取筛选和排序后的 Todo 列表
  // 注意：这里的 todos 已经是经过处理的数据
  const { todos, filter } = useTodoState();

  // 空状态：没有任何 Todo
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="text-gray-400 mb-2">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">
          {filter.status || filter.priority
            ? "没有符合筛选条件的任务"
            : "暂无任务，添加一个新任务吧！"}
        </p>
      </div>
    );
  }

  // 渲染 Todo 列表
  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        /**
         * 列表渲染的 key 属性非常重要：
         * - 帮助 React 识别哪些元素发生了变化
         * - 应该使用稳定的唯一标识符（如 id）
         * - 不要使用数组索引（除非列表是静态的）
         */
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

export const TodoList = memo(TodoListComponent);
