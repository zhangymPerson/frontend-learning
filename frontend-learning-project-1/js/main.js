/*
  ============================================================
  文件：js/main.js
  作用：整个网站的 JavaScript 文件
  ============================================================

  【知识点 1】JavaScript 是什么？
  - JavaScript（简称 JS）是一种编程语言
  - 它让网页"动起来"：响应点击、处理表单、更新内容...
  - HTML 是骨架，CSS 是皮肤，JavaScript 是大脑和肌肉

  【知识点 2】JavaScript 的三种引入方式
  1. 内联：<button onclick="alert('hi')">点击</button>
  2. 内部：<script> 代码写在这里 </script>
  3. 外部：<script src="js/main.js"></script> ← 我们用这种方式
  ============================================================ */


/* ============================================================
   【知识点 3】变量声明 - let 和 const

   - let：声明一个可以改变的变量（可重新赋值）
   - const：声明一个不可改变的常量（不能重新赋值）
   - var：旧写法，有坑，现代 JS 基本不用了

   建议：默认用 const，需要改变时才用 let
   ============================================================ */
const projectName = "前端学习项目1";  // 这个值不会变，用 const
let clickCount = 0;                    // 这个值会变（每次点击+1），用 let


/* ============================================================
   【知识点 4】函数（Function）

   函数是一段可以重复使用的代码块。

   写法一：函数声明（Function Declaration）
   function 函数名(参数) { 代码 }

   写法二：箭头函数（Arrow Function）- ES6 新语法
   const 函数名 = (参数) => { 代码 }

   两种都可以，箭头函数更简洁
   ============================================================ */

/**
 * 点击按钮时调用的函数
 * 功能：显示一条问候语，并记录点击次数
 */
function sayHello() {
  /*
    【知识点 5】DOM 操作 - 获取页面元素
    - DOM = Document Object Model（文档对象模型）
    - document.getElementById('id') → 通过 id 找到页面上的元素
    - 找到后可以读取或修改它的内容、样式等
  */
  const greetingEl = document.getElementById('greetingText');

  // 【知识点 6】++ 运算符 - 变量自增 1
  clickCount++;

  /*
    【知识点 7】模板字符串（Template Literals）
    - 用反引号 ` ` 包裹，而不是引号
    - ${变量名} 可以在字符串中嵌入变量
    - 比用 + 拼接字符串方便得多
    - 旧写法："你好，第" + clickCount + "次点击！"
    - 新写法：`你好，第${clickCount}次点击！`
  */
  const messages = [
    "你好呀！欢迎学习前端！🎉",
    "又见面了！你越来越熟练了！💪",
    "你已经点击了很多次了，好奇心很强哦！🔍",
    "继续探索吧，前端世界很精彩！✨",
    "你是个有毅力的学习者！🏆"
  ];

  // 【知识点 8】三元运算符 - 简化版 if-else
  // 条件 ? 值1 : 值2
  // 如果 clickCount > messages.length 就用最后一条，否则用对应的消息
  const index = clickCount > messages.length ? messages.length - 1 : clickCount - 1;
  const message = messages[index];

  // 【知识点 9】修改元素的文本内容
  // textContent：设置纯文本（安全，不会解析 HTML）
  // innerHTML：可以包含 HTML 标签（有安全风险，来自用户的内容要小心）
  greetingEl.textContent = message;

  // 【知识点 10】修改元素的样式
  // element.style.属性名 = '值'
  // 注意：CSS 中的 background-color 在 JS 里写成 backgroundColor（驼峰命名）
  greetingEl.style.opacity = '0';
  setTimeout(() => {
    greetingEl.style.opacity = '1';
  }, 50);
  /*
    【知识点 11】setTimeout - 延时执行
    - setTimeout(函数, 毫秒数) → 等待指定时间后执行函数
    - 上面的代码：先让文字透明 → 50毫秒后恢复不透明
    - 配合 CSS 的 transition，产生淡入效果
  */
}


/* ============================================================
   【知识点 12】addEventListener - 事件监听（更规范的写法）

   之前我们用 onclick="sayHello()" 这种内联写法，
   更好的方式是用 addEventListener：

   element.addEventListener('事件名', 函数)

   常见事件：
   - click：点击
   - mouseenter / mouseleave：鼠标移入/移出
   - submit：表单提交
   - input / change：输入框内容变化
   - keydown / keyup：键盘按键
   - load / DOMContentLoaded：页面加载完成
   ============================================================ */

// 这个代码块只在联系页面（有 contactForm 时）才执行
document.addEventListener('DOMContentLoaded', function() {
  /*
    【知识点 13】DOMContentLoaded 事件
    - 当 HTML 文档被完全加载和解析完成后触发
    - 比 window.onload 更好，因为它不需要等图片等资源加载完
    - 所有关于 DOM 操作的代码都应该放在这个事件里（或放在 body 底部）
  */

  // 尝试获取联系表单（只有联系页面才有）
  const contactForm = document.getElementById('contactForm');

  // 【知识点 14】条件判断 - if 语句
  // 如果找不到 contactForm（在首页或关于页面），contactForm 就是 null
  // null 在条件中被视为 false，所以不会执行里面的代码
  if (contactForm) {

    /*
      【知识点 15】表单提交事件处理
      - form 的 submit 事件在点击提交按钮时触发
      - event.preventDefault() 阻止表单的默认行为（刷新页面）
      - 这样我们就可以用 JS 自己处理表单数据
    */
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();  // 阻止默认的页面刷新

      // 【知识点 16】获取表单输入值
      const nameInput = document.getElementById('nameInput');
      const emailInput = document.getElementById('emailInput');
      const messageInput = document.getElementById('messageInput');

      const name = nameInput.value.trim();    // .value 获取输入框的值
      const email = emailInput.value.trim();  // .trim() 去掉前后空格
      const message = messageInput.value.trim();

      /*
        【知识点 17】输入验证
        - 检查用户是否填写了必要字段
        - 如果没填，给用户提示并阻止提交
      */
      if (!name || !email || !message) {
        // 【知识点 18】alert() - 弹出警告框（简单但体验不好，后面可以学更好的方式）
        alert('请填写所有字段！');
        return;  // return 提前结束函数，不再往下执行
      }

      // 简单的邮箱格式检查
      // 【知识点 19】正则表达式（RegExp）基础
      // /pattern/ 是正则表达式字面量
      // .test(字符串) 返回 true 或 false
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('请输入有效的邮箱地址！');
        return;
      }

      // 【知识点 20】在页面上显示结果（比 alert 更好的体验）
      const resultEl = document.getElementById('resultMessage');
      resultEl.textContent = `✅ 谢谢 ${name}！你的消息已收到。（邮箱：${email}）`;
      resultEl.classList.add('success');
      /*
        【知识点 21】classList - 操作元素的 CSS 类
        - classList.add('类名') → 添加一个类
        - classList.remove('类名') → 移除一个类
        - classList.toggle('类名') → 有则移除，无则添加
        - classList.contains('类名') → 是否有这个类（返回布尔值）
      */

      // 清空表单
      // 【知识点 22】重置表单
      contactForm.reset();

      // 打印到控制台（开发者调试用）
      // 【知识点 23】console.log() - 在浏览器控制台输出信息
      // 打开浏览器开发者工具（F12）→ Console 标签页可以看到
      console.log('表单提交：', { name, email, message });
    });
  }
});


/* ============================================================
   【知识点 24】数据类型基础

   JavaScript 有 7 种基本数据类型：
   - string（字符串）：'hello'、"world"、`模板`
   - number（数字）：42、3.14、-1、NaN、Infinity
   - boolean（布尔值）：true、false
   - undefined：声明了但没赋值
   - null：空值（有意设置为空）
   - symbol：唯一标识符（高级用法）
   - bigint：大整数（高级用法）

   还有 object（对象）：{ key: value }、[1, 2, 3]、function(){}
   ============================================================ */

// 【知识点 25】对象（Object）- 键值对的集合
const pageInfo = {
  name: "前端学习项目1",
  version: "1.0.0",
  author: "学习者",
  pages: ["首页", "关于", "联系"],  // 对象里可以包含数组
  isPublished: true
};

// 【知识点 26】访问对象属性
// 点号：pageInfo.name
// 方括号：pageInfo['name']（属性名是变量时用这种方式）
console.log('项目信息:', pageInfo.name, 'v' + pageInfo.version);

// 【知识点 27】数组（Array）- 有序的元素集合
const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];

// 数组常用方法：
console.log('颜色数量:', colors.length);      // .length 数组长度
console.log('第一个颜色:', colors[0]);         // [0] 取第一个元素（下标从0开始）
console.log('是否有紫色:', colors.includes('#764ba2')); // .includes() 是否包含

// 【知识点 28】遍历数组 - forEach
colors.forEach(function(color, index) {
  // forEach 对数组每个元素执行一次回调函数
  // color 是当前元素，index 是下标
  console.log(`颜色 ${index + 1}: ${color}`);
});

// 箭头函数写法更简洁：
// colors.forEach((color, index) => console.log(`颜色 ${index + 1}: ${color}`));


/* ============================================================
   【知识点 29】控制台输出调试技巧

   打开浏览器开发者工具（按 F12）：
   - Console 标签页：查看 console.log 输出
   - Elements 标签页：查看和修改 HTML/CSS
   - Network 标签页：查看网络请求

   常用 console 方法：
   - console.log()   → 普通信息
   - console.warn()  → 警告（黄色）
   - console.error() → 错误（红色）
   - console.table() → 表格形式展示数组/对象
   - console.time()  → 计时（性能测试用）
   ============================================================ */
console.log('%c🎓 前端学习项目1 已加载完成！', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('💡 提示：打开这个文件（js/main.js），里面的注释就是你的学习笔记！');
