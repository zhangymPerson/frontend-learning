/**
 * TodoForm 组件 - 创建新 Todo 的表单
 *
 * 本组件展示了 React 表单处理的多种方式：
 * 1. 受控组件 - React 完全控制表单状态
 * 2. 表单验证 - 基本的数据校验
 * 3. 提交处理 - 表单数据的收集和提交
 * 4. 重置表单 - 提交后的状态清理
 */

import { useState, useCallback } from "react";
import type { Priority } from "@/types";
import { useTodoActions } from "@/store/TodoContext";

/**
 * 表单数据的类型定义
 *
 * 与 Todo 类型不同，表单数据：
 * - 所有字段都是可选的（表单可能部分填写）
 * - 可能包含验证错误信息
 */
interface FormData {
  title: string;
  description: string;
  priority: Priority;
}

/**
 * 表单验证错误的类型
 *
 * 使用 Partial 工具类型，因为可能只有部分字段有错误
 */
type FormErrors = Partial<Record<keyof FormData, string>>;

/**
 * TodoForm 组件
 */
export function TodoForm() {
  // 表单状态：使用 useState 管理表单各字段的值
  // 这是一个"受控组件" - React 是表单状态的唯一数据源
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    priority: "medium" as Priority, // 默认中优先级
  });

  // 验证错误状态
  const [errors, setErrors] = useState<FormErrors>({});

  // 提交状态（用于显示加载指示器）
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 从 Context 获取添加 Todo 的函数
  const { addTodo } = useTodoActions();

  /**
   * 验证表单数据
   *
   * 返回验证是否通过，并通过 ref 参数返回错误信息
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // 标题验证：必填，且长度限制
    if (!formData.title.trim()) {
      newErrors.title = "标题不能为空";
    } else if (formData.title.length > 100) {
      newErrors.title = "标题长度不能超过100个字符";
    }

    // 描述验证：可选，但有长度限制
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "描述长度不能超过500个字符";
    }

    setErrors(newErrors);

    // 没有错误时返回 true
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * 处理输入框变化
   *
   * 使用通用的事件处理器，减少重复代码
   *
   * @param e - 事件对象
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      // 使用函数式更新，确保基于最新状态
      // 展开运算符保留其他字段的值，只更新变化的字段
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // 清除该字段的错误提示
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    },
    [errors],
  );

  /**
   * 处理优先级选择变化
   *
   * select 元素的 change 事件处理
   */
  const handlePriorityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        priority: e.target.value as Priority, // 类型断言确保类型安全
      }));
    },
    [],
  );

  /**
   * 处理表单提交
   *
   * 演示 React 中表单提交的标准模式
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      // 阻止默认的表单提交行为（页面刷新）
      e.preventDefault();

      // 验证表单
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // 模拟网络延迟，展示加载状态
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 调用添加 Todo 的操作
        addTodo({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined, // 空字符串转为 undefined
          priority: formData.priority as Priority,
          status: "pending", // 新建 Todo 默认为待完成状态
        });

        // 重置表单
        setFormData({
          title: "",
          description: "",
          priority: "medium" as Priority,
        });
        setErrors({});
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, addTodo],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">添加新任务</h2>

      {/* 标题输入框 */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="输入任务标题..."
          className={`
            w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2
            ${errors.title ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"}
          `}
          disabled={isSubmitting}
        />
        {/* 条件渲染错误信息 */}
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* 描述文本框 */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          描述
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="添加任务描述（可选）..."
          rows={3}
          className={`
            w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 resize-none
            ${errors.description ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"}
          `}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
        {/* 字符计数器 - 展示派生状态 */}
        <p className="mt-1 text-sm text-gray-400 text-right">
          {formData.description.length}/500
        </p>
      </div>

      {/* 优先级选择 */}
      <div className="mb-4">
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          优先级
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handlePriorityChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          disabled={isSubmitting}
        >
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-2 px-4 rounded-lg font-medium transition-colors
          ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}
        `}
      >
        {isSubmitting ? "添加中..." : "添加任务"}
      </button>
    </form>
  );
}
