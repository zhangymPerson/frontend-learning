# 前端项目 1：纯 HTML + CSS + JavaScript

alias r := run-project-1

# 运行前端项目1
run-project-1:
    @echo "本地访问地址: http://localhost:8080"
    uv run python3 -m http.server 8080
