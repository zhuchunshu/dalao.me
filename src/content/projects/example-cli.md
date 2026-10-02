---
title: sforum
description: 高性能模块化现代论坛程序
year: '2022'
stack:
  - Go
  - Javascript
  - Vue
status: wip
role: 独立开发
highlights:
  - 所有子命令支持 --dry-run，先看清楚要动什么再执行
gallery: []
repo: https://github.com/zhuchunshu/SForum
demo: ''
featured: false
order: 2
---

## 它解决什么

每天要重复执行的一串命令，被打包成一个带子命令的 CLI。

```bash
example-cli init --template minimal
example-cli sync --dry-run
example-cli sync
```

## 为什么选 Rust

单文件二进制，没有运行时依赖，扔到任何一台机器上都能跑。启动耗时在毫秒级 —— 这对一个会被塞进脚本、一天调用几百次的工具来说才是关键指标。

## 怎么改这个文件

这是示例内容。把它删掉，换成一个你真正做过的项目：

1. 在 `src/content/projects/` 下新建 `.md`
2. 填好 frontmatter（`title`、`description` 必填；`stack`、`repo`、`demo`、`year` 可选）
3. `order` 决定排序，数字越小越靠前
