/**
 * TodoStats 组件 - 展示统计信息
 *
 * 本组件展示了：
 * 1. 派生状态的使用 - 从主状态计算得出统计数据
 * 2. 条件渲染 - 根据数据显示不同 UI
 * 3. 列表渲染 - 使用 map 渲染数组
 */

import { memo } from "react";
import { useTodoState } from "@/store/TodoContext";

/**
 * 统计项配置
 *
 * 使用数组配置便于统一管理和渲染
 */
const statItems = [
  { key: "total", label: "全部", color: "text-gray-600", bg: "bg-gray-100" },
  {
    key: "pending",
    label: "待完成",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    key: "completed",
    label: "已完成",
    color: "text-green-600",
    bg: "bg-green-100",
  },
] as const;

/**
 * 优先级统计项配置
 */
const priorityItems = [
  {
    key: "highPriority",
    label: "高优先级",
    color: "text-red-600",
    bg: "bg-red-100",
  },
  {
    key: "mediumPriority",
    label: "中优先级",
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  {
    key: "lowPriority",
    label: "低优先级",
    color: "text-green-600",
    bg: "bg-green-100",
  },
] as const;

/**
 * TodoStats 组件
 *
 * 使用 memo 优化，因为统计数据只有在 todos 变化时才需要更新
 */
function TodoStatsComponent() {
  // 从 Context 获取统计数据
  // 统计数据已经在 Store 中计算好了，这里直接使用
  const { stats } = useTodoState();

  /**
   * 计算完成率
   *
   * 这是一个派生值，从统计数据计算得出
   * 使用函数计算而不是在组件状态中存储，避免状态同步问题
   */
  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* 进度条 */}
      {/* 展示如何根据数据动态计算样式 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>完成进度</span>
          <span>{completionRate}%</span>
        </div>
        {/* 进度条容器 */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* 进度条填充 - 使用内联样式动态设置宽度 */}
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* 状态统计 */}
      {/* 使用 map 渲染列表，展示 React 列表渲染的标准模式 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {statItems.map((item) => (
          <div
            key={item.key}
            className={`text-center p-3 rounded-lg ${item.bg}`}
          >
            <div className={`text-2xl font-bold ${item.color}`}>
              {stats[item.key]}
            </div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 优先级统计 */}
      <div className="grid grid-cols-3 gap-4">
        {priorityItems.map((item) => (
          <div
            key={item.key}
            className={`text-center p-3 rounded-lg ${item.bg}`}
          >
            <div className={`text-2xl font-bold ${item.color}`}>
              {stats[item.key]}
            </div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 空状态提示 */}
      {/* 条件渲染：当没有任务时显示提示 */}
      {stats.total === 0 && (
        <div className="text-center text-gray-400 py-8">
          <p className="text-lg">暂无任务</p>
          <p className="text-sm mt-1">添加一个新任务开始使用吧！</p>
        </div>
      )}
    </div>
  );
}

export const TodoStats = memo(TodoStatsComponent);
