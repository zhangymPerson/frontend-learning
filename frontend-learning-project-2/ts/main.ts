/*
  ============================================================
  文件：ts/main.ts
  作用：整个网站的 TypeScript 逻辑（编译后生成 js/main.js）
  ============================================================

  【知识点 1】TypeScript 是什么？
  - TypeScript = JavaScript + 类型系统
  - 所有合法的 JS 代码也是合法的 TS 代码
  - TS 添加了类型标注、接口、泛型等能力
  - .ts 文件需要编译成 .js 才能在浏览器中运行
  - 编译命令：tsc（需要先安装 TypeScript）

  【知识点 2】和 JavaScript 的核心区别
  - JS：const name = "hello"  ← 只写值
  - TS：const name: string = "hello"  ← 值 + 类型标注
  - 类型标注让编辑器能智能提示、自动检查错误
  ============================================================ */

/*
  【知识点 3】import 导入
  - 从其他 .ts 文件导入类型和值
  - './types' 是相对路径，指向同目录下的 types.ts
  - import { 接口名 } from '路径' → 导入指定的导出项
  - 注意：编译后这些 import 会被去掉（因为不是 ES Module 模式）
*/
import type { ContactFormData, ValidationResult, ProjectInfo } from './types.js';

/*
  【知识点 4】import type - 只导入类型
  - import type 只导入类型信息
  - 编译后会被完全移除，不产生任何 JS 代码
  - 比普通 import 更高效（因为类型只是给编译器看的）
  - 当你只用某个接口做类型标注时，用 import type
*/


/* ============================================================
   【知识点 5】类型标注（Type Annotation）

   基本语法：变量名: 类型 = 值

   常见类型：
   - string    → 字符串："hello"
   - number    → 数字：42、3.14
   - boolean   → 布尔：true、false
   - string[]  → 字符串数组：["a", "b"]
   - null      → 空值
   - undefined → 未定义
   ============================================================ */

/** 项目名称（常量，不可修改） */
const PROJECT_NAME: string = "前端学习项目2";

/** 点击次数（变量，会变化） */
let clickCount: number = 0;


/* ============================================================
   【知识点 6】项目信息对象

   使用 interface 定义类型后，对象必须符合接口的"形状"
   少了属性 → 编译报错
   多了属性 → 编译报错
   类型不对 → 编译报错
   ============================================================ */
const pageInfo: ProjectInfo = {
  name: PROJECT_NAME,
  version: "1.0.0",
  author: "学习者",
  pages: ["首页", "关于", "联系"],
  isPublished: true,
};


/* ============================================================
   【知识点 7】函数类型标注

   TypeScript 中函数的参数和返回值都可以标注类型：
   - function 函数名(参数: 类型): 返回类型 { }

   特殊返回类型：
   - void → 没有返回值（函数不需要 return）
   - never → 函数永远不会正常结束（比如总是抛出异常）
   ============================================================ */

/**
 * 点击按钮时调用的问候函数
 *
 * 【知识点 8】箭头函数的类型标注
 * - const fn = (参数: 类型): 返回类型 => { }
 * - 如果函数没有参数，括号里写 ()，不能省略
 * - 如果返回 void，可以省略返回类型标注（TS 会自动推断）
 */
const sayHello = (): void => {
  /*
    【知识点 9】类型推断（Type Inference）
    - TypeScript 可以自动推断很多类型
    - const greetingEl = document.getElementById('greetingText')
    - TS 知道它返回 HTMLElement | null
    - 你不需要手动标注，但理解推断结果很重要
  */
  const greetingEl = document.getElementById('greetingText');

  // 【知识点 10】空值检查（Null Check）
  // getElementById 可能找不到元素，返回 null
  // 如果不做检查直接用，运行时会报错
  // TypeScript 的 strict 模式会要求你处理这种情况
  if (!greetingEl) {
    console.warn('找不到 greetingText 元素');
    return;  // 提前返回，后面的代码不会执行
  }

  clickCount++;

  // 问候消息数组
  // 【知识点 11】数组类型标注
  // string[] 表示"字符串数组"
  // 也可以写成 Array<string>（泛型写法），两者等价
  const messages: string[] = [
    "你好呀！欢迎学习 TypeScript！🎉",
    "又见面了！你越来越熟练了！💪",
    "你已经点击了很多次了，好奇心很强哦！🔍",
    "继续探索吧，TypeScript 让代码更可靠！✨",
    "你是个有毅力的学习者！🏆",
  ];

  // 【知识点 12】Math.min 的类型
  // Math.min 返回 number 类型
  // 算出安全的数组下标，防止越界
  const index: number = Math.min(clickCount - 1, messages.length - 1);
  const message: string = messages[index];

  // 【知识点 13】修改 DOM 元素
  // greetingEl 在上面的空值检查后，TS 知道它不是 null
  // 这个特性叫"类型收窄"（Type Narrowing）
  greetingEl.textContent = message;

  // 淡入效果
  // 【知识点 14】类型断言（Type Assertion）
  // HTMLElement 的 style 属性是 CSSStyleDeclaration 类型
  // TS 已经知道这些，不需要额外断言
  greetingEl.style.opacity = '0';
  setTimeout((): void => {
    // 【知识点 15】setTimeout 的类型
    // setTimeout 返回 number 类型的定时器 ID
    // 如果不需要取消定时器，可以忽略返回值
    if (greetingEl) {
      greetingEl.style.opacity = '1';
    }
  }, 50);
};


/* ============================================================
   【知识点 16】DOMContentLoaded 事件监听
   - 等 HTML 完全加载后再执行 JS
   - 这样能确保所有 DOM 元素都已存在
   ============================================================ */
document.addEventListener('DOMContentLoaded', (): void => {
  // 尝试获取联系表单
  // 【知识点 17】HTMLElement | null 联合类型
  // getElementById 返回 HTMLElement | null
  // | 就是联合类型："可能是 HTMLElement，也可能是 null"
  const contactForm: HTMLFormElement | null = document.getElementById(
    'contactForm'
  ) as HTMLFormElement | null;

  /*
    【知识点 18】as - 类型断言（Type Assertion）

    getElementById 返回的类型是 HTMLElement | null
    但 <form> 元素实际上是 HTMLFormElement（更具体的类型）

    as HTMLFormElement 告诉 TypeScript：
    "我知道这个元素是 HTMLFormElement，相信我"

    什么时候用 as？
    - 你比 TypeScript 更确定元素的具体类型
    - 比如你确信 id="contactForm" 的元素一定是个 <form>

    注意：as 不会改变运行时的值，只影响编译时的类型检查
  */

  // 如果在非联系页面，contactForm 是 null，不执行后续逻辑
  if (contactForm) {
    // 【知识点 19】表单提交事件的类型
    // Event 类型比较通用，SubmitEvent 更具体
    // 但 SubmitEvent 不是所有环境都支持，用 Event 更安全
    contactForm.addEventListener('submit', (event: Event): void => {
      // 阻止表单默认提交行为（刷新页面）
      event.preventDefault();

      // 获取表单数据
      const formData: ContactFormData = getFormData();

      // 验证表单
      const validation: ValidationResult = validateForm(formData);

      if (!validation.isValid) {
        // 验证失败，显示错误信息
        alert(validation.errorMessage);
        return;
      }

      // 验证通过，显示成功消息
      showResultMessage(formData.name, formData.email);

      // 重置表单
      contactForm.reset();

      // 打印到控制台
      console.log('表单提交：', formData);
    });
  }
});


/* ============================================================
   【知识点 20】提取函数 - 职责分离

   把获取表单数据、验证、显示结果分成独立的函数：
   - 每个函数只做一件事
   - 函数可以单独测试
   - 代码更清晰、更好维护
   ============================================================ */

/**
 * 从表单中获取用户输入的数据
 *
 * @returns ContactFormData 包含姓名、邮箱、消息的对象
 *
 * 【知识点 21】@returns JSDoc 标签
 * - 描述函数的返回值
 * - 编辑器会显示这些信息，帮助理解函数用途
 * - 不影响类型系统，是给开发者看的文档
 */
const getFormData = (): ContactFormData => {
  // 【知识点 22】as HTMLInputElement 类型断言
  // <input> 元素是 HTMLInputElement 类型
  // 它有 .value 属性来获取输入值
  const nameInput = document.getElementById('nameInput') as HTMLInputElement;
  const emailInput = document.getElementById('emailInput') as HTMLInputElement;
  const messageInput = document.getElementById(
    'messageInput'
  ) as HTMLTextAreaElement;

  // 【知识点 23】trim() 去除首尾空格
  // .value 返回 string 类型，.trim() 也返回 string
  return {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    message: messageInput.value.trim(),
  };
};


/**
 * 验证表单数据
 *
 * @param data - 用户提交的表单数据
 * @returns ValidationResult 验证结果
 *
 * 【知识点 24】参数类型标注
 * - 参数名: 类型
 * - TS 会确保调用时传入正确类型的参数
 * - 传错类型 → 编译报错，不会等到运行时才出错
 */
const validateForm = (data: ContactFormData): ValidationResult => {
  // 【知识点 25】解构赋值 + 类型
  // 从对象中提取属性，类型自动继承自 ContactFormData
  const { name, email, message } = data;

  // 检查是否填写了所有字段
  if (!name || !email || !message) {
    return {
      isValid: false,
      errorMessage: '请填写所有字段！',
    };
  }

  // 邮箱格式验证
  // 【知识点 26】正则表达式在 TypeScript 中
  // RegExp 类型，和 JavaScript 一样使用
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: '请输入有效的邮箱地址！',
    };
  }

  // 所有验证通过
  return {
    isValid: true,
    errorMessage: '',
  };
};


/**
 * 在页面上显示提交成功的消息
 *
 * @param name - 用户姓名
 * @param email - 用户邮箱
 *
 * 【知识点 27】模板字符串的类型
 * - 模板字符串的类型是 string
 * - `${变量}` 会自动调用变量的 toString() 方法
 */
const showResultMessage = (name: string, email: string): void => {
  const resultEl = document.getElementById('resultMessage');

  if (!resultEl) {
    console.warn('找不到 resultMessage 元素');
    return;
  }

  // 设置消息内容
  resultEl.textContent = `✅ 谢谢 ${name}！你的消息已收到。（邮箱：${email}）`;

  // 【知识点 28】classList 操作
  // classList 是 DOMTokenList 类型
  // .add()、.remove()、.toggle()、.contains() 等方法
  resultEl.classList.add('success');
};


/* ============================================================
   【知识点 29】枚举（Enum）的使用

   枚举让代码更安全，避免魔法字符串（magic strings）
   ============================================================ */

/**
 * 根据当前页面路径判断导航项是否应该高亮
 *
 * @param pagePath - 页面路径
 * @returns 是否是当前页面
 */
const isCurrentPage = (pagePath: string): boolean => {
  // 【知识点 30】window.location.pathname
  // 获取当前页面的路径
  // 类型是 string，TS 内置了这个类型
  const currentPath: string = window.location.pathname;

  // 【知识点 31】includes() 字符串方法
  // 判断字符串是否包含子串
  // 返回 boolean 类型
  return currentPath.includes(pagePath);
};

// 调试输出
// 【知识点 32】console.log 的类型安全
// console.log 可以接受任意类型和数量的参数
console.log(
  `%c🎓 ${PROJECT_NAME} 已加载完成！`,
  'color: #667eea; font-size: 16px; font-weight: bold;'
);
console.log('项目信息：', pageInfo);
console.log('💡 提示：源码在 ts/ 目录，编译后输出到 js/ 目录');


/* ============================================================
   【知识点 33】浏览器全局作用域

   在 TypeScript 模块中定义的函数，不会自动成为全局函数。
   而 HTML 中的 onclick="sayHello()" 需要全局可访问。

   解决方案：手动挂到 window 对象上
   - window 是浏览器的全局对象
   - (window as any) 是类型断言，告诉 TS "我知道这样写"
   - 实际项目中会用 ES Module + import 的方式，更规范
   ============================================================ */
(window as any).sayHello = sayHello;
(window as any).isCurrentPage = isCurrentPage;
