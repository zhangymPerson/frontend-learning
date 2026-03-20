# 前端学习项目1 🎓

一个专为初学者设计的前端学习项目，帮助你理解 **HTML** 和 **JavaScript** 的基础知识。

> 没有框架，没有构建工具，没有复杂依赖。只有最纯粹的 HTML + CSS + JavaScript。

---

## 📁 项目结构

```
前端学习项目1/
├── index.html          ← 首页（欢迎页面 + 入门交互）
├── css/
│   └── style.css       ← 全站样式（带详细注释）
├── js/
│   └── main.js         ← 全站 JavaScript（带详细注释）
├── pages/
│   ├── about.html      ← 关于页面（学习路线图）
│   └── contact.html    ← 联系页面（表单交互）
└── README.md           ← 你正在看的文件
```

---

## 🚀 启动方式（三选一）

### 方式一：直接双击打开（最简单）

1. 找到项目文件夹
2. 双击 `index.html`
3. 浏览器会自动打开页面 ✅

> ⚠️ 注意：这种方式下，部分功能（如 fetch 请求）可能受限，但本项目的所有功能都可以正常使用。

### 方式二：用 VS Code 的 Live Server（推荐）

1. 安装 [VS Code](https://code.visualstudio.com/)
2. 在 VS Code 中安装扩展：**Live Server**（搜索 "Live Server" 点击安装）
3. 用 VS Code 打开项目文件夹
4. 右键 `index.html` → 选择 **"Open with Live Server"**
5. 浏览器会自动打开，并且修改代码后会自动刷新 🔄

### 方式三：用 Python 启动本地服务器

如果你已经安装了 Python，可以在项目目录下运行：

```bash
# Python 3
python3 -m http.server 8080

# Python 2（不推荐，但有些老系统只有 Python 2）
python -m SimpleHTTPServer 8080
```

然后在浏览器打开：**http://localhost:8080**

---

## 📚 如何学习这个项目

### 第一步：看页面效果

先在浏览器中打开每个页面，看看它们长什么样：
- `index.html` — 首页
- `pages/about.html` — 关于
- `pages/contact.html` — 联系（试试提交表单！）

### 第二步：读源代码（重点！）

这个项目的源代码里有 **大量详细注释**，每个知识点都有解释：

1. **HTML**：打开 `index.html`，从上往下读，每个 `<!-- -->` 注释都是一个知识点
2. **CSS**：打开 `css/style.css`，学习选择器、盒模型、布局
3. **JavaScript**：打开 `js/main.js`，学习变量、函数、DOM 操作

### 第三步：动手修改

学习编程最重要的就是动手！试试以下练习：

#### 练习 1：修改首页
- 把 `<h2>` 里的欢迎文字改成你喜欢的
- 换一个你喜欢的渐变颜色（搜 "CSS gradient generator"）
- 给按钮加一个新的点击效果

#### 练习 2：修改样式
- 改变 `body` 的 `background-color`
- 修改 `.hero` 的圆角大小
- 给导航栏换个背景色

#### 练习 3：修改 JavaScript
- 在 `sayHello()` 函数里添加更多问候语
- 改变点击按钮后问候语的颜色
- 在控制台中尝试运行代码（F12 → Console）

### 第四步：打开浏览器开发者工具

按 **F12** 打开开发者工具：

| 标签页 | 用途 |
|--------|------|
| **Elements** | 查看和实时修改 HTML/CSS |
| **Console** | 查看 JavaScript 输出、运行代码 |
| **Network** | 查看网络请求 |
| **Sources** | 查看源文件、设置断点调试 |

> 💡 在 Console 中输入 `sayHello()` 然后回车，可以直接调用函数！

---

## 🎯 涵盖的知识点清单

### HTML 知识点
- [x] DOCTYPE 声明
- [x] html / head / body 基本结构
- [x] meta 标签（charset、viewport）
- [x] title 标签
- [x] link 引入 CSS
- [x] script 引入 JS
- [x] 语义化标签（header、nav、main、section、footer）
- [x] 标题标签（h1 ~ h6）
- [x] 段落标签 p
- [x] 超链接 a
- [x] 列表 ul / li、dl / dt / dd
- [x] 表单（form、input、textarea、button、label）
- [x] 代码展示（pre、code）
- [x] HTML 实体（&copy; 等）

### CSS 知识点
- [x] 选择器（元素、类、ID、后代、伪类、伪元素）
- [x] 盒模型（margin、padding、border）
- [x] box-sizing: border-box
- [x] 颜色表示（英文、十六进制、rgba、渐变）
- [x] 字体和排版
- [x] Flexbox 弹性布局
- [x] Grid 网格布局
- [x] 过渡动画 transition
- [x] 阴影 box-shadow
- [x] 响应式设计 media query
- [x] 常用属性（display、position、overflow 等）

### JavaScript 知识点
- [x] 变量声明（let、const）
- [x] 数据类型（string、number、boolean、object、array）
- [x] 函数（function 声明、箭头函数）
- [x] 条件判断（if、三元运算符）
- [x] 数组方法（forEach、includes、length）
- [x] 对象（键值对、访问属性）
- [x] 模板字符串
- [x] DOM 操作（getElementById、textContent、style）
- [x] 事件监听（addEventListener、click、submit）
- [x] 表单处理（获取值、验证、阻止默认行为）
- [x] classList 操作
- [x] setTimeout 延时
- [x] console.log 调试
- [x] 正则表达式基础

---

## 🔗 学完之后的下一步

这个项目覆盖了最基础的知识。学完之后，你可以继续学习：

1. **CSS 进阶**：Flexbox 和 Grid 布局深入、动画 keyframes
2. **JavaScript 进阶**：ES6+ 新语法、Promise/async-await、模块化
3. **框架入门**：Vue.js（推荐先学这个）或 React
4. **工具链**：npm、Webpack/Vite、Git 版本控制

推荐学习资源：
- 📖 [MDN Web Docs](https://developer.mozilla.org/zh-CN/) — 最权威的前端文档
- 🎮 [freeCodeCamp](https://www.freecodecamp.org/chinese) — 免费互动课程
- 📺 [黑马程序员 Pink](https://www.bilibili.com/) — B站上有很多免费的前端教程

---

## ❓ 常见问题

**Q: 中文显示乱码怎么办？**
A: 确保 HTML 文件第一行有 `<meta charset="UTF-8">`，并且文件确实以 UTF-8 编码保存。

**Q: 点击按钮没有反应？**
A: 按 F12 打开控制台，看看有没有红色的错误信息。常见原因是文件路径不对。

**Q: 样式没有生效？**
A: 检查 `<link>` 标签的 `href` 路径是否正确。`index.html` 用 `css/style.css`，`pages/` 下的页面用 `../css/style.css`。

---

**祝学习愉快！🎉**
