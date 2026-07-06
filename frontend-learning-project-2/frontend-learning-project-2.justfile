# 前端项目 2：HTML + CSS + TypeScript

alias c := clear-project-2

# 清理项目 2 编译输出
clear-project-2:
    rm -rf js

alias b := build-project-2

# 构建项目 2（TypeScript 编译）
build-project-2: clear-project-2
    tsc

alias r := run-project-2

# 运行前端项目2
run-project-2: build-project-2
    @echo "本地访问地址: http://localhost:8080"
    uv run python3 -m http.server 8080
