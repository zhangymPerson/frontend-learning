package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CORS 跨域中间件
//
// 【知识点】浏览器同源策略（Same-Origin Policy）会阻止前端页面向「协议/域名/端口」
// 任一不同的后端发起请求。CORS（Cross-Origin Resource Sharing）通过在响应头中
// 设置 Access-Control-* 字段，告诉浏览器允许指定的跨域请求。
//
// 关键点：
//   - Access-Control-Allow-Origin：允许的源，携带凭据时不能用 "*"，需回显请求来源。
//   - Access-Control-Allow-Credentials：是否允许携带 Cookie / Authorization 头。
//   - Access-Control-Allow-Methods / Headers：预检（OPTIONS）请求允许的方法与头。
//   - 浏览器对「非简单请求」会先发一次 OPTIONS 预检，必须返回 204/200 且不进入业务路由。
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin != "" {
			// 回显请求来源（允许任意跨域，学习项目简化写法）
			c.Header("Access-Control-Allow-Origin", origin)
			// 允许携带凭据（JWT 一般放在 Authorization 头，仍需此配置以支持 Cookie 场景）
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
			c.Header("Access-Control-Max-Age", "86400") // 预检结果缓存 24 小时
		}

		// 预检请求直接放行，不进入后续路由
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
