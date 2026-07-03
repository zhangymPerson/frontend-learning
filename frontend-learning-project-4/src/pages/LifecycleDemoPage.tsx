/**
 * React 组件生命周期示例页面
 *
 * 本页面通过 useEffect 展示 React 函数组件的"生命周期"概念：
 * 1. 挂载（Mount）- 组件首次渲染
 * 2. 更新（Update）- 组件重渲染
 * 3. 卸载（Unmount）- 组件从 DOM 移除
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ============================================
// 子组件 - 展示完整的生命周期日志
// ============================================

interface LifecycleChildProps {
  name: string;
  count: number;
}

function LifecycleChild({ name, count }: LifecycleChildProps) {
  const mountTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    console.log(`[${name}] 🌟 挂载阶段`);
    console.log(`[${name}] 挂载时间:`, new Date().toLocaleTimeString());

    const timerId = setInterval(() => {}, 1000);

    return () => {
      console.log(`[${name}] 🔴 卸载阶段`);
      console.log(
        `[${name}] 存活时间: ${((Date.now() - mountTimeRef.current) / 1000).toFixed(1)}秒`,
      );
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    console.log(`[${name}] 🔄 更新阶段 - count 变化为: ${count}`);
  }, [count]);

  useEffect(() => {
    console.log(`[${name}] ⚡ 渲染完成 - 当前 count: ${count}`);
  });

  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600">计数: {count}</p>
      <p className="text-xs text-gray-400 mt-2">
        挂载时间: {new Date(mountTimeRef.current).toLocaleTimeString()}
      </p>
    </div>
  );
}

// ============================================
// 数据获取示例组件
// ============================================

function DataFetcher() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (!cancelled) {
          setData(`获取到的数据 - ${new Date().toLocaleTimeString()}`);
        }
      } catch (err) {
        if (!cancelled) {
          setError("数据获取失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      console.log("[DataFetcher] 🧹 清理：取消数据获取");
    };
  }, []);

  return (
    <div className="bg-white border-2 border-green-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-2">数据获取示例</h3>
      {loading && <p className="text-blue-500">⏳ 加载中...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}
      {data && <p className="text-green-600">✅ {data}</p>}
    </div>
  );
}

// ============================================
// 主页面组件
// ============================================

export default function LifecycleDemoPage() {
  const [showChild, setShowChild] = useState(true);
  const [parentCount, setParentCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">生命周期示例</h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 说明 */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">
            💡 打开浏览器控制台查看生命周期日志
          </h2>
          <p className="text-sm text-yellow-700">
            useEffect 是 React
            函数组件处理"生命周期"的方式。通过不同的依赖数组配置，可以控制
            effect 的执行时机。
          </p>
        </section>

        {/* 控制面板 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">控制面板</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowChild((prev) => !prev)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showChild
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {showChild ? "卸载子组件" : "挂载子组件"}
            </button>
            <button
              onClick={() => setParentCount((prev) => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              更新计数（触发子组件更新）
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
              当前计数: {parentCount}
            </span>
          </div>
        </section>

        {/* 子组件区域 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            生命周期演示
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showChild && <LifecycleChild name="组件 A" count={parentCount} />}
            {showChild && <LifecycleChild name="组件 B" count={parentCount} />}
          </div>
        </section>

        {/* 数据获取示例 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            数据获取模式
          </h2>
          <DataFetcher />
          <p className="text-sm text-gray-500 mt-2">
            挂载后自动获取数据。如果快速离开页面，可以看到清理函数的日志。
          </p>
        </section>

        {/* 生命周期说明 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            useEffect 依赖数组说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              {
                title: "空数组 []",
                effect: "挂载时执行",
                cleanup: "卸载时执行",
                icon: "🌟",
              },
              {
                title: "有依赖 [a, b]",
                effect: "a 或 b 变化后执行",
                cleanup: "下次 effect 前执行",
                icon: "🔄",
              },
              {
                title: "无依赖数组",
                effect: "每次渲染后执行",
                cleanup: "下次渲染前执行",
                icon: "⚡",
              },
            ].map((item) => (
              <div key={item.title} className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-mono text-blue-600">{item.title}</div>
                <p className="text-gray-600 mt-1">{item.effect}</p>
                <p className="text-gray-500">{item.cleanup}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
