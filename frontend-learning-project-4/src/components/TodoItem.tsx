/**
 * TodoItem 组件 - 展示单个 Todo 项
 *
 * 本组件展示了 React 中常见的组件交互模式：
 * 1. Props 传递 - 从父组件接收数据
 * 2. 事件处理 - 用户交互的响应
 * 3. 条件渲染 - 根据状态展示不同 UI
 * 4. 样式控制 - 动态 class 名称
 */

import { useState, useCallback, memo } from "react";
import type { Todo, Priority } from "@/types";
import { useTodoActions } from "@/store/TodoContext";

/**
 * 组件 Props 类型定义
 *
 * 明确定义组件接受的属性，是 TypeScript + React 的最佳实践
 * 这提供了：
 * - 编辑器自动补全
 * - 类型检查
 * - 自文档化
 */
interface TodoItemProps {
  todo: Todo; // 要展示的 Todo 数据
}

/**
 * 优先级对应的颜色和标签映射
 *
 * 使用常量对象统一管理，便于维护和修改
 */
const priorityConfig: Record<Priority, { color: string; label: string }> = {
  high: {
    color: "bg-red-500",
    label: "高",
  },
  medium: {
    color: "bg-yellow-500",
    label: "中",
  },
  low: {
    color: "bg-green-500",
    label: "低",
  },
};

/**
 * TodoItem 组件实现
 *
 * 使用 memo 高阶组件包裹，避免不必要的重渲染
 * 只有当 props.todo 发生变化时才重新渲染
 */
function TodoItemComponent({ todo }: TodoItemProps) {
  // 本地状态：控制编辑模式和输入值
  // useState 返回 [当前状态, 设置状态的函数]
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  // 从 Context 获取操作函数
  // 这个 Hook 只返回操作函数，不会导致组件在 todos 变化时重渲染
  const { toggleTodo, deleteTodo, updateTodo } = useTodoActions();

  /**
   * 切换完成状态
   *
   * 使用 useCallback 缓存函数，避免每次渲染都创建新函数
   * 这对于传递给子组件的回调函数特别重要
   */
  const handleToggle = useCallback(() => {
    toggleTodo(todo.id);
  }, [toggleTodo, todo.id]);

  /**
   * 删除 Todo
   */
  const handleDelete = useCallback(() => {
    deleteTodo(todo.id);
  }, [deleteTodo, todo.id]);

  /**
   * 开始编辑模式
   */
  const handleStartEdit = useCallback(() => {
    setEditTitle(todo.title); // 重置编辑值为当前标题
    setIsEditing(true);
  }, [todo.title]);

  /**
   * 取消编辑
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditTitle(todo.title);
  }, [todo.title]);

  /**
   * 保存编辑
   */
  const handleSaveEdit = useCallback(() => {
    const trimmedTitle = editTitle.trim();

    // 空标题不保存
    if (!trimmedTitle) {
      handleCancelEdit();
      return;
    }

    // 只有标题真正变化了才更新
    if (trimmedTitle !== todo.title) {
      updateTodo({
        id: todo.id,
        title: trimmedTitle,
      });
    }

    setIsEditing(false);
  }, [editTitle, todo.id, todo.title, updateTodo, handleCancelEdit]);

  /**
   * 输入框按键事件处理
   *
   * 演示如何处理键盘事件
   * - Enter: 保存
   * - Escape: 取消
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSaveEdit();
      } else if (e.key === "Escape") {
        handleCancelEdit();
      }
    },
    [handleSaveEdit, handleCancelEdit],
  );

  /**
   * 输入框变化处理
   *
   * 演示如何从事件对象中提取值
   * e.target 是触发事件的元素，这里是 input
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditTitle(e.target.value);
    },
    [],
  );

  // 渲染优先级标签配置
  const priority = priorityConfig[todo.priority];

  return (
    <div
      className={`
        group flex items-center gap-4 p-4 rounded-lg border transition-all
        ${todo.status === "completed" ? "bg-gray-50 border-gray-200" : "bg-white border-gray-300 hover:border-blue-400 hover:shadow-sm"}
      `}
    >
      {/* 完成状态复选框 */}
      {/* 使用自定义样式的 checkbox */}
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={todo.status === "completed"}
          onChange={handleToggle}
          className="sr-only" // 隐藏原生 checkbox，使用自定义样式
        />
        <div
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
            ${todo.status === "completed" ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-blue-400"}
          `}
        >
          {todo.status === "completed" && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </label>

      {/* Todo 内容区域 */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          // 编辑模式：显示输入框
          <input
            type="text"
            value={editTitle}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            autoFocus // 自动聚焦
            className="w-full px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          // 查看模式：显示标题和描述
          <>
            <h3
              className={`
                font-medium truncate
                ${todo.status === "completed" ? "text-gray-400 line-through" : "text-gray-800"}
              `}
            >
              {todo.title}
            </h3>
            {/* 条件渲染：只有存在描述时才显示 */}
            {todo.description && (
              <p className="text-sm text-gray-500 truncate mt-1">
                {todo.description}
              </p>
            )}
          </>
        )}
      </div>

      {/* 优先级标签 */}
      {/* 使用模板字符串拼接 className */}
      <span
        className={`
          px-2 py-1 text-xs text-white rounded-full font-medium
          ${priority.color}
        `}
      >
        {priority.label}
      </span>

      {/* 操作按钮组 */}
      {/* 使用 group-hover 在鼠标悬停整个项时显示 */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
            >
              保存
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
          </>
        ) : (
          <>
            {/* 编辑按钮 */}
            <button
              onClick={handleStartEdit}
              className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
            >
              编辑
            </button>
            {/* 删除按钮 */}
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
            >
              删除
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 使用 memo 包裹组件导出
 *
 * memo 是 React 的性能优化工具：
 * - 对 props 进行浅比较
 * - 只有 props 变化时才重渲染
 * - 对于频繁更新的列表项特别有效
 */
export const TodoItem = memo(TodoItemComponent);
