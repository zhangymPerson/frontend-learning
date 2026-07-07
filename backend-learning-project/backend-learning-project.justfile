# 后端项目：Go + Gin + GORM + SQLite + JWT

alias bb := build-backend

# 构建后端项目
build-backend:
    go build -ldflags "-X backend-learning-project/internal/version.Version=1.0.0 -X backend-learning-project/internal/version.CommitHash=$(git rev-parse --short HEAD) -X backend-learning-project/internal/version.BuildTime=$(date +%Y-%m-%dT%H:%M:%S%z)" -o server cmd/server/main.go

alias rb := run-backend

# 前台运行后端项目
run-backend: build-backend
    @echo "本地访问地址: http://localhost:8080"
    ./server

alias sb := start-backend

# 后台启动后端项目
start-backend: build-backend
    #!/usr/bin/env sh
    if [ -f .pid ] && kill -0 "$(cat .pid)" 2>/dev/null; then
        echo "后端服务已在运行，PID: $(cat .pid)"
        exit 0
    fi
    rm -f .pid
    nohup ./server > server.log 2>&1 &
    echo $! > .pid
    echo "后端服务已启动，PID: $(cat .pid)，日志: backend-learning-project/server.log"

alias kb := stop-backend

# 停止后端项目
stop-backend:
    #!/usr/bin/env sh
    if [ -f .pid ]; then
        PID=$(cat .pid)
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            echo "已停止后端服务 PID: $PID"
        else
            echo "进程 $PID 不存在"
        fi
        rm -f .pid
    else
        # 未找到 PID 文件时，尝试按工作目录查找进程
        PID=$(pgrep -f "./server")
        if [ -n "$PID" ]; then
            kill $PID
            echo "已停止后端服务 PID: $PID"
        else
            echo "未找到 PID 文件，后端服务可能未启动"
        fi
    fi

alias tb := test-backend

# 运行后端项目测试
test-backend:
    go test ./...

alias fb := format-backend

# 格式化后端 Go 代码
format-backend:
    go fmt ./...

alias cb := clear-backend

# 清理后端项目生成文件
clear-backend:
    rm -f server
    rm -f app.db
    rm -f .pid
    rm -f server.log

alias sa := serve-api

# 预览 OpenAPI 文档（端口 8081）
serve-api:
    npx @scalar/cli document serve openapi.yaml -p 8081
