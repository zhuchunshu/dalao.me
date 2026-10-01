---
title: 你好，世界
description: 这个站点的第一篇文章，也是一份写作模板说明。
pubDate: 2026-01-01
tags:
  - 随笔
  - 建站
featured: true
---

这是一篇示例文章。你可以直接复制 `src/content/blog/` 下的任意文件来新建一篇。

## 怎么写新文章

在 `src/content/blog/` 里新建一个 `.md` 文件，顶部的 `---` 之间是元信息（frontmatter）：

```yaml
---
title: 文章标题
description: 一句话摘要，会出现在列表和搜索结果里
pubDate: 2026-01-01
tags: [标签一, 标签二]
draft: false      # 改成 true 就只在本地预览，不发布
featured: true    # 首页「精选」区展示
---
```

下面就是正文，用 Markdown 写。

## 代码高亮

代码块自带深浅两套配色，跟随站点主题自动切换：

```ts
export function greet(name: string): string {
  return `你好，${name}`;
}
```

## 表格与引用

| 项目 | 说明 |
| --- | --- |
| 框架 | Astro |
| 部署 | Vercel / Cloudflare Pages |

> 引用的样式同样会自动适配深色与浅色模式。
