# 前端学习项目2 🎓 — TypeScript 版本

项目1 的 TypeScript 重写版本。**功能完全相同**，但所有 JavaScript 逻辑都用 TypeScript 编写。

> TypeScript = JavaScript + 类型系统。同样的功能，更强的代码可靠性。

---

## 📁 项目结构

```
前端学习项目2/
├── tsconfig.json       ← TypeScript 编译配置（带详细注释）
├── index.html          ← 首页
├── css/
│   └── style.css       ← 样式（和项目1相同）
├── ts/                 ← ⭐ TypeScript 源码（你应该编辑这些文件）
│   ├── types.ts        ← 类型定义（interface、type、enum）
│   └── main.ts         ← 主逻辑（带 32 个知识点注释）
├── js/                 ← 编译输出（tsc 自动生成，不要直接编辑！）
│   └── main.js         ← 浏览器实际运行的 JavaScript
├── pages/
│   ├── about.html      ← 关于页面（TS 学习指南）
│   └── contact.html    ← 联系页面（表单 + TS 对比）
└── README.md           ← 你正在看的文件
```

---

## ⚙️ 前置条件：安装 TypeScript

在使用本项目之前，你需要先安装 TypeScript 编译器。

### 1. 安装 Node.js

访问 [nodejs.org](https://nodejs.org/) 下载并安装（LTS 版本即可）。

安装完成后验证：
```bash
node --version   # 应该显示 v16 或更高
npm --version    # 应该显示 8 或更高
```

### 2. 安装 TypeScript

```bash
# 全局安装（推荐，一次安装，到处可用）
npm install -g typescript

# 验证安装
tsc --version    # 应该显示 Version 5.x.x
```

---

## 🚀 启动步骤

### 第一步：编译 TypeScript

```bash
# 进入项目目录
cd 前端学习项目2

# 编译 .ts → .js（读取 tsconfig.json 自动找到源文件和输出目录）
tsc
```

编译成功后，你会看到 `js/main.js` 和 `js/main.js.map` 文件被生成。

### 第二步：打开页面

#### 方式一：直接双击 `index.html`

最简单，不需要任何服务器。

#### 方式二：用 VS Code + Live Server（推荐）

1. 用 VS Code 打开项目文件夹
2. 安装扩展：**Live Server** + **TypeScript**（VS Code 自带 TS 支持）
3. 右键 `index.html` → **Open with Live Server**

#### 方式三：用 Python 本地服务器

```bash
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080
```

---

## 🔄 开发工作流

当你修改了 TypeScript 代码后，需要重新编译：

```bash
# 方法一：每次修改后手动编译
tsc

# 方法二：自动监视模式（推荐！修改后自动编译）
tsc --watch

# 方法三：在 VS Code 中
# 按 Ctrl+Shift+B → 选择 "tsc: watch - tsconfig.json"
```

---

## 📚 如何学习这个项目

### 前提

建议先完成项目1（JavaScript 版），再来看项目2。

### 学习顺序

1. **先看项目1的 js/main.js** — 理解 JavaScript 的写法
2. **再看项目2的 ts/main.ts** — 理解 TypeScript 如何增强它
3. **对比差异** — 重点关注类型标注、空值检查、接口定义

### 重点文件

| 文件 | 内容 | 注释数 |
|------|------|--------|
| `ts/types.ts` | 类型定义 | 7 个知识点 |
| `ts/main.ts` | 主逻辑 | 32 个知识点 |
| `tsconfig.json` | 编译配置 | 13 个知识点 |

### 练习建议

#### 练习 1：故意写错类型
```typescript
// 在 ts/main.ts 中试试：
const count: number = "hello";  // 编译器会报错！
```
然后运行 `tsc` 看看错误信息。

#### 练习 2：修改接口
```typescript
// 在 ts/types.ts 中给 ContactFormData 加一个新字段：
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone: string;  // 新增
}
```
然后运行 `tsc`，看看哪些地方报错了（因为使用方没有传 phone）。

#### 练习 3：尝试类型推断
```typescript
// 去掉类型标注，看看 TS 能否自动推断：
const x = 42;           // TS 知道是 number
const y = "hello";      // TS 知道是 string
const z = x + y;        // 报错！number + string 在 TS 中需要显式处理
```

---

## 🎯 涵盖的 TypeScript 知识点

### 类型基础
- [x] 基本类型标注（string、number、boolean）
- [x] 数组类型（string[]、Array\<string\>）
- [x] 联合类型（A | B）
- [x] 字面量类型（"success" | "error"）
- [x] void 和 null/undefined
- [x] 类型推断

### 接口与类型
- [x] interface 定义对象形状
- [x] type 类型别名
- [x] interface vs type 的区别
- [x] 可选属性（?:）

### 高级特性
- [x] 类型断言（as）
- [x] 类型收窄（Type Narrowing）
- [x] 枚举（enum）
- [x] import type（只导入类型）
- [x] 解构赋值的类型

### DOM 类型
- [x] HTMLElement | null 联合类型
- [x] HTMLInputElement、HTMLFormElement
- [x] CSSStyleDeclaration
- [x] DOMTokenList（classList）

### 工程配置
- [x] tsconfig.json 配置
- [x] target、outDir、rootDir
- [x] strict 模式
- [x] sourceMap

---

## ❓ 常见问题

**Q: 编译报错 "Cannot find module"？**
A: 确保你在项目根目录运行 `tsc`，并且 `tsconfig.json` 存在。

**Q: 修改了 .ts 文件但页面没变化？**
A: 需要重新运行 `tsc` 编译！或者用 `tsc --watch` 自动编译。

**Q: 浏览器打开后 JS 不工作？**
A: 检查 F12 控制台的错误信息。常见原因：
- 没有编译（`js/main.js` 不存在或内容为空）
- 文件路径不对

**Q: VS Code 报一堆红线但 tsc 编译成功？**
A: VS Code 和 tsc 可能用不同的配置。按 `Ctrl+Shift+P` → "TypeScript: Select TypeScript Version" → 选择 "Use Workspace Version"。

**Q: 我需要学 TypeScript 吗？**
A: 如果你打算做前端开发（特别是用 Vue 3 或 React），TypeScript 已经是行业标准。建议在掌握 JavaScript 基础后学习。

---

**祝学习愉快！🎉**
