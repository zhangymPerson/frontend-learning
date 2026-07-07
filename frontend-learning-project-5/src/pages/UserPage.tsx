/*
  【知识点 33】用户管理页面
  - 使用 Ant Design 的 Table 组件展示数据
  - 使用 Tag 组件展示状态
  - 使用 Space 组件进行按钮布局
*/

import { Table, Tag, Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// 用户数据类型定义
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

function UserPage() {
  // 模拟用户数据
  const data: User[] = [
    {
      id: 1,
      name: "张三",
      email: "zhangsan@example.com",
      role: "管理员",
      status: "active",
    },
    {
      id: 2,
      name: "李四",
      email: "lisi@example.com",
      role: "编辑",
      status: "active",
    },
    {
      id: 3,
      name: "王五",
      email: "wangwu@example.com",
      role: "访客",
      status: "inactive",
    },
    {
      id: 4,
      name: "赵六",
      email: "zhaoliu@example.com",
      role: "编辑",
      status: "active",
    },
  ];

  /*
    【知识点 34】Table 列配置
    - title：列标题
    - dataIndex：对应数据字段名
    - key：React 列表渲染的唯一标识
    - render：自定义渲染函数，可以格式化显示内容
  */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      /*
        【知识点 35】render 函数
        - 接收当前单元格的值和整行数据
        - 返回自定义的 React 元素
      */
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          {/*
            【知识点 36】Popconfirm
            - 点击删除时弹出确认框
            - 防止误操作
          */}
          <Popconfirm
            title="确定删除吗？"
            description={`删除用户: ${record.name}`}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>用户管理</h1>
      <Table
        columns={columns}
        dataSource={data}
        /*
          【知识点 37】rowKey
          - 指定每行数据的唯一标识字段
          - 用于 React 的 key 属性，优化渲染性能
        */
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}

export default UserPage;
