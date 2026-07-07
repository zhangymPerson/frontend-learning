# https://just.systems

set unstable

default:
    just --fmt
    just -f frontend-learning-project-1/frontend-learning-project-1.justfile --fmt
    just -f frontend-learning-project-2/frontend-learning-project-2.justfile --fmt
    just -f frontend-learning-project-3/frontend-learning-project-3.justfile --fmt
    just -f frontend-learning-project-4/frontend-learning-project-4.justfile --fmt
    just -f frontend-learning-project-5/frontend-learning-project-5.justfile --fmt
    just -f backend-learning-project/backend-learning-project.justfile --fmt
    just --list

# 运行前端项目 1 任务
run-project-1:
    just -f frontend-learning-project-1/frontend-learning-project-1.justfile --choose

alias r2 := run-project-2

# 运行前端项目 2 任务
run-project-2:
    just -f frontend-learning-project-2/frontend-learning-project-2.justfile --choose

alias r3 := run-project-3

# 运行前端项目 3 任务
run-project-3:
    just -f frontend-learning-project-3/frontend-learning-project-3.justfile --choose

alias r4 := run-project-4

# 运行前端项目 4 任务
run-project-4:
    just -f frontend-learning-project-4/frontend-learning-project-4.justfile --choose

alias r5 := run-project-5

# 运行前端项目 5 任务
run-project-5:
    just -f frontend-learning-project-5/frontend-learning-project-5.justfile --choose

alias rb := run-backend

# 运行后端项目任务
run-backend:
    just -f backend-learning-project/backend-learning-project.justfile --choose

alias f := fetch

# 从所有远程仓库获取更新
fetch:
    git fetch --all --verbose

alias p := pull

# 从 origin 拉取 main 分支
pull: fetch
    git pull origin main

alias pu := push

# 推送 main 分支到 origin, gitcode, gitee 远程仓库
push: pull
    git push origin main
    git push gitcode main
    git push gitee main

alias ca := clear-all

# 清理全部项目
clear-all:
    just -f frontend-learning-project-2/frontend-learning-project-2.justfile clear-project-2
    just -f frontend-learning-project-3/frontend-learning-project-3.justfile clear-project-3
    just -f frontend-learning-project-4/frontend-learning-project-4.justfile clear-project-4
    just -f frontend-learning-project-5/frontend-learning-project-5.justfile clear-project-5
    just -f backend-learning-project/backend-learning-project.justfile clear-backend

alias fmt := format

# 格式化前端项目代码
format:
    npx prettier --write .

# 创建 tmux 窗口
tmux:
    #!/usr/bin/env sh
    TMUX_SESSION_NAME=fl
    echo "检查并启动 tmux 会话[${TMUX_SESSION_NAME}]..."
    # 检查是否已经处于 tmux 会话中
    if [ -n "$TMUX" ]; then
        echo "已在 tmux 会话中，直接连接到 ${TMUX_SESSION_NAME} 会话..."
        tmux switch-client -t ${TMUX_SESSION_NAME} 2>/dev/null || tmux new-session -d -s ${TMUX_SESSION_NAME} && tmux switch-client -t ${TMUX_SESSION_NAME}
    else
        # 检查 ${TMUX_SESSION_NAME} 会话是否存在
        if ! tmux has-session -t ${TMUX_SESSION_NAME} 2>/dev/null; then
            echo "创建新的 tmux 会话 ${TMUX_SESSION_NAME}..."
            tmux new-session -d -s ${TMUX_SESSION_NAME}
        else
            echo "tmux 会话 ${TMUX_SESSION_NAME} 已存在"
        fi
        echo "连接到 tmux 会话 ${TMUX_SESSION_NAME}..."
        tmux attach -t ${TMUX_SESSION_NAME}
    fi

alias kp := kill-port

# 交互式查询并关闭指定端口监听进程
kill-port:
    #!/usr/bin/env sh
    # 使用 gum input 获取端口，默认显示 8080
    PORT=$(gum input --value="8080" --placeholder="8080" --prompt="端口: " --header="请输入要查询的端口号")
    echo "正在查询端口 ${PORT} 的监听进程..."
    # 使用 lsof 仅查询处于 LISTEN 状态的本地监听进程，跳过标题行
    INFO=$(lsof -i TCP:"${PORT}" -P -n -sTCP:LISTEN 2>/dev/null | tail -n +2)
    if [ -z "$INFO" ]; then
        echo "端口 ${PORT} 没有处于监听状态的服务"
        exit 0
    fi
    echo "端口 ${PORT} 的监听进程信息："
    echo "$INFO"
    # 提取监听进程的 PID
    PID=$(echo "$INFO" | head -n 1 | awk '{print $2}')
    # 使用 gum confirm 确认是否关闭，--default=false 表示默认选中取消
    if gum confirm "是否关闭端口 ${PORT} 上的监听进程 (PID: ${PID})？" --default=false --affirmative="关闭" --negative="取消"; then
        kill -9 "$PID"
        echo "已关闭进程 ${PID}"
    else
        echo "已取消关闭操作"
    fi
