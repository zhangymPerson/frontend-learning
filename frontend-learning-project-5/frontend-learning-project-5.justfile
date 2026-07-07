# 前端项目 5：React + TypeScript + Vite + Ant Design

alias c := clear-project-5

# 清理项目 5 构建输出
clear-project-5:
    rm -rf dist
    rm -rf node_modules/.vite

alias b := build-project-5

# 构建项目 5
build-project-5: clear-project-5
    npm run build

alias r := run-project-5

# 运行前端项目 5
run-project-5:
    @echo "本地访问地址: http://localhost:5173"
    npm run dev
