/**
 * 首页 - 项目介绍和导航
 *
 * 本页面展示：
 * 1. 基本的 JSX 结构
 * 2. Link 组件的使用
 * 3. 布局设计
 */

import { Link } from "react-router-dom";

/**
 * 导航卡片配置
 */
const navCards = [
  {
    to: "/todo",
    title: "Todo 应用",
    description: "完整的待办事项管理，包含增删改查、筛选排序等功能",
    icon: "📝",
  },
  {
    to: "/hooks",
    title: "Hooks 示例",
    description:
      "展示 React Hooks 的各种用法：useState、useEffect、useCallback 等",
    icon: "🎣",
  },
  {
    to: "/context",
    title: "Context 示例",
    description: "演示 React Context API 的跨组件数据传递",
    icon: "🌐",
  },
  {
    to: "/forms",
    title: "表单处理",
    description: "React 表单的受控组件、验证和提交处理",
    icon: "📋",
  },
  {
    to: "/lifecycle",
    title: "生命周期",
    description: "通过 useEffect 理解组件的生命周期",
    icon: "🔄",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部区域 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800">React 学习项目</h1>
          <p className="mt-2 text-gray-600">
            本项目展示了 React 18 的核心特性，包含组件交互、状态管理、路由等示例
          </p>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 特性说明 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">项目特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "TypeScript", value: "类型安全" },
              { label: "Vite", value: "快速构建" },
              { label: "React Router", value: "路由管理" },
              { label: "Context API", value: "状态管理" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="font-medium text-blue-600">{item.label}</div>
                <div className="text-sm text-gray-500">{item.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 导航卡片 */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">示例页面</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{card.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                </div>
                <p className="text-gray-600">{card.description}</p>
                <div className="mt-4 flex items-center text-blue-500 text-sm">
                  <span>查看示例</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          React 18 + TypeScript + Vite 学习项目
        </div>
      </footer>
    </div>
  );
}
