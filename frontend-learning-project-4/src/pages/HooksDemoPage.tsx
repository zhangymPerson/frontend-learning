/**
 * React Hooks 示例页面
 *
 * 本页面展示了 React 最常用的几个 Hooks：
 * 1. useState - 状态管理
 * 2. useEffect - 副作用处理
 * 3. useCallback - 函数缓存
 * 4. useMemo - 值缓存
 * 5. useRef - 引用保持
 * 6. useReducer - 复杂状态管理
 */

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useReducer,
  type Reducer,
} from "react";
import { Link } from "react-router-dom";

// ============================================
// useReducer 示例
// ============================================

interface CounterState {
  count: number;
  history: number[];
}

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "set"; payload: number };

const counterReducer: Reducer<CounterState, CounterAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    case "decrement":
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1],
      };
    case "reset":
      return { count: 0, history: [] };
    case "set":
      return {
        count: action.payload,
        history: [...state.history, action.payload],
      };
    default:
      return state;
  }
};

// ============================================
// 主组件
// ============================================

export default function HooksDemoPage() {
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem("hooks-demo-text") || "";
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const renderCountRef = useRef<number>(0);
  renderCountRef.current += 1;

  useEffect(() => {
    console.log("组件已挂载");
    return () => {
      console.log("组件将卸载");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("hooks-demo-text", text);
  }, [text]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setText("");
    inputRef.current?.focus();
  }, []);

  const textStats = useMemo(() => {
    return {
      length: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split("\n").length,
    };
  }, [text]);

  const [counterState, counterDispatch] = useReducer(counterReducer, {
    count: 0,
    history: [],
  });

  const avgCount = useMemo(() => {
    if (counterState.history.length === 0) return 0;
    const sum = counterState.history.reduce((a, b) => a + b, 0);
    return (sum / counterState.history.length).toFixed(2);
  }, [counterState.history]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Hooks 示例</h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* 渲染计数 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          组件渲染次数：{renderCountRef.current}（使用 useRef 跟踪）
        </div>

        {/* useState + useRef 示例 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            useState + useRef 示例
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={text}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="输入文本，会自动保存到 localStorage"
              />
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                清空
              </button>
              <button
                onClick={() => inputRef.current?.focus()}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                聚焦
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-2xl font-bold text-gray-800">
                  {textStats.length}
                </div>
                <div className="text-sm text-gray-500">字符数</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-2xl font-bold text-gray-800">
                  {textStats.words}
                </div>
                <div className="text-sm text-gray-500">单词数</div>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <div className="text-2xl font-bold text-gray-800">
                  {textStats.lines}
                </div>
                <div className="text-sm text-gray-500">行数</div>
              </div>
            </div>
          </div>
        </section>

        {/* useReducer 示例 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            useReducer 示例
          </h2>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 mb-4">
                {counterState.count}
              </div>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => counterDispatch({ type: "decrement" })}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg"
                >
                  - 1
                </button>
                <button
                  onClick={() => counterDispatch({ type: "reset" })}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-lg"
                >
                  重置
                </button>
                <button
                  onClick={() => counterDispatch({ type: "increment" })}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg"
                >
                  + 1
                </button>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>历史记录长度：{counterState.history.length}</span>
                <span>平均值：{avgCount}</span>
              </div>
              <div className="h-24 overflow-y-auto bg-gray-100 p-2 rounded text-sm text-gray-600">
                {counterState.history.length > 0
                  ? counterState.history.join(" → ")
                  : "暂无历史记录"}
              </div>
            </div>
          </div>
        </section>

        {/* Hooks 说明 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Hooks 使用说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              {
                name: "useState",
                desc: "管理组件内部状态，返回状态值和更新函数",
              },
              {
                name: "useEffect",
                desc: "处理副作用，如数据获取、订阅、DOM 操作",
              },
              { name: "useCallback", desc: "缓存函数，避免不必要的重渲染" },
              { name: "useMemo", desc: "缓存计算值，避免重复计算" },
              {
                name: "useRef",
                desc: "创建可变引用，常用于访问 DOM 或存储不触发渲染的值",
              },
              {
                name: "useReducer",
                desc: "复杂状态管理，类似 Redux 的 reducer 模式",
              },
            ].map((item) => (
              <div key={item.name} className="bg-gray-100 p-3 rounded">
                <span className="font-mono text-blue-600">{item.name}</span>
                <p className="text-gray-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
