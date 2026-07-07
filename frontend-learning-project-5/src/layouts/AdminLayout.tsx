/*
  【知识点 24】管理端布局
  - 使用 Ant Design 的 Layout 组件构建经典后台布局
  - 包含侧边栏菜单、顶部栏、内容区域
  - 使用 Outlet 渲染子路由内容
*/

import { Layout, Menu, Button, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import "./AdminLayout.css";

// 从 Layout 中解构出子组件
const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const navigate = useNavigate();
  /*
    【知识点 25】useLocation
    - 获取当前 URL 信息
    - pathname 用于高亮当前菜单项
  */
  const location = useLocation();
  const { logout } = useAuth();

  /*
    【知识点 26】theme.useToken
    - Ant Design v5 的主题系统
    - 获取当前主题的颜色变量
  */
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 菜单项配置
  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "数据概览",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "用户管理",
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout className="admin-layout">
      {/* 侧边栏 */}
      <Sider theme="light" width={200} className="admin-sider">
        <div className="logo">管理系统</div>
        {/*
          【知识点 27】Menu 菜单组件
          - selectedKeys：当前高亮的菜单项
          - items：菜单数据数组
          - onClick：点击菜单项的回调
        */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        {/* 顶部栏 */}
        <Header
          style={{ background: colorBgContainer }}
          className="admin-header"
        >
          <h2>后台管理中心</h2>
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            退出登录
          </Button>
        </Header>

        {/* 内容区域 */}
        <Content className="admin-content">
          {/*
            【知识点 28】Outlet
            - React Router 的占位组件
            - 渲染匹配当前路径的子路由组件
          */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
