# https://just.systems

set unstable := true

default:
    just --list

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
