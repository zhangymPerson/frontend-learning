/*
  【知识点 30】数据概览页面
  - 使用 Ant Design 的 Statistic、Card、Row、Col 组件
  - 展示简单的数据统计卡片
  - 使用 useState 和 useEffect 模拟数据加载
*/

import { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Spin } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";

function DashboardPage() {
  // 加载状态
  const [loading, setLoading] = useState(true);

  /*
    【知识点 31】useEffect
    - 在组件挂载时执行副作用操作
    - 这里模拟数据加载，1秒后显示内容
    - 空依赖数组 [] 表示只在挂载时执行一次
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // 清理函数：组件卸载时清除定时器
    return () => clearTimeout(timer);
  }, []);

  // 统计数据配置
  const statistics = [
    {
      title: "总用户数",
      value: 1234,
      icon: <UserOutlined />,
      color: "#1890ff",
    },
    {
      title: "文章总数",
      value: 856,
      icon: <FileTextOutlined />,
      color: "#52c41a",
    },
    { title: "访问量", value: 15234, icon: <EyeOutlined />, color: "#faad14" },
    {
      title: "消息数",
      value: 328,
      icon: <MessageOutlined />,
      color: "#eb2f96",
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>数据概览</h1>
      {/*
        【知识点 32】Row 和 Col 栅格布局
        - Row 表示一行
        - Col 表示列，span 表示占据的列数（总24列）
        - gutter 设置列之间的间距
      */}
      <Row gutter={[16, 16]}>
        {statistics.map((item, index) => (
          <Col span={6} key={index}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={
                  <span style={{ color: item.color, marginRight: "8px" }}>
                    {item.icon}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 欢迎信息 */}
      <Card style={{ marginTop: "24px" }}>
        <h3>欢迎使用管理系统</h3>
        <p>这是一个简单的后台管理页面示例，展示了：</p>
        <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>数据统计卡片展示</li>
          <li>React 状态管理（useState）</li>
          <li>副作用处理（useEffect）</li>
          <li>条件渲染（加载状态）</li>
        </ul>
      </Card>
    </div>
  );
}

export default DashboardPage;
