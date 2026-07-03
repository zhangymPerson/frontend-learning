/**
 * Context API 示例页面
 *
 * 本页面展示了 React Context API 的使用：
 * 1. 创建 Context
 * 2. Provider 包裹
 * 3. useContext 消费
 * 4. 多层 Context 嵌套
 */

import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

// ============================================
// Context 创建示例
// ============================================

interface ThemeContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface User {
  id: string;
  name: string;
  role: "admin" | "user";
}

interface UserContextValue {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

// ============================================
// Provider 组件
// ============================================

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string) => {
    setUser({
      id: `user-${Date.now()}`,
      name,
      role: name.includes("admin") ? "admin" : "user",
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// ============================================
// 消费 Context 的组件
// ============================================

function ThemeToggle() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeToggle 必须在 ThemeProvider 内部使用");
  }

  const { theme, toggleTheme } = context;

  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-lg transition-colors ${
        theme === "light"
          ? "bg-gray-800 text-white"
          : "bg-yellow-400 text-gray-800"
      }`}
    >
      当前主题：{theme === "light" ? "☀️ 明亮" : "🌙 暗黑"}
      <span className="ml-2">（点击切换）</span>
    </button>
  );
}

function UserInfo() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserInfo 必须在 UserProvider 内部使用");
  }

  const { user, login, logout } = context;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {user ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">
                角色：{user.role === "admin" ? "管理员" : "普通用户"}
              </p>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100"
            >
              登出
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="输入用户名"
            className="flex-1 px-3 py-2 border rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                login(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector(
                'input[type="text"]',
              ) as HTMLInputElement;
              if (input?.value.trim()) {
                login(input.value.trim());
                input.value = "";
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            登录
          </button>
        </div>
      )}
    </div>
  );
}

function ContextConsumer() {
  const themeContext = useContext(ThemeContext);
  const userContext = useContext(UserContext);

  const theme = themeContext?.theme || "light";
  const user = userContext?.user;

  return (
    <div
      className={`rounded-lg p-4 transition-colors ${
        theme === "light"
          ? "bg-gray-100 text-gray-800"
          : "bg-gray-800 text-gray-100"
      }`}
    >
      <p className="text-sm">
        当前状态：
        <span className="ml-2 font-medium">
          {user ? `${user.name} 已登录` : "未登录"}
        </span>
        <span className="mx-2">|</span>
        <span className="font-medium">
          {theme === "light" ? "明亮模式" : "暗黑模式"}
        </span>
      </p>
    </div>
  );
}

// ============================================
// 页面组件
// ============================================

export default function ContextDemoPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">
            Context API 示例
          </h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 说明 */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="font-semibold text-blue-800 mb-2">
            什么是 Context API？
          </h2>
          <p className="text-sm text-blue-700">
            Context 提供了一种在组件树中共享数据的方式，无需通过 props
            层层传递。 适合共享的主题、用户信息、语言设置等"全局"数据。
          </p>
        </section>

        {/* Context 嵌套示例 */}
        <ThemeProvider>
          <UserProvider>
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                多层 Context 嵌套
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                下面三个组件分别消费不同的
                Context，它们之间可以独立更新，互不影响：
              </p>

              <div className="space-y-4">
                {/* 消费主题 Context */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    主题控制（ThemeContext）
                  </h3>
                  <ThemeToggle />
                </div>

                {/* 消费用户 Context */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    用户信息（UserContext）
                  </h3>
                  <UserInfo />
                </div>

                {/* 同时消费两个 Context */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    综合状态（同时消费 ThemeContext 和 UserContext）
                  </h3>
                  <ContextConsumer />
                </div>
              </div>
            </section>
          </UserProvider>
        </ThemeProvider>

        {/* 使用技巧 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Context 使用技巧
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              {
                title: "分离 Context",
                desc: "将状态和操作分成两个 Context，避免不必要的重渲染",
              },
              {
                title: "自定义 Hook",
                desc: "封装 useContext，添加错误检查和默认值处理",
              },
              {
                title: "避免过度使用",
                desc: "Context 适合全局状态，组件间通信可考虑 props 或状态提升",
              },
              {
                title: "Provider 嵌套",
                desc: "可以嵌套多个 Provider，内层可以覆盖外层的值",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-100 p-3 rounded">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
