/*
  【知识点 10】首页大屏页面
  - 使用 Ant Design 的 Button 组件
  - 使用网络图片作为背景展示
  - 使用 react-router-dom 的 useNavigate 进行页面跳转
*/

import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  /*
    【知识点 11】useNavigate
    - React Router 提供的 Hook，用于编程式导航
    - 替代传统的 <a> 标签或 window.location
  */
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* 背景图片区域 */}
      <div className="hero-section">
        {/*
          【知识点 12】网络图片使用
          - 使用 Unsplash 提供的免费图片 API
          - 图片地址可以直接在浏览器中打开查看
        */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="办公环境"
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">企业管理系统</h1>
            <p className="hero-subtitle">
              高效、简洁、现代化的后台管理解决方案
            </p>
            {/*
              【知识点 13】Ant Design Button
              - type="primary"：主按钮样式（蓝色背景）
              - size="large"：大号按钮
              - icon：按钮右侧的图标
              - onClick：点击事件处理
            */}
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/login")}
              className="enter-btn"
            >
              进入系统
            </Button>
          </div>
        </div>
      </div>

      {/* 功能特点区域 */}
      <div className="features-section">
        <h2>核心功能</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>数据可视化</h3>
            <p>清晰的数据展示面板，实时掌握业务动态</p>
          </div>
          <div className="feature-card">
            <h3>用户管理</h3>
            <p>完善的用户权限管理，保障系统安全</p>
          </div>
          <div className="feature-card">
            <h3>操作便捷</h3>
            <p>简洁的交互设计，提升工作效率</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
