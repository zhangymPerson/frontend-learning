import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 【知识点 1】BrowserRouter
      - React Router 的路由容器，使用 HTML5 History API
      - 包裹整个应用，使所有子组件可以使用路由功能
    */}
    <BrowserRouter>
      {/* 【知识点 2】ConfigProvider
        - Ant Design 的全局配置组件
        - locale={zhCN} 设置中文语言包
      */}
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
