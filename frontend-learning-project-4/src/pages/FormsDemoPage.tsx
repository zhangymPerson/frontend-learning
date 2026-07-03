/**
 * React 表单处理示例页面
 *
 * 本页面展示了 React 中表单处理的多种方式：
 * 1. 受控组件 - React 完全控制表单状态
 * 2. 表单验证 - 实时验证和提交验证
 * 3. 动态表单 - 条件字段和数组字段
 */

import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

// ============================================
// 表单类型定义
// ============================================

interface RegistrationForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number | "";
  gender: "male" | "female" | "other" | "";
  interests: string[];
  bio: string;
  termsAccepted: boolean;
}

type FormErrors = Partial<Record<keyof RegistrationForm, string>>;
type FormTouched = Partial<Record<keyof RegistrationForm, boolean>>;

const initialFormData: RegistrationForm = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  age: "",
  gender: "",
  interests: [],
  bio: "",
  termsAccepted: false,
};

// ============================================
// 主组件
// ============================================

export default function FormsDemoPage() {
  const [formData, setFormData] = useState<RegistrationForm>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validationRules = useMemo(
    () => ({
      username: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        messages: {
          required: "用户名不能为空",
          minLength: "用户名至少3个字符",
          maxLength: "用户名最多20个字符",
          pattern: "用户名只能包含字母、数字和下划线",
        },
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
          required: "邮箱不能为空",
          pattern: "请输入有效的邮箱地址",
        },
      },
      password: {
        required: true,
        minLength: 8,
        messages: {
          required: "密码不能为空",
          minLength: "密码至少8个字符",
        },
      },
      confirmPassword: {
        required: true,
        validate: (value: string, form: RegistrationForm) =>
          value === form.password,
        messages: {
          required: "请确认密码",
          validate: "两次输入的密码不一致",
        },
      },
      age: {
        min: 18,
        max: 120,
        messages: {
          min: "年龄必须大于等于18岁",
          max: "请输入有效的年龄",
        },
      },
      termsAccepted: {
        required: true,
        messages: {
          required: "必须同意条款才能注册",
        },
      },
    }),
    [],
  );

  const validateField = useCallback(
    (
      name: keyof RegistrationForm,
      value: unknown,
      form: RegistrationForm,
    ): string => {
      const rules = validationRules[name as keyof typeof validationRules];
      if (!rules) return "";

      if ("required" in rules && rules.required && (!value || value === "")) {
        return rules.messages.required;
      }

      if (
        "minLength" in rules &&
        rules.minLength !== undefined &&
        typeof value === "string" &&
        value.length < rules.minLength
      ) {
        return rules.messages.minLength;
      }

      if (
        "maxLength" in rules &&
        rules.maxLength !== undefined &&
        typeof value === "string" &&
        value.length > rules.maxLength
      ) {
        return rules.messages.maxLength;
      }

      if (
        "pattern" in rules &&
        rules.pattern &&
        typeof value === "string" &&
        !rules.pattern.test(value)
      ) {
        return rules.messages.pattern;
      }

      if ("validate" in rules && rules.validate && typeof value === "string") {
        if (!rules.validate(value, form)) {
          return rules.messages.validate;
        }
      }

      if (
        "min" in rules &&
        rules.min !== undefined &&
        typeof value === "number"
      ) {
        if (value < rules.min) {
          return rules.messages.min;
        }
      }

      return "";
    },
    [validationRules],
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key as keyof RegistrationForm,
        formData[key as keyof RegistrationForm],
        formData,
      );
      if (error) {
        newErrors[key as keyof RegistrationForm] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value, type } = e.target;

      let processedValue: string | number | boolean = value;

      if (type === "number") {
        processedValue = value === "" ? "" : Number(value);
      } else if (type === "checkbox") {
        processedValue = (e.target as HTMLInputElement).checked;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));

      if (touched[name as keyof FormTouched]) {
        const error = validateField(
          name as keyof RegistrationForm,
          processedValue,
          {
            ...formData,
            [name]: processedValue,
          },
        );
        setErrors((prev) => ({
          ...prev,
          [name]: error || undefined,
        }));
      }
    },
    [formData, touched, validateField],
  );

  const handleInterestChange = useCallback((interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  }, []);

  const handleBlur = useCallback(
    (name: keyof RegistrationForm) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, formData[name], formData);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    },
    [formData, validateField],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const allTouched = Object.keys(formData).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as FormTouched,
      );
      setTouched(allTouched);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitted(true);
        console.log("提交的数据：", formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm],
  );

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setIsSubmitted(false);
  }, []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">注册成功！</h2>
          <p className="text-gray-600 mb-6">欢迎加入我们的社区</p>
          <div className="bg-gray-100 rounded-lg p-4 text-left mb-6">
            <p className="text-sm text-gray-600">注册信息：</p>
            <p className="font-medium text-gray-800">
              用户名：{formData.username}
            </p>
            <p className="font-medium text-gray-800">邮箱：{formData.email}</p>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            重新填写
          </button>
        </div>
      </div>
    );
  }

  const interestOptions = [
    { value: "coding", label: "编程" },
    { value: "reading", label: "阅读" },
    { value: "gaming", label: "游戏" },
    { value: "music", label: "音乐" },
    { value: "sports", label: "运动" },
    { value: "travel", label: "旅行" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            ← 返回首页
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">表单处理示例</h1>
          <div className="w-16"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            用户注册表单
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            本表单展示了 React
            受控组件的各种处理方式：文本输入、下拉选择、复选框、单选按钮等
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 文本输入 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  用户名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => handleBlur("username")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.username
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="3-20个字符"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* 密码输入 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="至少8个字符"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="再次输入密码"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* 数值和选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年龄
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={() => handleBlur("age")}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.age
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="18岁以上"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性别
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </div>

            {/* 复选框组 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兴趣爱好
              </label>
              <div className="flex flex-wrap gap-4">
                {interestOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(option.value)}
                      onChange={() => handleInterestChange(option.value)}
                      className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 文本域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                个人简介
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                placeholder="介绍一下你自己..."
              />
            </div>

            {/* 条款同意 */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                onBlur={() => handleBlur("termsAccepted")}
                className="mt-1 w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <div>
                <label className="text-sm text-gray-700">
                  我已阅读并同意服务条款
                </label>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-500">{errors.termsAccepted}</p>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isSubmitting ? "提交中..." : "提交注册"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                重置
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
