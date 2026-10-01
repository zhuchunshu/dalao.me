---
title: dalao.me
description: 就是你现在看到的这个站点 —— Astro 构建的纯静态个人主页，部署在边缘网络上，零服务器成本。
year: 2026
stack:
  - Astro
  - TypeScript
  - CSS
status: active
role: 独立开发
highlights:
  - 自带可视化后台，内容与站点配置都能点着改，且不需要任何服务器
  - 构建产物是纯静态文件，托管在 Vercel / Cloudflare 上，月成本为 0
  - 全站样式由一组 CSS 变量驱动，换配色只需要改十几行
  - 构建时校验所有内容字段，写错会直接报错而不是静默生成空页面
featured: true
order: 1
repo: https://github.com/yourname/dalao.me
---

## 为什么这么做

个人站点最容易死在一个地方：**维护**。租一台服务器，就得处理续费、系统更新、证书到期、被扫端口、被挖矿。热情撑不过三个月。

所以这个站的前提是：**没有任何东西需要我操心**。

- 构建产出纯静态文件，交给 Vercel / Cloudflare 的全球网络分发
- 没有数据库、没有后端接口、没有运行时
- 掏空钱包的成本：0 元。域名之外，没有第二笔支出

## 技术选择

**Astro**。它的默认输出就是零 JavaScript 的 HTML，只在真正需要交互的地方加载脚本 —— 这个站上唯一的一段 JS 是主题切换按钮。

**手写 CSS，没有用框架**。全站样式由 `:root` 里的一组 CSS 变量驱动，改配色只需要动十几行。省掉了构建链里的一层，也省掉了半年后升级依赖的麻烦。

**Content Collections**。文章和项目都是 `src/content/` 下的 Markdown 文件，frontmatter 用 Zod 校验 —— 写错字段名，构建会直接失败并告诉你哪里错了，而不是静默生成一个空页面。

## 部署

推到 GitHub，连上 Vercel 或 Cloudflare Pages，完事。之后每次 push 自动重新构建，几十秒后全球生效。

## 成本结构

| 项目 | 费用 |
| --- | --- |
| 托管 | 0 |
| TLS 证书 | 0（自动签发续期）|
| CDN | 0 |
| 域名 | 约 ¥70 / 年 |

这就是全部。
