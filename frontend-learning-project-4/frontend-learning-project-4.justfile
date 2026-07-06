# 前端项目 4：React + TypeScript + Vite

alias c := clear-project-4

# 清理项目 4 构建输出
clear-project-4:
    rm -rf dist
    rm -rf node_modules/.vite

alias b := build-project-4

# 构建项目 4
build-project-4: clear-project-4
    npm run build

alias r := run-project-4

# 运行前端项目4
run-project-4:
    @echo "本地访问地址: http://localhost:3001"
    npm run dev
