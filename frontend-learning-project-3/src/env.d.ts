/**
 * Vite 环境类型声明
 *
 * 为 .vue 文件提供 TypeScript 类型支持
 * 让 TypeScript 编译器能够识别 Vue 单文件组件
 */
/// <reference types="vite/client" />

/**
 * 声明 .vue 模块的类型
 * 这使得 TypeScript 能够正确推导导入的 Vue 组件的类型
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
