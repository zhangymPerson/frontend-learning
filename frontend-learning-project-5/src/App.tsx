import { Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UserPage from "./pages/UserPage";
import "./App.css";

/*
  【知识点 3】React Context
  - 用于跨组件传递数据，避免层层 props 传递
  - AuthContext 存储登录状态和用户信息
*/
interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

// 创建 Context，默认值为未登录状态
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

// 自定义 Hook，方便子组件获取登录状态
export const useAuth = () => useContext(AuthContext);

function App() {
  // 使用 useState 管理登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    /*
      【知识点 4】Context.Provider
      - 将状态和方法提供给所有子组件
      - value 中的数据可以被 useContext 获取
    */
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {/*
        【知识点 5】Routes 和 Route
        - Routes：路由匹配容器，只渲染第一个匹配的 Route
        - Route：定义路径和对应组件的映射关系
      */}
      <Routes>
        {/* 首页大屏 */}
        <Route path="/" element={<LandingPage />} />

        {/* 登录页 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 管理端页面 - 需要登录才能访问 */}
        <Route
          path="/admin"
          element={
            /*
              【知识点 6】条件渲染
              - 根据 isLoggedIn 状态决定渲染内容
              - 未登录时重定向到登录页
            */
            isLoggedIn ? <AdminLayout /> : <Navigate to="/login" replace />
          }
        >
          {/* 默认子路由：数据概览 */}
          <Route index element={<DashboardPage />} />
          {/* 用户管理子路由 */}
          <Route path="users" element={<UserPage />} />
        </Route>

        {/* 404 页面 - 匹配所有未定义的路径 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
