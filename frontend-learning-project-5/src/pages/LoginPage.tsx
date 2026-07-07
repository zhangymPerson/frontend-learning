/*
  【知识点 17】登录页面
  - 使用 Ant Design 的 Form、Input、Button、Card 组件
  - 表单验证：用户名和密码必填
  - 登录成功后跳转到管理端
*/

import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  /*
    【知识点 18】useAuth Hook
    - 从 App.tsx 的 AuthContext 中获取登录方法
    - 避免直接操作 Context，使用封装好的 Hook
  */
  const { login } = useAuth();

  /*
    【知识点 19】onFinish 表单提交
    - Ant Design Form 组件的提交回调
    - values 包含表单中所有字段的值
  */
  const onFinish = (values: { username: string; password: string }) => {
    // 模拟登录验证
    if (values.username === "admin" && values.password === "123456") {
      login(); // 调用 Context 中的登录方法
      message.success("登录成功！");
      navigate("/admin"); // 跳转到管理端首页
    } else {
      message.error("用户名或密码错误");
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" title="系统登录">
        {/*
          【知识点 20】Ant Design Form
          - onFinish：表单提交时的回调函数
          - autoComplete="off"：关闭浏览器自动填充
        */}
        <Form name="login" onFinish={onFinish} autoComplete="off">
          {/*
            【知识点 21】Form.Item 表单字段
            - name：字段名称，提交时作为 key
            - rules：验证规则数组
            - required: true 表示必填
            - message 是验证失败时的提示信息
          */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            {/*
              【知识点 22】Input 输入框
              - prefix：输入框前缀图标
              - placeholder：占位提示文字
            */}
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名: admin"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码: 123456"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="login-tips">
          <p>默认账号: admin / 123456</p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
