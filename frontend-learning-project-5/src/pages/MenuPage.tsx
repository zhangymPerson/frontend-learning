/*
  【知识点 38】菜单管理页面
  - 使用 Ant Design 的 Tree 组件展示菜单层级结构
  - 使用 Modal + Form 实现新增/编辑菜单
  - 演示树形数据的操作：增删改
*/

import { useState } from "react";
import {
  Tree,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

/*
  【知识点 39】树形数据类型
  - TreeDataNode 是 Ant Design Tree 组件的数据节点类型
  - key: 唯一标识
  - title: 显示名称
  - children: 子节点数组
*/
interface MenuNode {
  key: string;
  title: string;
  path?: string;
  icon?: string;
  children?: MenuNode[];
}

function MenuPage() {
  // 表单实例，用于操作表单字段
  const [form] = Form.useForm();

  // 菜单数据状态
  const [menuData, setMenuData] = useState<MenuNode[]>([
    {
      key: "1",
      title: "系统管理",
      icon: "appstore",
      children: [
        { key: "1-1", title: "用户管理", path: "/admin/users" },
        { key: "1-2", title: "菜单管理", path: "/admin/menus" },
      ],
    },
    {
      key: "2",
      title: "内容管理",
      icon: "file",
      children: [
        { key: "2-1", title: "文章列表", path: "/admin/articles" },
        { key: "2-2", title: "分类管理", path: "/admin/categories" },
      ],
    },
  ]);

  // 弹窗显示状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 当前编辑的节点 key（为空表示新增）
  const [editingKey, setEditingKey] = useState<string>("");
  // 父节点 key（新增时用到）
  const [parentKey, setParentKey] = useState<string>("");

  /*
    【知识点 40】递归查找节点
    - 在树形结构中查找指定 key 的节点
    - 使用递归遍历所有层级
  */
  const findNode = (
    data: MenuNode[],
    key: string,
  ): { node: MenuNode; parent: MenuNode[]; index: number } | null => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].key === key) {
        return { node: data[i], parent: data, index: i };
      }
      if (data[i].children) {
        const result = findNode(data[i].children!, key);
        if (result) return result;
      }
    }
    return null;
  };

  // 打开新增弹窗
  const handleAdd = (parentKey?: string) => {
    setEditingKey("");
    setParentKey(parentKey || "");
    form.resetFields();
    setIsModalOpen(true);
  };

  // 打开编辑弹窗
  const handleEdit = (key: string) => {
    const result = findNode(menuData, key);
    if (result) {
      setEditingKey(key);
      setParentKey("");
      // 将节点数据填充到表单
      form.setFieldsValue({
        title: result.node.title,
        path: result.node.path || "",
      });
      setIsModalOpen(true);
    }
  };

  // 删除节点
  const handleDelete = (key: string) => {
    const result = findNode(menuData, key);
    if (result) {
      result.parent.splice(result.index, 1);
      // 创建新数组触发 React 重新渲染
      setMenuData([...menuData]);
      message.success("删除成功");
    }
  };

  /*
    【知识点 41】表单提交处理
    - 根据 editingKey 判断是新增还是编辑
    - 使用递归找到正确的父节点插入新数据
  */
  const handleSubmit = (values: { title: string; path: string }) => {
    if (editingKey) {
      // 编辑模式：找到节点并更新
      const result = findNode(menuData, editingKey);
      if (result) {
        result.node.title = values.title;
        result.node.path = values.path || undefined;
        setMenuData([...menuData]);
        message.success("修改成功");
      }
    } else {
      // 新增模式
      const newNode: MenuNode = {
        key: Date.now().toString(), // 使用时间戳作为唯一 key
        title: values.title,
        path: values.path || undefined,
      };

      if (parentKey) {
        // 添加到指定父节点下
        const result = findNode(menuData, parentKey);
        if (result) {
          if (!result.node.children) {
            result.node.children = [];
          }
          result.node.children.push(newNode);
        }
      } else {
        // 添加到根节点
        menuData.push(newNode);
      }
      setMenuData([...menuData]);
      message.success("新增成功");
    }
    setIsModalOpen(false);
  };

  /*
    【知识点 42】自定义树节点标题
    - titleRender 可以自定义每个节点的显示内容
    - 在节点右侧添加操作按钮
  */
  const titleRender = (nodeData: MenuNode) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <span>
        <AppstoreOutlined style={{ marginRight: 8, color: "#1890ff" }} />
        {nodeData.title}
        {nodeData.path && (
          <span style={{ color: "#999", marginLeft: 8, fontSize: 12 }}>
            ({nodeData.path})
          </span>
        )}
      </span>
      <Space>
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡，避免触发树节点展开
            handleAdd(nodeData.key);
          }}
        >
          新增
        </Button>
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(nodeData.key);
          }}
        >
          编辑
        </Button>
        <Popconfirm
          title="确定删除吗？"
          description={`删除菜单: ${nodeData.title}`}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDelete(nodeData.key);
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          >
            删除
          </Button>
        </Popconfirm>
      </Space>
    </div>
  );

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>菜单管理</h1>

      {/* 顶部操作栏 */}
      <div style={{ marginBottom: "16px" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd()}
        >
          新增根菜单
        </Button>
      </div>

      {/*
        【知识点 43】Tree 组件
        - treeData: 树形数据源
        - defaultExpandAll: 默认展开所有节点
        - titleRender: 自定义节点渲染
        - blockNode: 节点占据整行，方便操作按钮布局
      */}
      <Tree
        treeData={menuData}
        defaultExpandAll
        titleRender={titleRender}
        blockNode
        style={{
          background: "#f5f5f5",
          padding: "16px",
          borderRadius: "8px",
        }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingKey ? "编辑菜单" : "新增菜单"}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="菜单名称"
            name="title"
            rules={[{ required: true, message: "请输入菜单名称" }]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item label="路由路径" name="path">
            <Input placeholder="例如：/admin/users（可选）" />
          </Form.Item>
          {parentKey && (
            <Form.Item>
              <span style={{ color: "#999" }}>将添加到父菜单下</span>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default MenuPage;
