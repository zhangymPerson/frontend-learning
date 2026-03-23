# TypeScript + React 学习笔记（后端工程师版）

> 面向有后端开发经验（Java/Go/Python 等）的工程师，系统学习 TypeScript 语言与 React 前端框架。
> 目标：学完能独立构建一个具备交互能力的简单网页应用。

---

## 目录

- **第一部分：TypeScript 核心语法**
  - [环境搭建与项目初始化](#1-环境搭建与项目初始化)
  - [基础类型系统](#2-基础类型系统)
  - [接口与类型别名](#3-接口与类型别名)
  - [函数类型](#4-函数类型)
  - [泛型](#5-泛型)
  - [联合类型与交叉类型](#6-联合类型与交叉类型)
  - [类型守卫与类型收窄](#7-类型守卫与类型收窄)
  - [枚举与字面量类型](#8-枚举与字面量类型)
  - [实用工具类型](#9-实用工具类型)
  - [模块系统](#10-模块系统)

- **第二部分：React 核心概念**
  - [React 项目创建（Vite）](#11-react-项目创建vite)
  - [JSX 语法](#12-jsx-语法)
  - [组件：函数组件](#13-组件函数组件)
  - [Props：组件的参数](#14-props组件的参数)
  - [useState：状态管理](#15-usestate状态管理)
  - [useEffect：副作用](#16-useeffect副作用)
  - [useContext：跨组件共享数据](#17-usecontext跨组件共享数据)
  - [useRef：引用 DOM 和持久值](#18-useref引用-dom-和持久值)
  - [useMemo 与 useCallback：性能优化](#19-usememo-与-usecallback性能优化)
  - [useReducer：复杂状态逻辑](#20-usereducer复杂状态逻辑)
  - [自定义 Hook](#21-自定义-hook)
  - [事件处理](#22-事件处理)
  - [条件渲染与列表渲染](#23-条件渲染与列表渲染)
  - [表单处理](#24-表单处理)
  - [React Router：路由](#25-react-router路由)
  - [数据请求（fetch）](#26-数据请求fetch)

- **第三部分：实战构建流程**
  - [完整项目结构](#27-完整项目结构)
  - [一个简单的 Todo 应用](#28-一个简单的-todo-应用)

---

# 第一部分：TypeScript 核心语法

## 1. 环境搭建与项目初始化

```bash
# 全局安装 TypeScript（了解即可，项目中一般用本地安装）
npm install -g typescript

# 验证安装
tsc --version

# 初始化一个 TypeScript 项目
mkdir my-ts-project && cd my-ts-project
npm init -y
npx tsc --init          # 生成 tsconfig.json
```

**tsconfig.json 核心配置：**

```json
{
  "compilerOptions": {
    "target": "ES2020", // 编译目标 JS 版本
    "module": "ESNext", // 模块系统
    "lib": ["ES2020", "DOM"], // 包含的类型声明库
    "strict": true, // 严格模式（强烈建议开启）
    "esModuleInterop": true, // 兼容 CommonJS 模块导入
    "skipLibCheck": true, // 跳过 .d.ts 文件检查（加快编译）
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true, // 允许导入 JSON
    "declaration": true, // 生成 .d.ts 声明文件
    "outDir": "./dist", // 输出目录
    "rootDir": "./src" // 源码目录
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

> **后端工程师注意**：TypeScript 不会直接运行，它需要先编译成 JavaScript。`tsc` 命令就是编译器。但在实际项目中（React/Vue），构建工具（Vite/Webpack）会自动处理编译。

---

## 2. 基础类型系统

TypeScript 在 JavaScript 基础上增加了静态类型。核心理念：**在编译期发现错误，而非运行时。**

> ### 🆚 Java 对照速查
>
> | 概念     | Java                           | TypeScript                   | 说明                                |
> | -------- | ------------------------------ | ---------------------------- | ----------------------------------- |
> | 整数     | `int`, `long`, `short`, `byte` | `number`                     | TS 只有 `number`，统一表示所有数字  |
> | 浮点     | `float`, `double`              | `number`                     | 同上                                |
> | 字符串   | `String`                       | `string`                     | 小写（原始类型，非包装类）          |
> | 布尔     | `boolean`                      | `boolean`                    | 小写（原始类型，非包装类）          |
> | 空值     | `null`                         | `null` + `undefined`         | TS 多一个 `undefined`（变量未赋值） |
> | 数组     | `int[]` / `List<Integer>`      | `number[]` / `Array<number>` | 两种写法等价                        |
> | 任意类型 | `Object`                       | `any` / `unknown`            | 见下方详细说明                      |
> | 无返回   | `void`                         | `void`                       | 含义相同                            |
> | 不存在   | 无对应                         | `never`                      | 函数永不返回（抛异常或死循环）      |
> | 泛型擦除 | 运行时擦除                     | 编译时擦除（同理）           | 都在运行时没有泛型信息              |
> | 类型推断 | Java 10+ `var`                 | 处处可用                     | TS 推断能力远强于 Java              |

### 2.1 基本类型

```typescript
// === 基础标量类型 ===
let username: string = "Alice";
let age: number = 30; // number 包含整数和浮点数
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// === 类型推断（Type Inference）===
// TypeScript 能自动推断类型，不需要每次都手动标注
let city = "Beijing"; // 推断为 string
let count = 42; // 推断为 number
// city = 123;                  // ❌ 编译错误：不能将 number 赋给 string

// === 数组 ===
let scores: number[] = [95, 87, 92];
let names: Array<string> = ["Alice", "Bob"]; // 泛型写法，等价
let mixed: (string | number)[] = ["Alice", 30]; // 联合类型数组

// 🆚 Java 对照：
// Java: int[] scores = {95, 87, 92};          // 原始类型数组
// Java: List<Integer> scores = List.of(95, 87, 92);  // 泛型集合
// TS 的 number[] ≈ Java 的 List<Integer>（可变长、有泛型类型约束）
// 但 TS 数组不需要装箱，number 就是 number，没有 int/Integer 的区分

// === 元组（Tuple）—— Java 中没有的概念！===
// 🆚 类比理解：元组 ≈ Java 中"固定长度、每个位置类型不同的数组"
//
// Java 中没有元组，通常用以下方式模拟：
//   方式1：定义一个 POJO class（最常见）
//     class Point { int x; int y; }
//   方式2：Map.Entry<A, B>（仅限两个元素）
//   方式3：Object[]（丢失类型安全）
//
// TypeScript 的元组 = 方式1 + 方式2 的语法糖，编译期就保证类型安全
let point: [number, number] = [10, 20]; // 类似 Java 的 Point(int x, int y)
let record: [string, number, boolean] = ["Alice", 30, true]; // 三元组

// 元组的解构（Java 16+ 的 record 解构类似）
const [x, y] = point; // x=10, y=20

// 带标签的元组（更像 Java 的 record）
type UserEntry = [name: string, age: number, active: boolean];
const alice: UserEntry = ["Alice", 30, true];

// 🆚 Java record 对照：
// Java: record UserEntry(String name, int age, boolean active) {}
// TS 元组更轻量，适合一次性传递多个值；Java record 更正式，适合长期数据结构

// === any / unknown / void / never —— Java 工程师最需要理解的四个类型 ===

let flexible: any = "anything"; // 关闭类型检查（尽量避免）
flexible = 123; // ✅ any 允许任何操作

let safe: unknown = "hello"; // unknown 是类型安全的 any
// safe.toUpperCase();           // ❌ 必须先做类型检查
if (typeof safe === "string") {
  safe.toUpperCase(); // ✅ 类型收窄后可用
}

function logMessage(msg: string): void {
  // void：无返回值
  console.log(msg);
}

function throwError(msg: string): never {
  // never：永不返回
  throw new Error(msg);
}

// 🆚 Java 对照详解：
//
// any ≈ Java 的 Object（但比 Object 更危险！）
//   Java: Object obj = "hello"; obj = 123;  // 可以，但调用方法需要强转
//   TS any: 允许任何操作，编译器完全不检查，相当于关掉 TS
//   ⚠️ 尽量避免使用 any，它是类型系统的"逃生舱口"
//
// unknown ≈ Java 的 Object（但更安全！）
//   Java: Object obj = "hello"; obj.toString();  // ✅ Object 有方法
//   TS unknown: 在收窄类型之前不能做任何操作
//   推荐：需要"任意类型"时用 unknown，而不是 any
//
// void ≈ Java 的 void（含义完全一致）
//   都表示"函数不返回有意义的值"
//
// never ≈ Java 中没有直接对应
//   Java 的方法即使声明 void，也可能正常返回
//   TS 的 never 表示"这个函数永远不会正常结束"
//   典型场景：抛异常的函数、死循环、穷尽性检查的 switch
//   类比：Java 的 throw 语句之后的代码永远不会执行 ≈ TS 中 never 的概念
```

### 2.2 类型注解 vs 类型推断

```typescript
// 类型注解（显式）
let x: number = 10;

// 类型推断（隐式，推荐优先使用）
let y = 10; // TypeScript 自动推断 y 为 number

// 什么时候需要显式注解？
// 1. 函数参数（推荐显式标注）
function add(a: number, b: number): number {
  return a + b;
}

// 2. 变量初始化延迟
let result: string;
// ... 一些逻辑
result = "computed value";

// 3. 函数返回值复杂时
function parseConfig(raw: string): { host: string; port: number } {
  return JSON.parse(raw);
}
```

---

## 3. 接口与类型别名

> ### 🆚 Java 对照：理解 interface 和 type
>
> **Java 有 interface，TypeScript 也有 interface**——概念非常相似：
>
> - 都定义对象的"形状/契约"
> - 都支持继承（Java `extends`，TS 也用 `extends`）
> - 都不生成运行时代码（编译期概念）
>
> **但 TS 多了一个 `type`**——Java 没有对应物。`type` 是类型别名，可以给**任何类型**起名字：
>
> - Java 中 `interface` 只能描述对象/类
> - TS 中 `type` 还能描述联合类型、元组、函数签名等"复合类型"
> - 简单理解：**`interface` 是 Java 的 interface，`type` 是 Java 中不存在的"类型变量"**

### 3.1 interface（接口）

```typescript
// 定义对象的"形状"
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // ? 表示可选属性
  readonly createdAt: Date; // readonly 只读，不可修改
}

// 使用
const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date(),
};
// user.createdAt = new Date();  // ❌ 只读属性不能修改

// 🆚 Java 对照：
// Java interface:
//   public interface User {
//     int getId();
//     String getName();
//     String getEmail();
//     Optional<Integer> getAge();    // 可选 ≈ TS 的 ?
//     // Java 没有 readonly 的直接对应
//   }
//
// TS interface 更像 Java 的 record 或 POJO：
//   public record User(int id, String name, String email, Integer age, Date createdAt) {}
//
// 关键区别：
//   - Java interface 定义方法签名，TS interface 定义数据形状
//   - TS 的 ?（可选）≈ Java 的 Optional<T>，但更简洁
//   - TS 的 readonly ≈ Java 的 final 字段（赋值后不可修改）

// === 接口继承 ===
interface Employee extends User {
  department: string;
  salary: number;
}

// 多重继承
interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

interface PrintableAndLoggable extends Printable, Loggable {
  // 同时拥有 print() 和 log()
}

// 🆚 Java 对照：接口继承完全一致！
// Java:
//   interface Printable { void print(); }
//   interface Loggable { void log(); }
//   interface PrintableAndLoggable extends Printable, Loggable { }
// TS 和 Java 都支持接口多重继承，写法几乎一样

// === 可索引签名 ===
interface StringMap {
  [key: string]: string; // 任意字符串 key，值为 string
}

const labels: StringMap = {
  name: "姓名",
  age: "年龄",
  email: "邮箱",
};

// 🆚 Java 对照：
// Java: Map<String, String> labels = Map.of("name", "姓名", "age", "年龄");
// TS 的可索引签名 ≈ Java 的 Map<String, String>
// 区别：TS 可以在 interface 中定义"任何 key 都是 string 类型，值是 string 类型"
//      Java 的 Map 是运行时数据结构，TS 的 interface 是编译期类型约束
```

### 3.2 type（类型别名）

> ### 🆚 核心概念：type 是 Java 中不存在的东西
>
> Java 中你只能用 `interface`/`class` 来定义类型。但 TypeScript 的 `type` 更灵活——它是一个**"类型的变量"**，可以给任何类型组合起一个名字。
>
> 想象 Java 中如果你能这样写（当然不能）：
>
> ```java
> // 假想的 Java type 别名
> type ID = int | String;          // 联合类型：int 或 String
> type Point = (int, int);         // 元组
> type Handler = (Event) -> void;  // 函数类型
> ```
>
> TypeScript 的 `type` 就是这个意思。

```typescript
// 类型别名可以给任何类型起名
type ID = number | string; // 联合类型的别名
type Coordinates = [number, number]; // 元组的别名

// 对象类型
type User = {
  id: number;
  name: string;
};

// 函数类型
type Handler = (event: Event) => void;

// 映射类型
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

// 🆚 Java 对照——type 的各种用法：
//
// type ID = number | string;
//   Java 没有联合类型。Java 的做法：
//   - 用 Object（丢失类型安全）
//   - 用密封接口 sealed interface Id { record NumId(int id) implements Id {} record StrId(String id) implements Id {} }
//   - 用 Optional 或 Either monad（需要库支持，如 Vavr）
//   TS 的联合类型 = 编译期安全 + 语法简洁，比 Java 的所有替代方案都好用
//
// type Coordinates = [number, number];
//   Java 做法：定义 record Point(int x, int y)
//   TS 元组更轻量，适合一次性场景
//
// type Handler = (event: Event) => void;
//   Java 做法：@FunctionalInterface interface Handler { void handle(Event event); }
//   TS 的函数类型更简洁，不需要 @FunctionalInterface 注解
//
// type ReadonlyUser = { readonly [K in keyof User]: User[K] };
//   Java 做法：没有对应。Java 的 record 是天然只读的，但不能动态把一个可变类型变为只读
//   TS 的映射类型可以在编译期"变换"已有类型的属性，非常强大
```

### 3.3 interface vs type 怎么选？

| 特性                 | interface | type                 |
| -------------------- | --------- | -------------------- |
| 扩展（extends）      | ✅ 支持   | ✅ 通过 `&` 交叉类型 |
| 合并声明（同名合并） | ✅ 支持   | ❌ 不支持            |
| 联合类型             | ❌ 不支持 | ✅ 支持              |
| 元组/函数别名        | ❌ 不支持 | ✅ 支持              |
| 性能                 | 略优      | 略慢                 |

> ### 🆚 Java 工程师的选型建议
>
> **如果你习惯 Java 的 interface 思维**：优先用 `interface` 定义对象类型，语法最像 Java。
>
> **但遇到以下情况必须用 `type`**：
>
> - 联合类型：`type ID = number | string`（Java 没有联合类型）
> - 元组：`type Pair = [string, number]`
> - 函数签名：`type Fn = (x: number) => string`
> - 类型运算：`type Readonly<T> = { readonly [K in keyof T]: T[K] }`
>
> **类比记忆**：
> | 场景 | Java 做法 | TS 做法 |
> |------|-----------|---------|
> | 定义数据结构 | `interface` / `record` / `class` | `interface` 或 `type` |
> | 多态（类型 A 或 B） | sealed interface + 模式匹配 | `type X = A \| B`（联合类型） |
> | 组合多个接口 | `extends A, B` | `interface X extends A, B` 或 `type X = A & B` |
> | 给类型起别名 | 不存在 | `type ID = number \| string` |

**经验法则：**

- 定义对象/类的形状 → 用 `interface`（最像 Java）
- 定义联合类型、函数类型、元组 → 用 `type`（Java 中没有对应物）
- 团队统一一个风格即可

---

## 4. 函数类型

> ### 🆚 Java 对照
>
> | 概念     | Java                                  | TypeScript                   |
> | -------- | ------------------------------------- | ---------------------------- |
> | 函数定义 | 方法必须在类内部                      | 函数是一等公民，可以独立存在 |
> | 箭头函数 | `(a, b) -> a + b` (Lambda)            | `(a, b) => a + b`            |
> | 函数类型 | `Function` 接口 / `BiFunction<A,B,R>` | `(a: A, b: B) => R`          |
> | 回调     | `@FunctionalInterface`                | 直接用函数类型               |
> | 可选参数 | 不支持（用重载代替）                  | `param?: Type`               |
> | 默认值   | 不支持（用重载或工具方法代替）        | `param: Type = defaultValue` |

```typescript
// === 函数声明 ===
function greet(name: string): string {
  return `Hello, ${name}`;
}
// 🆚 Java: public String greet(String name) { return "Hello, " + name; }

// === 箭头函数 ===
const add = (a: number, b: number): number => a + b;
// 🆚 Java: BinaryOperator<Integer> add = (a, b) -> a + b;
// 两者都是 Lambda，语法非常相似！Java 用 ->，TS 用 =>

// === 可选参数和默认值 ===
function createUser(name: string, age?: number, role: string = "user") {
  return { name, age, role };
}
createUser("Alice"); // age = undefined, role = "user"
createUser("Bob", 25); // role = "user"
createUser("Charlie", 30, "admin");

// === 剩余参数 ===
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10

// === 函数重载 ===
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.trim();
  }
  return value.toFixed(2);
}
format("  hello  "); // "hello"
format(3.14159); // "3.14"

// === 回调函数类型 ===
// 类似 Java 的 FunctionalInterface
type Comparator<T> = (a: T, b: T) => number;

function sort<T>(items: T[], comparator: Comparator<T>): T[] {
  return [...items].sort(comparator);
}

sort([3, 1, 2], (a, b) => a - b); // [1, 2, 3]

// 🆚 Java 对照：
//
// type Comparator<T> = (a: T, b: T) => number;
//   Java: @FunctionalInterface interface Comparator<T> { int compare(T a, T b); }
//   TS 不需要 @FunctionalInterface 注解，任何签名匹配的函数都是合法的 Comparator
//
// sort([3,1,2], (a, b) => a - b);
//   Java: list.sort((a, b) -> a - b);
//   写法几乎一模一样！
//
// TS 的函数类型 vs Java 的 FunctionalInterface：
//   Java: 需要先定义接口，再用 Lambda 实现
//   TS:   函数类型直接定义在参数位置，无需提前声明接口
//   TS 更简洁，Java 更正式（适合大型项目的方法签名文档化）
```

---

## 5. 泛型

> ### 🆚 Java 对照：泛型对比
>
> | 概念       | Java                        | TypeScript                     |
> | ---------- | --------------------------- | ------------------------------ |
> | 泛型函数   | 不支持（Java 没有泛型函数） | `function f<T>(x: T): T`       |
> | 泛型类     | `class Stack<T>`            | `class Stack<T>`               |
> | 泛型接口   | `interface ApiResponse<T>`  | `interface ApiResponse<T>`     |
> | 泛型约束   | `<T extends Comparable<T>>` | `<T extends Comparable>`       |
> | 泛型通配符 | `List<? extends Number>`    | 不需要（用联合类型或泛型约束） |
> | 多个参数   | `<K, V>`                    | `<K, V>`                       |
> | 默认值     | Java 不支持泛型默认值       | `<T = any>`                    |
>
> **核心差异**：Java 的泛型仅限于类和接口，TypeScript 的泛型还能用在函数上。这是 TS 最大的优势之一——你可以写 `function map<T, U>(arr: T[], fn: (item: T) => U): U[]`，在 Java 中你做不到这一点（只能用 Stream API 的链式调用模拟）。

```typescript
// === 基础泛型函数 ===
function identity<T>(value: T): T {
  return value;
}
identity<string>("hello"); // 显式指定类型
identity(42); // 类型推断为 number

// 🆚 Java 对照：
// Java 没有泛型函数！Java 的做法是把泛型放在类上：
//   public class Identity { public static <T> T identity(T value) { return value; } }
// TS 可以直接在函数上写泛型，更灵活

// === 泛型约束 ===
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
getLength("hello"); // ✅ string 有 length
getLength([1, 2, 3]); // ✅ 数组有 length
// getLength(123);      // ❌ number 没有 length

// === 泛型接口 ===
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 使用
type UserResponse = ApiResponse<User>;
type ListResponse = ApiResponse<User[]>;

const res: ApiResponse<User> = {
  code: 200,
  message: "success",
  data: { id: 1, name: "Alice", email: "a@b.com", createdAt: new Date() },
};

// === 泛型类 ===
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.pop(); // 2

// 🆚 Java 对照：泛型类几乎完全一致
// Java:
//   public class Stack<T> {
//     private List<T> items = new ArrayList<>();
//     public void push(T item) { items.add(item); }
//     public T pop() { return items.remove(items.size() - 1); }
//     public T peek() { return items.get(items.size() - 1); }
//   }
//   Stack<Integer> numberStack = new Stack<>();
//
// TS 的泛型类和 Java 的写法、语义几乎一样！
// 区别：TS 没有 private 关键字限制（虽然有 private 但它是编译期的）
//       Java 的泛型在运行时被擦除，TS 的泛型在编译后也被擦除（两者行为相同）

// === 多个泛型参数 ===
function map<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

map([1, 2, 3], (n) => n.toString()); // ["1", "2", "3"]  类型推断为 string[]

// === 泛型默认值 ===
interface Pagination<T = any> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
// Pagination 等价于 Pagination<any>
// Pagination<User> 指定具体类型
```

---

## 6. 联合类型与交叉类型

> ### 🆚 Java 对照：这是 TypeScript 最强大的特性，Java 完全没有！
>
> **联合类型 `A | B`**：变量可以是类型 A **或者**类型 B。
>
> Java 中没有联合类型。常见替代方案：
>
> ```java
> // 方式1：用 Object（丢失类型安全）
> public void print(Object value) { }
>
> // 方式2：用重载（只适用于有限场景）
> public void print(String value) { }
> public void print(int value) { }
>
> // 方式3：用密封接口 + 模式匹配（Java 17+）
> sealed interface Id permits IntId, StrId {}
> record IntId(int value) implements Id {}
> record StrId(String value) implements Id {}
> ```
>
> TypeScript 的联合类型 = 方式3 的语法糖，但**不需要定义额外的类/接口**：
>
> ```typescript
> type Id = number | string; // 一行搞定！
> ```
>
> **交叉类型 `A & B`**：变量**同时**是类型 A 和类型 B。
> Java 的等价物：`interface C extends A, B { }`

```typescript
// === 联合类型（Union Type）：A | B —— "是 A 或者是 B" ===
type StringOrNumber = string | number;
// 🆚 Java：没有这个。Java 的 Object 可以装任何值，但丢失了类型约束
//          TS 的 string | number 在编译期就保证只能是这两种之一

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // 收窄为 string
  } else {
    console.log(id.toFixed(2)); // 收窄为 number
  }
}
// 🆚 Java 17+ 等价写法（模式匹配）：
//   if (id instanceof String s) { s.toUpperCase(); }
//   else if (id instanceof Integer n) { String.format("%.2f", n); }

// === 字面量联合类型（常用！）===
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type HttpStatus = 200 | 201 | 400 | 401 | 404 | 500;

function request(method: HttpMethod, url: string) {
  // ...
}
request("GET", "/api/users"); // ✅
// request("PATCH", "/api/users"); // ❌ "PATCH" 不在允许的值中

// === 交叉类型（Intersection Type）：A & B —— "同时是 A 和 B" ===
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge; // 必须同时有 name 和 age
// 🆚 Java：interface Person extends HasName, HasAge { }
// TS 的 & ≈ Java 的 extends（接口组合）
// 区别：TS 的 & 可以用于任何类型（包括 type 别名），Java 的 extends 只能用于 interface

const p: Person = { name: "Alice", age: 30 }; // ✅
// const p2: Person = { name: "Bob" };          // ❌ 缺少 age

// === 判别联合类型（Discriminated Unions）—— 后端工程师必学 ===
// 🆚 Java 对照：这 ≈ Java 17+ 的 sealed interface + record + 模式匹配
//
// Java 17+:
//   sealed interface Shape permits Circle, Rectangle, Triangle {}
//   record Circle(double radius) implements Shape {}
//   record Rectangle(double width, double height) implements Shape {}
//   record Triangle(double base, double height) implements Shape {}
//
//   double getArea(Shape shape) {
//     return switch (shape) {
//       case Circle c -> Math.PI * c.radius() * c.radius();
//       case Rectangle r -> r.width() * r.height();
//       case Triangle t -> t.base() * t.height() / 2;
//     };
//   }
//
// TS 的判别联合 = Java sealed interface 的语法糖版
// 区别：TS 不需要定义 class/interface/record，直接用 type + interface 组合
// 而且 TS 的 switch 有穷尽检查——如果漏了一个 case，编译器会报错
interface Circle {
  kind: "circle";
  radius: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}
// 🆚 如果你想让 switch 也能返回 never 做穷尽检查，可以这样：
// function getArea(shape: Shape): number {
//   switch (shape.kind) {
//     case "circle": ...
//     case "rectangle": ...
//     case "triangle": ...
//     default: const _exhaustive: never = shape; return _exhaustive;
//   }
// }
// 如果以后新增了 shape 类型但忘了加 case，编译器会报错：不能将 X 赋给 never
// Java 17+ 的 switch 表达式也有类似的穷尽检查
```

---

## 7. 类型守卫与类型收窄

> ### 🆚 Java 对照：类型守卫 vs instanceof
>
> | 概念       | Java                                              | TypeScript                    |
> | ---------- | ------------------------------------------------- | ----------------------------- |
> | 类型检查   | `if (obj instanceof String)`                      | `if (typeof x === "string")`  |
> | 类型收窄   | Java 16+ 自动收窄：`if (obj instanceof String s)` | 自动收窄（同理）              |
> | 自定义守卫 | 不存在                                            | `function isCat(x): x is Cat` |
> | 可选链     | Java 16+ `Optional.map()`                         | `obj?.prop?.value`            |
> | 空值合并   | `Optional.ofNullable(x).orElse(def)`              | `x ?? def`                    |
>
> **核心差异**：Java 的类型收窄是 Java 16+ 才有的新特性，而 TypeScript 从一开始就有。TS 的类型守卫更加灵活——你可以写自定义的"类型检查函数"，告诉编译器"如果这个函数返回 true，那么变量的类型就是 X"。

```typescript
// === typeof 守卫 ===
function padLeft(value: string, padding: string | number): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value; // 收窄为 number
  }
  return padding + value; // 收窄为 string
}
// 🆚 Java 对照：
// Java 用方法重载模拟：
//   String padLeft(String value, int padding) { return " ".repeat(padding) + value; }
//   String padLeft(String value, String padding) { return padding + value; }
// TS 的联合类型 + typeof 守卫 = 更灵活的重载

// === instanceof 守卫 ===
function logValue(value: Date | string) {
  if (value instanceof Date) {
    console.log(value.toISOString()); // 收窄为 Date
  } else {
    console.log(value.toUpperCase()); // 收窄为 string
  }
}
// 🆚 Java：if (value instanceof Date) { ... }  语义完全一致

// === in 守卫 ===
interface Fish {
  swim: () => void;
}
interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // 收窄为 Fish
  } else {
    animal.fly(); // 收窄为 Bird
  }
}

// === 自定义类型守卫（类型谓词）—— Java 中完全没有的概念！===
interface Cat {
  meow: () => void;
}
interface Dog {
  bark: () => void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}

function handleAnimal(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // 收窄为 Cat
  } else {
    animal.bark(); // 收窄为 Dog
  }
}

// 🆚 Java 对照：Java 没有类型谓词
//
// Java 的做法：
//   if (animal instanceof Cat) { ((Cat) animal).meow(); }
//   else if (animal instanceof Dog) { ((Dog) animal).bark(); }
//
// TS 的 `animal is Cat` 是一个返回 boolean 的函数，
// 但它同时告诉编译器："如果返回 true，参数就是 Cat 类型"
// 编译器会在 if 分支中自动将 animal 收窄为 Cat
// Java 没有这种机制，需要显式强转

// === 断言函数（asserts）—— 类似 Java 的 assert，但更强 ===
function assertDefined<T>(
  value: T | null | undefined,
  msg: string,
): asserts value is T {
  if (value == null) {
    throw new Error(msg);
  }
}

function processUser(user: User | null) {
  assertDefined(user, "User is required");
  console.log(user.name); // TypeScript 知道 user 不是 null
}

// 🆚 Java 对照：
// Java: Objects.requireNonNull(user, "User is required");
// TS 的 assertDefined 不仅做运行时检查，还告诉编译器"user 在此后不为 null"
// Java 的 Objects.requireNonNull 只做运行时检查，编译器不知道类型变了

// === 非空断言操作符 ! ===
const element = document.getElementById("app")!; // 返回 HTMLElement，不是 null

// === 可选链 ?. —— 类比 Java 的 Optional ===
const userCity = user?.address?.city; // 如果 address 是 null/undefined，返回 undefined
// 🆚 Java 对照：
// Java: String city = Optional.ofNullable(user).map(User::getAddress).map(Address::getCity).orElse(null);
// TS 的 user?.address?.city 比 Java 的 Optional 链简洁得多！
// 这是 TS 最优雅的语法之一

// === 空值合并 ?? —— 类比 Java 的 Optional.orElse() ===
const displayName = user.name ?? "匿名"; // 只在 null/undefined 时使用默认值
// 与 || 的区别：|| 会在所有 falsy 值时使用默认值（包括 0、""）
// 🆚 Java 对照：
// Java: String name = Optional.ofNullable(user.getName()).orElse("匿名");
// TS 的 ?? 比 Java 的 Optional 简洁得多
```

---

## 8. 枚举与字面量类型

> ### 🆚 Java 对照：枚举的差异
>
> | 特性         | Java `enum`              | TS `enum`          | TS 联合类型（推荐）        |
> | ------------ | ------------------------ | ------------------ | -------------------------- |
> | 本质         | 真正的类（有方法、字段） | 编译后生成 JS 对象 | 纯编译期类型，运行时不存在 |
> | 运行时存在   | ✅ 是                    | ✅ 是（生成对象）  | ❌ 否（编译后消失）        |
> | 支持方法     | ✅ 可以定义抽象方法      | ❌ 不可以          | ❌ 不可以                  |
> | Tree-shaking | ❌ 不支持                | ❌ 不支持          | ✅ 支持                    |
> | 推荐度       | Java 唯一选择            | 不推荐             | ✅ 推荐                    |
>
> **关键差异**：Java 的 enum 是真正的类，可以有字段、方法、构造函数。TS 的 enum 只是"命名常量的集合"，功能弱很多。因此 TS 社区更推荐用**联合类型 + as const**替代 enum。

```typescript
// === 数字枚举 ===
enum Direction {
  Up = 1,
  Down, // 2（自动递增）
  Left, // 3
  Right, // 4
}
let dir: Direction = Direction.Up;
// 🆚 Java：
//   enum Direction { UP(1), DOWN(2), LEFT(3), RIGHT(4);
//     private final int value;
//     Direction(int v) { this.value = v; }
//   }
// TS 的 enum 功能弱很多——不能有方法、不能有构造函数

// === 字符串枚举 ===
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}
// 🆚 Java 没有字符串枚举（Java enum 只能有整数序号）
// Java 做法：enum Color { RED, GREEN, BLUE } 然后用 color.name() 得到 "RED"
// TS 可以直接用字符串值

// === 常量枚举（编译时内联，更高效）===
const enum HttpStatus {
  OK = 200,
  NotFound = 404,
  ServerError = 500,
}
// 使用 HttpStatus.OK 会在编译时替换为 200
// Java 没有对应概念（Java enum 总是运行时对象）

// === 推荐：用联合类型替代枚举 ===
// TypeScript 官方更推荐这种方式
const DIRECTION = {
  Up: 1,
  Down: 2,
  Left: 3,
  Right: 4,
} as const;

type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
// Direction 的类型是 1 | 2 | 3 | 4
// 🆚 Java 对照：这种模式在 Java 中不存在
// Java 必须用 enum，没有"联合类型"这种替代方案
// TS 的联合类型是纯编译期的，不产生任何运行时代码

// === as const（const 断言）===
// 将对象/数组变为只读的字面量类型
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;
// config 的类型是 { readonly apiUrl: "https://api.example.com"; readonly timeout: 5000; readonly retries: 3; }
// config.apiUrl = "other";  // ❌ 只读

// === 字面量类型 ===
type YesOrNo = "yes" | "no";
type OneToFive = 1 | 2 | 3 | 4 | 5;

function confirm(msg: string, answer: YesOrNo) {
  // ...
}
confirm("确定？", "yes"); // ✅
// confirm("确定？", "maybe"); // ❌
```

---

## 9. 实用工具类型

TypeScript 内置了一系列工具类型，简化常见类型操作。

> ### 🆚 Java 对照：工具类型概览
>
> | TS 工具类型     | 含义           | Java 等价做法                   |
> | --------------- | -------------- | ------------------------------- |
> | `Partial<T>`    | 所有属性可选   | 无对应（Java 不支持"可选属性"） |
> | `Required<T>`   | 所有属性必填   | 无对应                          |
> | `Readonly<T>`   | 所有属性只读   | `record`（天然只读）            |
> | `Pick<T, K>`    | 选取部分属性   | 手写子接口                      |
> | `Omit<T, K>`    | 排除部分属性   | 手写子接口                      |
> | `Record<K, V>`  | 键值对类型     | `Map<K, V>`                     |
> | `ReturnType<T>` | 函数返回值类型 | 无对应                          |
> | `Parameters<T>` | 函数参数类型   | 无对应                          |
>
> **核心差异**：Java 的类型系统是"定义即固定"——你定义了一个 class/interface，它的属性就确定了。TS 的工具类型可以在编译期**动态变换已有类型**，这是 Java 做不到的。比如 `Partial<User>` 把 User 的所有属性变成可选，Java 没有这个能力。

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user" | "guest";
}

// === Partial<T> —— 所有属性变为可选 ===
// 场景：更新操作，只需要传要修改的字段
type UpdateUser = Partial<User>;
// 等价于 { id?: number; name?: string; email?: string; age?: number; role?: "admin" | "user" | "guest"; }

function updateUser(id: number, data: Partial<User>) {
  // ...
}
updateUser(1, { name: "New Name" }); // ✅ 只传需要更新的字段
// 🆚 Java 对照：Java 没有 Partial！
// Java 的做法：
//   1. 创建 DTO class，每个字段用 Optional 包装（工作量巨大）
//   2. 用 Builder 模式（每个可选字段都要判断）
//   3. 用 Map<String, Object>（丢失类型安全）
// TS 的 Partial<User> 一行搞定，编译期安全，Java 工程师会非常羡慕

// === Required<T> —— 所有属性变为必填 ===
type RequiredUser = Required<Partial<User>>; // 回到全部必填

// === Readonly<T> —— 所有属性变为只读 ===
type FrozenUser = Readonly<User>;
// frozenUser.name = "new";  // ❌

// === Pick<T, Keys> —— 选取部分属性 ===
type UserBasic = Pick<User, "id" | "name" | "email">;
// { id: number; name: string; email: string; }

// === Omit<T, Keys> —— 排除部分属性 ===
type UserWithoutRole = Omit<User, "role">;
// { id: number; name: string; email: string; age: number; }

// === Record<K, V> —— 构造键值对类型 ===
type RolePermissions = Record<User["role"], string[]>;
// { admin: string[]; user: string[]; guest: string[]; }

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};
// 🆚 Java 对照：
// Java: Map<String, List<String>> permissions = Map.of("admin", List.of("read","write","delete"), ...);
// TS 的 Record 强制要求所有 key 都存在且类型正确
// Java 的 Map 不会检查你是否覆盖了所有 key
// TS 的 Record = 类型安全的 Map 声明

// === Exclude<T, U> / Extract<T, U> ===
type T1 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"（排除）
type T2 = Extract<"a" | "b" | "c", "a" | "b">; // "a" | "b"（提取）

// === NonNullable<T> —— 排除 null 和 undefined ===
type T3 = NonNullable<string | null | undefined>; // string

// === ReturnType<T> —— 获取函数返回值类型 ===
function createUser() {
  return {
    id: 1,
    name: "Alice",
    email: "a@b.com",
    age: 30,
    role: "user" as const,
  };
}
type CreatedUser = ReturnType<typeof createUser>; // { id: number; name: string; ... }
// 🆚 Java 对照：Java 完全没有这个能力！
// Java 只能手写返回类型，或者用 IDE 的"提取类型"功能
// TS 的 ReturnType 让编译器自动推导函数返回值的类型，然后你可以复用这个类型

// === Parameters<T> —— 获取函数参数类型 ===
type CreateUserParams = Parameters<typeof createUser>; // []（无参数）
// 🆚 Java 对照：Java 没有这个能力
// TS 可以从函数签名中提取参数类型作为元组

// === Awaited<T> —— 获取 Promise 解包后的类型 ===
type T4 = Awaited<Promise<string>>; // string
type T5 = Awaited<Promise<Promise<number>>>; // number（递归解包）
// 🆚 Java 对照：
// Java: CompletableFuture<String> → 解包后是 String
// TS 的 Awaited<T> 在编译期做解包，Java 没有对应语法
```

---

## 10. 模块系统

> ### 🆚 Java 对照：模块系统对比
>
> | 概念     | Java                            | TypeScript                        |
> | -------- | ------------------------------- | --------------------------------- |
> | 模块单位 | 一个 `.java` 文件 = 一个类      | 一个 `.ts` 文件 = 一个模块        |
> | 导出     | `public class` / `public` 方法  | `export` 关键字                   |
> | 导入     | `import com.example.User;`      | `import { User } from "./user";`  |
> | 包管理   | `package com.example;`          | 文件路径即包结构                  |
> | 默认导出 | 每个文件一个 public class       | `export default`（一个文件一个）  |
> | 命名导出 | 一个文件只能有一个 public class | 一个文件可以 export 多个          |
> | 类型导入 | 运行时导入                      | `import type { X }`（编译期删除） |
> | 动态加载 | Java 9+ Module System           | `await import("./module")`        |
>
> **核心差异**：Java 的"一个文件一个类"规则在 TS 中不存在。一个 `.ts` 文件可以 export 任意多个函数、类、接口、变量。TS 的模块系统更灵活、更轻量。

```typescript
// === 导出 ===
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export interface Point {
  x: number;
  y: number;
}

export const PI = 3.14159;

// 默认导出（一个模块只能有一个）
export default class Calculator {
  // ...
}

// 🆚 Java 对照：
// Java 的做法：一个文件一个 public class
//   Math.java:
//     package util;
//     public class Math {
//       public static int add(int a, int b) { return a + b; }
//       public static int subtract(int a, int b) { return a - b; }
//     }
//
// TS 的做法：一个文件 export 多个东西
//   math.ts:
//     export function add(a, b) { return a + b; }
//     export function subtract(a, b) { return a - b; }
//     export const PI = 3.14159;
//     export default class Calculator { }
//
// TS 不需要 class 包裹，函数/变量/接口都能直接 export

// === 导入 ===
// main.ts
import Calculator, { add, subtract, type Point, PI } from "./math";
// 🆚 Java：
//   import util.Math;                    // 导入整个类
//   import static util.Math.add;         // 导入静态方法
// TS 的 { add, subtract } ≈ Java 的 import static（按需导入）
// TS 的 import Calculator ≈ Java 的 import（默认导入）

// 重命名导入
import { add as sum } from "./math";
// 🆚 Java：import static util.Math.add as sum; （Java 没有这个语法）

// 导入整个模块
import * as math from "./math";
math.add(1, 2);
// 🆚 Java：没有对应（Java 不支持 import * 导入整个包的所有内容）

// 动态导入（按需加载）
async function loadModule() {
  const { add } = await import("./math");
  return add(1, 2);
}

// === 类型导入（TypeScript 特有）===
// 只导入类型，编译后会被移除
import type { Point } from "./math";
import { type Point, add } from "./math"; // 混合导入

// === 重新导出 ===
// utils/index.ts（桶文件）
export { add, subtract } from "./math";
export type { Point } from "./math";
```

---

# 第二部分：React 核心概念

## 11. React 项目创建（Vite）

> Vite 是当前 React 项目的标准构建工具，替代了老旧的 Create React App。

```bash
# 创建项目（选择 React + TypeScript 模板）
npm create vite@latest my-react-app -- --template react-ts

# 进入项目并安装依赖
cd my-react-app
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173
```

**项目结构：**

```
my-react-app/
├── public/                 # 静态资源（不经过构建处理）
│   └── vite.svg
├── src/                    # 源代码
│   ├── assets/             # 资源文件（图片、字体等）
│   ├── App.css
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   ├── index.css           # 全局样式
│   └── vite-env.d.ts       # Vite 类型声明
├── index.html              # HTML 模板
├── package.json
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 配置
```

**入口文件 `main.tsx`：**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// 将 React 组件挂载到 DOM 节点
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## 12. JSX 语法

JSX 是 JavaScript 的语法扩展，让你在 JS 中编写类似 HTML 的代码。

```tsx
// === JSX 基本规则 ===

// 1. 必须有一个根元素（或用 Fragment 包裹）
// ❌ 错误
// return <h1>Title</h1><p>Content</p>;

// ✅ 正确
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// ✅ 使用 Fragment（不生成多余 DOM 节点）
import { Fragment } from "react";
// 或简写语法 <></>
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// 2. 表达式用花括号 {} 包裹
const name = "Alice";
return <h1>Hello, {name}!</h1>; // 变量
return <p>2 + 2 = {2 + 2}</p>; // 运算
return <p>{user ? user.name : "Guest"}</p>; // 三元表达式
return (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
); // 方法调用

// 3. 属性用驼峰命名
// HTML: onclick, class, tabindex
// JSX:  onClick, className, tabIndex

return (
  <button
    className="primary-btn"
    onClick={handleClick}
    tabIndex={0}
    aria-label="Submit form"
  >
    Click me
  </button>
);

// 4. style 用对象
const styles: React.CSSProperties = {
  color: "red",
  fontSize: 16, // 自动转为 px
  backgroundColor: "#f0f0f0",
};
return <div style={styles}>Styled text</div>;

// 5. 条件属性
const isDisabled = true;
return <button disabled={isDisabled}>Submit</button>;

// 6. 危险 HTML（很少用，注意 XSS）
const htmlContent = "<strong>Bold</strong>";
return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
```

---

## 13. 组件：函数组件

React 19 中只使用函数组件（Class 组件已过时）。

```tsx
// === 最简单的组件 ===
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// 箭头函数写法（更常见）
const Welcome = () => {
  return <h1>Hello, World!</h1>;
};

// === 带 Props 的组件 ===
// Props 是组件的"参数"，类似函数的入参
interface GreetingProps {
  name: string;
  age?: number;  // 可选
}

const Greeting = ({ name, age }: GreetingProps) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>You are {age} years old.</p>}
    </div>
  );
};

// 使用
<Greeting name="Alice" age={30} />
<Greeting name="Bob" />

// === 组件组合 ===
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
};

// children 是 React 的特殊 prop，代表嵌套内容
<Card title="用户信息">
  <p>Name: Alice</p>
  <p>Age: 30</p>
</Card>
```

---

## 14. Props：组件的参数

```tsx
// === 基本 Props ===
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

const Button = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

// === 事件处理 Props ===
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextInput = ({ value, onChange, placeholder }: InputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
};

// === 泛型 Props ===
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyText?: string;
}

function List<T>({ items, renderItem, emptyText = "No items" }: ListProps<T>) {
  if (items.length === 0) {
    return <p>{emptyText}</p>;
  }
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// 使用
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  emptyText="暂无用户"
/>;

// === HTML 属性透传 ===
// 用 ...rest 把剩余的 HTML 属性传递给底层元素
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = ({ label, error, ...inputProps }: InputFieldProps) => {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

// 使用时可以传所有原生 input 属性
<InputField
  label="邮箱"
  type="email"
  placeholder="请输入邮箱"
  required
  error={errors.email}
/>;
```

---

## 15. useState：状态管理

`useState` 是 React 最核心的 Hook，用于在组件中管理可变状态。

```tsx
import { useState } from "react";

// === 基础用法 ===
const Counter = () => {
  // useState 返回 [当前值, 设置函数]
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};

// === 惰性初始化 ===
// 如果初始值计算成本高，传入函数（只在首次渲染时调用）
const [data, setData] = useState(() => {
  const saved = localStorage.getItem("data");
  return saved ? JSON.parse(saved) : null;
});

// === 函数式更新（基于前一个状态计算新状态）===
const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    // 如果连续调用多次，必须用函数式更新
    setCount((prev) => prev + 1); // prev 是当前最新值
    setCount((prev) => prev + 1); // 这里 prev 已经是 +1 后的值
    // 结果：count 增加 2
  };

  // ❌ 错误写法：连续 setCount(count + 1) 两次只会 +1
  // 因为 count 在同一次渲染中是固定的

  return <button onClick={increment}>Count: {count}</button>;
};

// === 对象状态（不可变更新）===
const [user, setUser] = useState({ name: "Alice", age: 30 });

// ✅ 正确：创建新对象
setUser({ ...user, name: "Bob" });

// ❌ 错误：直接修改原对象（React 不会检测到变化）
// user.name = "Bob";
// setUser(user);

// === 数组状态（不可变更新）===
const [items, setItems] = useState<string[]>(["apple", "banana"]);

// 添加
setItems((prev) => [...prev, "cherry"]);

// 删除
setItems((prev) => prev.filter((item) => item !== "banana"));

// 修改
setItems((prev) => prev.map((item) => (item === "apple" ? "APPLE" : item)));

// === useState 的规则 ===
// 1. 只在组件顶层调用，不要在循环/条件/嵌套函数中调用
// 2. 只在 React 函数组件或自定义 Hook 中调用
// 3. 更新状态是异步的，不会立即反映在当前渲染中
// 4. 更新状态会触发组件重新渲染
```

---

## 16. useEffect：副作用

`useEffect` 用于处理组件的"副作用"——与外部系统的交互（数据获取、订阅、手动 DOM 操作、定时器等）。

```tsx
import { useEffect, useState } from "react";

// === 基础用法：每次渲染后执行 ===
useEffect(() => {
  document.title = `Count: ${count}`;
});

// === 空依赖数组：只在挂载时执行一次 ===
useEffect(() => {
  console.log("组件挂载了");
  // 类似 componentDidMount
}, []);

// === 带依赖：依赖变化时执行 ===
useEffect(() => {
  console.log(`count 变成了 ${count}`);
}, [count]); // 只有 count 变化时才执行

// === 完整示例：数据获取 ===
const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 定义异步函数
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.example.com/users");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // 空依赖：组件挂载时请求一次

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// === 清理函数（Cleanup）===
useEffect(() => {
  // 设置
  const timer = setInterval(() => {
    console.log("tick");
  }, 1000);

  // 清理：组件卸载或依赖变化前执行
  return () => {
    clearInterval(timer);
  };
}, []);

// === 常见模式：监听事件 ===
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  // 清理：移除事件监听
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

// === useEffect 的规则 ===
// 1. 不要在 useEffect 中做"应该在事件处理函数中做的事"
//    比如点击按钮后发请求 → 应该放在 onClick 里
// 2. useEffect 是同步渲染后的"额外工作"
// 3. 依赖数组要完整：所有在 effect 中用到的外部变量都要放进去
// 4. ESLint 插件 react-hooks/exhaustive-deps 会帮你检查
```

---

## 17. useContext：跨组件共享数据

Context 解决了"prop drilling"（逐层传递 props）的问题。

```tsx
import { createContext, useContext, useState, type ReactNode } from "react";

// === Step 1: 创建 Context ===
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// createContext 的参数是默认值（一般只在没有 Provider 时用到）
const ThemeContext = createContext<ThemeContextType | null>(null);

// === Step 2: 创建 Provider 组件 ===
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// === Step 3: 创建自定义 Hook 消费 Context ===
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

// === Step 4: 在组件树中使用 ===
// main.tsx
const App = () => (
  <ThemeProvider>
    <MyApp />
  </ThemeProvider>
);

// 任意深层的子组件直接使用
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme(); // 不需要从 props 传来

  return <button onClick={toggleTheme}>当前主题: {theme}，点击切换</button>;
};

const ThemedHeader = () => {
  const { theme } = useTheme();

  return (
    <header style={{ background: theme === "dark" ? "#333" : "#fff" }}>
      <h1>My App</h1>
    </header>
  );
};
```

---

## 18. useRef：引用 DOM 和持久值

`useRef` 创建一个可变的引用对象，跨渲染保持不变，且修改不会触发重新渲染。

```tsx
import { useRef, useEffect, useState } from "react";

// === 用途 1: 引用 DOM 元素 ===
const AutoFocusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 组件挂载后自动聚焦
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="自动聚焦" />
      <button onClick={() => inputRef.current?.focus()}>重新聚焦</button>
    </div>
  );
};

// === 用途 2: 保存不会触发重渲染的值 ===
const StopWatch = () => {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null); // 保存 timer ID

  const start = () => {
    if (timerRef.current !== null) return; // 避免重复启动
    timerRef.current = window.setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Elapsed: {elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};

// === 用途 3: 保存上一次的值 ===
const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>
        Now: {count}, Previous: {prevCount}
      </p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
};

// === useRef vs useState ===
// | 特性       | useRef           | useState         |
// |-----------|------------------|------------------|
// | 修改后重渲染 | ❌ 不会          | ✅ 会            |
// | 值的持久性  | 跨渲染保持        | 跨渲染保持        |
// | 获取 DOM   | ✅ ref.current   | ❌ 不适用        |
// | 异步更新    | 立即生效          | 批量更新          |
```

---

## 19. useMemo 与 useCallback：性能优化

```tsx
import { useState, useMemo, useCallback, memo } from "react";

// === useMemo：缓存计算结果 ===
// 只有当依赖变化时才重新计算
const ExpensiveList = ({
  items,
  filter,
}: {
  items: string[];
  filter: string;
}) => {
  // ✅ 只有 items 或 filter 变化时才重新过滤
  const filteredItems = useMemo(() => {
    console.log("Filtering..."); // 用于验证是否重新计算
    return items.filter((item) =>
      item.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [items, filter]);

  return (
    <ul>
      {filteredItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

// === useCallback：缓存函数引用 ===
// 只有当依赖变化时才创建新函数
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // ✅ 不加 useCallback：每次 ParentComponent 重渲染都会创建新函数
  //    → 导致 ChildComponent 也重渲染（即使 props 没变）
  // ✅ 加了 useCallback：函数引用不变 → ChildComponent 不会不必要地重渲染
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // 依赖为空，函数引用永远不变

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <MemoizedChild onClick={handleClick} />
    </div>
  );
};

// memo：只有 props 变化时才重渲染
const ChildComponent = ({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>Click</button>;
};
const MemoizedChild = memo(ChildComponent);

// === 什么时候用 / 不用？===
// ✅ 用 useMemo：
//   - 计算量大的操作（排序/过滤大量数据）
//   - 作为其他 useMemo/useEffect 的依赖
//   - 引用类型值需要稳定引用时

// ✅ 用 useCallback：
//   - 传递给 memo 包裹的子组件
//   - 作为其他 Hook 的依赖
//   - 传递给自定义 Hook

// ❌ 不要过度优化：
//   - 简单的计算不需要 useMemo（计算成本 < 缓存成本）
//   - 原生 HTML 组件不需要 memo
//   - React 已经很高效，默认行为通常足够
```

---

## 20. useReducer：复杂状态逻辑

当状态逻辑复杂或有多个子状态时，`useReducer` 比 `useState` 更合适。类似于 Redux 的模式。

```tsx
import { useReducer } from "react";

// === 定义 State 和 Action ===
interface TodoState {
  todos: { id: number; text: string; done: boolean }[];
  filter: "all" | "active" | "completed";
}

type TodoAction =
  | { type: "ADD_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: number }
  | { type: "DELETE_TODO"; payload: number }
  | { type: "SET_FILTER"; payload: "all" | "active" | "completed" };

// === Reducer 函数 ===
// 纯函数：接收当前 state 和 action，返回新 state
// 类似 Java 中的策略模式
const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, done: false },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, done: !todo.done } : todo,
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

// === 使用 useReducer ===
const TodoApp = () => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: "all",
  });

  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      dispatch({ type: "ADD_TODO", payload: input.trim() });
      setInput("");
    }
  };

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.done;
    if (state.filter === "completed") return todo.done;
    return true;
  });

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleAdd}>Add</button>

      <div>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}
        >
          All
        </button>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "active" })}
        >
          Active
        </button>
        <button
          onClick={() => dispatch({ type: "SET_FILTER", payload: "completed" })}
        >
          Done
        </button>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() =>
                dispatch({ type: "TOGGLE_TODO", payload: todo.id })
              }
              style={{ textDecoration: todo.done ? "line-through" : "none" }}
            >
              {todo.text}
            </span>
            <button
              onClick={() =>
                dispatch({ type: "DELETE_TODO", payload: todo.id })
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 21. 自定义 Hook

自定义 Hook 是复用状态逻辑的方式，本质就是一个以 `use` 开头的函数。

```tsx
// === Hook 1: useLocalStorage ===
// 同步状态到 localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// 使用
const [theme, setTheme] = useLocalStorage("theme", "light");
const [user, setUser] = useLocalStorage<User | null>("user", null);

// === Hook 2: useFetch ===
// 数据请求 Hook
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController(); // 用于取消请求

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // 清理：组件卸载或 URL 变化时取消请求
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// 使用
const { data: users, loading, error } = useFetch<User[]>("/api/users");

// === Hook 3: useDebounce ===
// 防抖 Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// 使用：搜索框防抖
const SearchPage = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // 只有停止输入 300ms 后才请求
  const { data: results } = useFetch<SearchResult[]>(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : "",
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results?.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  );
};
```

---

## 22. 事件处理

```tsx
// === 基本事件处理 ===
const Button = () => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Clicked!", e.currentTarget.textContent);
  };

  return <button onClick={handleClick}>Click me</button>;
};

// === 常用事件类型 ===
// 鼠标事件
const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {};

// 键盘事件
const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") {
    handleSubmit();
  }
  if (e.key === "Escape") {
    handleCancel();
  }
};

// 表单事件
const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};
const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault(); // 阻止表单默认提交行为
  // 处理提交逻辑
};

// 焦点事件
const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {};
const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {};

// 拖拽事件
const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {};

// === 传递参数给事件处理函数 ===
const ItemList = ({ items }: { items: Item[] }) => {
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteItem(id);
  };

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <button onClick={(e) => handleDelete(item.id, e)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
```

---

## 23. 条件渲染与列表渲染

```tsx
// === 条件渲染 ===

// 方式 1：if/else
const Greeting = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
};

// 方式 2：三元表达式
const StatusBadge = ({
  status,
}: {
  status: "loading" | "success" | "error";
}) => {
  return (
    <span className={status === "error" ? "badge-error" : "badge-ok"}>
      {status === "loading"
        ? "加载中..."
        : status === "success"
          ? "成功"
          : "失败"}
    </span>
  );
};

// 方式 3：&& 短路
const Notification = ({ message }: { message: string | null }) => {
  return (
    <div>
      {message && <div className="alert">{message}</div>}
      {/* message 为 null 时不渲染任何东西 */}
    </div>
  );
};

// 方式 4：提前返回（Guard Clauses）
const UserProfile = ({ user }: { user: User | null }) => {
  if (!user) return <p>Please login</p>;
  if (!user.isVerified) return <p>Please verify your email</p>;

  return <div>Welcome, {user.name}</div>;
};

// === 列表渲染 ===

// 基本列表
const UserList = ({ users }: { users: User[] }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

// ⚠️ key 的规则：
// 1. 必须在兄弟节点中唯一
// 2. 不要用 index 作为 key（除非列表永远不会增删改排序）
// 3. 最好用数据中的唯一标识（id）
// 4. key 不会作为 props 传递给子组件

// 带索引的列表
const NumberedList = ({ items }: { items: string[] }) => {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

// 嵌套列表
const CategoryList = ({ categories }: { categories: Category[] }) => {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

// 使用 filter + map
const ActiveUsers = ({ users }: { users: User[] }) => {
  return (
    <ul>
      {users
        .filter((user) => user.isActive)
        .map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
    </ul>
  );
};
```

---

## 24. 表单处理

```tsx
import { useState, type FormEvent, type ChangeEvent } from "react";

// === 受控组件（推荐）===
// 表单值由 React state 管理
const ControlledForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    agree: false,
  });

  // 通用的 onChange 处理函数
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submit:", formData);
    // 发送请求...
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input name="name" value={formData.name} onChange={handleChange} />
      </div>

      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div>
        <label>
          <input
            name="agree"
            type="checkbox"
            checked={formData.agree}
            onChange={handleChange}
          />
          I agree to terms
        </label>
      </div>

      <button type="submit">Submit</button>
      <button
        type="reset"
        onClick={() =>
          setFormData({ name: "", email: "", role: "user", agree: false })
        }
      >
        Reset
      </button>
    </form>
  );
};

// === 非受控组件（简单场景）===
// 用 ref 直接读取 DOM 值
const UncontrolledForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} name="name" defaultValue="" />
      <input ref={emailRef} name="email" type="email" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
};

// === 表单验证模式 ===
const ValidatedForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@")) newErrors.email = "Invalid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Valid:", { name, email });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## 25. React Router：路由

```bash
npm install react-router-dom
```

```tsx
// === 路由配置 ===
// App.tsx
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      {/* 导航栏 */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      {/* 路由表 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />{" "}
        {/* 动态路由 */}
        <Route path="/dashboard/*" element={<Dashboard />} /> {/* 嵌套路由 */}
        <Route path="*" element={<NotFound />} /> {/* 404 */}
      </Routes>
    </BrowserRouter>
  );
};

// === 获取路由参数 ===
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const UserDetailPage = () => {
  // 获取路径参数：/users/123 → id = "123"
  const { id } = useParams<{ id: string }>();

  // 获取查询参数：/users?page=2&sort=name
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  // 编程式导航
  const navigate = useNavigate();
  const goBack = () => navigate(-1); // 后退
  const goToUser = (id: number) => navigate(`/users/${id}`); // 跳转

  return (
    <div>
      <h1>User #{id}</h1>
      <p>Page: {page}</p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};

// === 嵌套路由 ===
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="stats">Stats</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <Routes>
        <Route path="stats" element={<StatsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route index element={<Navigate to="stats" replace />} />
      </Routes>
    </div>
  );
};

// === 路由守卫（保护路由）===
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuth(); // 自定义 Hook 检查登录状态

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// 使用
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>;
```

---

## 26. 数据请求（fetch）

```tsx
// === 基础 fetch 使用 ===
const useApi = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// === 使用示例 ===
interface Post {
  id: number;
  title: string;
  body: string;
}

const PostList = () => {
  const {
    data: posts,
    loading,
    error,
    refetch,
  } = useApi<Post[]>("https://jsonplaceholder.typicode.com/posts?_limit=10");

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        Error: {error} <button onClick={refetch}>Retry</button>
      </div>
    );

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {posts?.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
};

// === POST 请求 ===
const createUser = async (userData: Omit<User, "id">) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

// 在组件中使用
const CreateUserForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<User, "id">) => {
    setLoading(true);
    try {
      const newUser = await createUser(data);
      console.log("Created:", newUser);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ...
};

// === 错误边界（Error Boundary）===
// 捕获子组件的渲染错误
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 使用
<ErrorBoundary fallback={<p>Something went wrong.</p>}>
  <PostList />
</ErrorBoundary>;
```

---

# 第三部分：实战构建流程

## 27. 完整项目结构

```
my-app/
├── public/
├── src/
│   ├── assets/               # 静态资源
│   ├── components/           # 通用组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── index.ts          # 桶文件，统一导出
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useLocalStorage.ts
│   │   ├── useFetch.ts
│   │   └── useDebounce.ts
│   ├── pages/                # 页面组件（对应路由）
│   │   ├── Home.tsx
│   │   ├── Users.tsx
│   │   └── UserDetail.tsx
│   ├── services/             # API 请求封装
│   │   └── api.ts
│   ├── types/                # 类型定义
│   │   └── index.ts
│   ├── utils/                # 工具函数
│   │   └── helpers.ts
│   ├── context/              # Context Provider
│   │   └── ThemeContext.tsx
│   ├── App.tsx               # 根组件（路由配置）
│   ├── main.tsx              # 入口
│   └── index.css             # 全局样式
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 28. 一个简单的 Todo 应用

以下是完整可运行的 Todo 应用，覆盖了前面所有核心概念。

### `types/index.ts`

```typescript
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = "all" | "active" | "completed";
```

### `hooks/useLocalStorage.ts`

```typescript
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### `components/TodoItem.tsx`

```typescript
import { memo } from "react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = memo(({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          opacity: todo.completed ? 0.5 : 1,
          flex: 1,
        }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} style={{ color: "red" }}>
        Delete
      </button>
    </li>
  );
});

TodoItem.displayName = "TodoItem";
export default TodoItem;
```

### `components/TodoInput.tsx`

```typescript
import { useState, type FormEvent } from "react";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default TodoInput;
```

### `components/TodoFilter.tsx`

```typescript
import type { FilterType } from "../types";

interface TodoFilterProps {
  current: FilterType;
  onChange: (filter: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

const TodoFilter = ({ current, onChange, counts }: TodoFilterProps) => {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            fontWeight: current === key ? "bold" : "normal",
            textDecoration: current === key ? "underline" : "none",
          }}
        >
          {label} ({counts[key]})
        </button>
      ))}
    </div>
  );
};

export default TodoFilter;
```

### `App.tsx`

```typescript
import { useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import TodoFilter from "./components/TodoFilter";
import type { Todo, FilterType } from "./types";

const App = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [filter, setFilter] = useState<FilterType>("all");

  // 添加 Todo
  const handleAdd = useCallback((text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, createdAt: new Date() },
    ]);
  }, [setTodos]);

  // 切换完成状态
  const handleToggle = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  // 删除
  const handleDelete = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, [setTodos]);

  // 过滤 + 统计（用 useMemo 缓存）
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }), [todos]);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px" }}>
      <h1>📝 Todo App</h1>

      <TodoInput onAdd={handleAdd} />

      <TodoFilter current={filter} onChange={setFilter} counts={counts} />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTodos.length === 0 ? (
          <p style={{ color: "#999" }}>No todos found.</p>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </ul>

      <p style={{ color: "#666", fontSize: 14 }}>
        {counts.active} item{counts.active !== 1 ? "s" : ""} left
      </p>
    </div>
  );
};

export default App;
```

---

## 快速参考卡

### TypeScript 速查

```
基础类型：string, number, boolean, null, undefined, void, never
对象类型：interface / type
数组类型：T[] / Array<T>
联合类型：A | B
交叉类型：A & B
泛型：  function f<T>(x: T): T
工具类型：Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>, Record<K,V>
类型收窄：typeof, instanceof, in, 自定义守卫
```

### React Hook 速查

```
useState      → 管理状态
useEffect     → 副作用（数据获取、订阅、定时器）
useContext    → 跨组件共享数据
useRef        → DOM 引用 / 持久值
useMemo       → 缓存计算结果
useCallback   → 缓存函数引用
useReducer    → 复杂状态逻辑（reducer 模式）
自定义 Hook   → 复用状态逻辑（use 开头的函数）
```

### 常用命令

```bash
# 创建项目
npm create vite@latest my-app -- --template react-ts

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 安装常用库
npm install react-router-dom         # 路由
npm install axios                    # HTTP 请求（可选）
npm install -D @types/node           # Node 类型声明
```
