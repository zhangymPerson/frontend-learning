/**
 * 全局类型定义文件
 *
 * TypeScript 在 Vue 3 中是一等公民，提供了完整的类型推导支持
 * 善用类型定义可以大幅减少运行时错误
 */

/** 单个待办事项的类型 */
export interface TodoItem {
  /** 唯一标识符 */
  id: number;
  /** 待办事项内容 */
  text: string;
  /** 是否已完成 */
  completed: boolean;
  /** 创建时间 */
  createdAt: Date;
}

/** 用户信息类型 */
export interface UserInfo {
  name: string;
  role: "admin" | "user" | "guest";
}

/** 通用的 API 响应类型 — 使用泛型 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
