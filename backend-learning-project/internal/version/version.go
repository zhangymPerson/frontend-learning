package version

// 以下变量由构建时通过 -ldflags 注入
// 示例：go build -ldflags "-X backend-learning-project/internal/version.Version=1.0.0 -X backend-learning-project/internal/version.CommitHash=xxxxxx -X backend-learning-project/internal/version.BuildTime=2026-01-01T00:00:00+0800"
var (
	// Version 接口版本号
	Version = "dev"

	// CommitHash Git 提交短 hash
	CommitHash = "unknown"

	// BuildTime 构建时间
	BuildTime = "unknown"
)

// Info 版本信息响应结构体
type Info struct {
	Version    string `json:"version"`     // 接口版本号
	CommitHash string `json:"commit_hash"` // Git 提交短 hash
	BuildTime  string `json:"build_time"`  // 构建时间
}

// GetInfo 返回当前版本信息
func GetInfo() Info {
	return Info{
		Version:    Version,
		CommitHash: CommitHash,
		BuildTime:  BuildTime,
	}
}
