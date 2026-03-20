# https://just.systems

set unstable := true

default:
    just --list

alias r1 := run-project-1

# 运行前端项目1
run-project-1:
    cd frontend-learning-project-1 && uv run python3 -m http.server 8080

alias c2 := clear-project-2

clear-project-2:
    rm -rf frontend-learning-project-2/js

alias b2 := build-project-2

build-project-2: clear-project-2
    cd frontend-learning-project-2 && tsc

alias r2 := run-project-2

run-project-2: build-project-2
    cd frontend-learning-project-2 && uv run python3 -m http.server 8080
