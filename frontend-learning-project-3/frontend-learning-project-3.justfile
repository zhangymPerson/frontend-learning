# 前端项目 3：Vue 3 + TypeScript + Vite + Pinia + Vue Router

alias c := clear-project-3

# 清理项目 3 构建输出
clear-project-3:
    rm -rf dist
    rm -rf node_modules/.vite

alias b := build-project-3

# 构建项目 3
build-project-3: clear-project-3
    npm run build

alias r := run-project-3

# 运行前端项目3
run-project-3:
    @echo "本地访问地址: http://localhost:3000"
    npm run dev
