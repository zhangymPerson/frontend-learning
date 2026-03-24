# https://just.systems

set unstable := true

default:
    just --fmt
    just --list

run:
    just $(just --list | gum filter --no-limit | awk '{print $1}')

alias r1 := run-project-1

# 运行前端项目1
run-project-1:
    cd frontend-learning-project-1 && uv run python3 -m http.server 8080

alias f := fetch

# 从所有远程仓库获取更新
fetch:
    git fetch --all --verbose

alias p := pull

# 从 origin 拉取 main 分支
pull:
    git pull origin main

alias pu := push

# 推送 main 分支到 origin, gitcode, gitee 远程仓库
push:
    git push origin main
    git push gitcode main
    git push gitee main

alias c2 := clear-project-2

clear-project-2:
    rm -rf frontend-learning-project-2/js

alias b2 := build-project-2

build-project-2: clear-project-2
    cd frontend-learning-project-2 && tsc

alias r2 := run-project-2

run-project-2: build-project-2
    cd frontend-learning-project-2 && uv run python3 -m http.server 8080

alias c3 := clear-project-3

clear-project-3:
    rm -rf frontend-learning-project-3/dist
    rm -rf frontend-learning-project-3/node_modules/.vite

alias b3 := build-project-3

build-project-3: clear-project-3
    cd frontend-learning-project-3 && npm run build

alias r3 := run-project-3

run-project-3:
    cd frontend-learning-project-3 && npm run dev

alias ca := clear-all

# 清理全部项目
clear-all: clear-project-2 clear-project-3

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
