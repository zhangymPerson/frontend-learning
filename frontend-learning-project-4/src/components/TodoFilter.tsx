/**
 * TodoFilter 组件 - 筛选和排序控制
 *
 * 本组件展示了：
 * 1. 多个筛选条件的组合使用
 * 2. 排序方向切换
 * 3. 组件间通信 - 通过 Context 共享状态
 * 4. Props.children 的使用
 */

import { memo, useCallback } from "react";
import type { SortField, Priority } from "@/types";
import { useTodoState, useTodoActions } from "@/store/TodoContext";

/**
 * 组件 Props
 */
interface TodoFilterProps {
  // 可以在这里添加额外的 props
}

/**
 * 排序字段配置
 *
 * 定义可选的排序字段及其显示名称
 */
const sortFields: { value: SortField; label: string }[] = [
  { value: "createdAt", label: "创建时间" },
  { value: "updatedAt", label: "更新时间" },
  { value: "priority", label: "优先级" },
  { value: "title", label: "标题" },
];

/**
 * 优先级筛选选项
 */
const priorityOptions: { value: Priority | ""; label: string }[] = [
  { value: "", label: "全部优先级" },
  { value: "high" as Priority, label: "高优先级" },
  { value: "medium" as Priority, label: "中优先级" },
  { value: "low" as Priority, label: "低优先级" },
];

/**
 * 状态筛选选项
 */
const statusOptions: { value: "" | "pending" | "completed"; label: string }[] =
  [
    { value: "", label: "全部状态" },
    { value: "pending", label: "待完成" },
    { value: "completed", label: "已完成" },
  ];

/**
 * TodoFilter 组件
 */
function TodoFilterComponent({}: TodoFilterProps) {
  // 从 Context 获取状态和操作
  const { filter, sort } = useTodoState();
  const { setFilter, setSort, clearCompleted } = useTodoActions();

  /**
   * 处理状态筛选变化
   *
   * 将空字符串转换为 null（表示不筛选）
   */
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilter({
        status: value === "" ? null : (value as "pending" | "completed"),
      });
    },
    [setFilter],
  );

  /**
   * 处理优先级筛选变化
   */
  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setFilter({
        priority: value === "" ? null : (value as Priority),
      });
    },
    [setFilter],
  );

  /**
   * 处理排序字段变化
   */
  const handleSortFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSort({
        ...sort,
        field: e.target.value as SortField,
      });
    },
    [sort, setSort],
  );

  /**
   * 切换排序方向
   *
   * 点击按钮在升序和降序之间切换
   */
  const handleToggleSortDirection = useCallback(() => {
    setSort({
      ...sort,
      direction: sort.direction === "asc" ? "desc" : "asc",
    });
  }, [sort, setSort]);

  /**
   * 清除已完成任务
   */
  const handleClearCompleted = useCallback(() => {
    if (window.confirm("确定要清除所有已完成的任务吗？")) {
      clearCompleted();
    }
  }, [clearCompleted]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* 状态筛选 */}
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600">
            状态：
          </label>
          <select
            id="status-filter"
            value={filter.status || ""}
            onChange={handleStatusChange}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 优先级筛选 */}
        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm text-gray-600">
            优先级：
          </label>
          <select
            id="priority-filter"
            value={filter.priority || ""}
            onChange={handlePriorityChange}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 排序控制 */}
        <div className="flex items-center gap-2 ml-auto">
          <label htmlFor="sort-field" className="text-sm text-gray-600">
            排序：
          </label>
          <select
            id="sort-field"
            value={sort.field}
            onChange={handleSortFieldChange}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            {sortFields.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>

          {/* 排序方向切换按钮 */}
          <button
            onClick={handleToggleSortDirection}
            className={`
              px-3 py-1.5 border rounded-lg text-sm transition-colors
              ${sort.direction === "desc" ? "bg-blue-50 border-blue-300 text-blue-600" : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"}
            `}
            title={sort.direction === "asc" ? "升序" : "降序"}
          >
            {sort.direction === "asc" ? "↑ 升序" : "↓ 降序"}
          </button>
        </div>

        {/* 清除已完成按钮 */}
        <button
          onClick={handleClearCompleted}
          className="px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          清除已完成
        </button>
      </div>
    </div>
  );
}

export const TodoFilter = memo(TodoFilterComponent);
