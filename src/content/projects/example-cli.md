---
title: 示例项目：命令行工具
description: 一个把重复劳动压缩成一条命令的小工具。用来演示项目卡片在列表里的排布效果。
year: 2025
stack:
  - Rust
  - CLI
status: wip
role: 独立开发
highlights:
  - 单文件二进制，无运行时依赖，扔到任何机器上都能跑
  - 启动耗时在毫秒级 —— 这是它被塞进脚本、一天调用几百次的前提
  - 所有子命令支持 --dry-run，先看清楚要动什么再执行
order: 2
repo: https://github.com/yourname/example-cli
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
