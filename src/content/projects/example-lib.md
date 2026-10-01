---
title: 示例项目：开源库
description: 一个被别的项目依赖的小库。演示「精选」标记与在线预览链接如何呈现。
year: 2024
stack:
  - TypeScript
  - Node.js
order: 3
demo: https://example.com
repo: https://github.com/yourname/example-lib
---

## 概览

一个解决单一问题、只做一件事的库。README 里通常会写清楚：解决什么问题、为什么不用现成的、以及三行安装使用示例。

## 安装

```bash
npm install example-lib
```

## 使用

```ts
import { solve } from 'example-lib';

const result = solve({ input: 'something' });
```

## 设计取舍

写这类项目最容易犯的错是范围蔓延。它的边界就是：**只解决一个问题，并把它解决好**。想加的功能先写进 issue，攒够三个真实需求再考虑动手。
