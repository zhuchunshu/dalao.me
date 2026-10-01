# dalao.me

个人网站。[Astro](https://astro.build) 构建，输出纯静态文件，可部署到 **Vercel** 或 **Cloudflare Pages** —— 不需要买服务器，域名之外没有第二笔支出。

## 特性

- 纯静态输出，零服务端运行时
- 深浅主题，首帧不闪烁，可跟随系统
- 文章 / 项目 / 标签 / RSS / sitemap / 404 齐全
- 全部个人信息集中在**一个**配置文件里
- 零 CSS 框架、零客户端 JS 框架 —— 全站 JavaScript 只有两小段，都服务于主题切换
- 响应式，含打印样式与无障碍标签

---

## 快速开始

需要 **Node.js >= 22.12** 与 **pnpm >= 7**。

```bash
pnpm install
pnpm dev        # 本地开发，http://localhost:4321
pnpm build      # 构建，产物在 dist/
pnpm preview    # 本地预览构建产物
pnpm check      # 类型检查
```

---

## 改内容：只有三件事

### 1. 改个人信息

编辑 **`src/site.config.ts`**，站点所有可配置项都在这里，不用碰任何组件：

| 字段 | 作用 |
| --- | --- |
| `url` | 站点地址，务必与 `astro.config.mjs` 里的 `site` 一致 |
| `title` / `tagline` / `description` | 站点名、首页副标题、默认 SEO 描述 |
| `author.name` / `role` / `bio` | 首页显示的姓名、身份、简介段落 |
| `author.avatar` | 头像：把图片放进 `public/`，这里填 `/avatar.jpg`；留空则用姓名首字 |
| `author.email` / `location` | 联系方式与所在地（可选） |
| `socials` | 社交链接，增删条目即可 |
| `nav` | 顶部导航 |
| `sections` | 首页各区块开关 |
| `footer.copyright` / `footer.extra` | 页脚署名与备案号 |

### 2. 写文章

在 `src/content/blog/` 新建 `.md` 文件：

```markdown
---
title: 文章标题
description: 一句话摘要，会出现在列表与搜索结果里
pubDate: 2026-01-01
tags: [标签一, 标签二]
draft: false      # true 则只在本地可见，不参与线上构建
featured: true    # 出现在首页「精选文章」区
---

正文用 Markdown 写。
```

文件名即网址：`hello-world.md` → `/blog/hello-world/`。

### 3. 加项目

在 `src/content/projects/` 新建 `.md` 文件：

```markdown
---
title: 项目名
description: 一句话说明
year: 2026
stack: [Astro, TypeScript]
repo: https://github.com/you/repo   # 可选
demo: https://example.com           # 可选
featured: true                      # 首页项目区优先展示
order: 1                            # 越小越靠前
---
```

字段写错或漏填必填项时，**构建会直接失败并指出是哪一行** —— 不会静默生成空页面。

---

## 部署

两种方式都是免费的，任选其一。推荐用 **Git 集成**：以后 `git push` 就自动上线。

### 方案 A：Vercel

**A-1 网页导入（推荐）**

1. 把项目推到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new)，导入该仓库
3. Vercel 会自动识别 Astro，直接点 Deploy
4. 部署完成后进入 **Settings → Domains**，添加 `dalao.me`，按提示在你的域名服务商处配置 DNS 记录

**A-2 命令行**

```bash
npx vercel          # 预览部署
npx vercel --prod   # 正式部署
```

### 方案 B：Cloudflare Pages

**B-1 网页导入（推荐）**

1. 把项目推到 GitHub
2. 打开 Cloudflare 控制台 → **Workers & Pages → Create → Pages → Connect to Git**
3. 选择仓库，构建配置：
   - Framework preset：`Astro`
   - Build command：`pnpm build`
   - Build output directory：`dist`
4. 部署完成后进入 **Custom domains**，添加 `dalao.me`

**B-2 命令行**

```bash
pnpm build
npx wrangler pages deploy dist
```

项目名已在 `wrangler.jsonc` 里配好（`dalao-me`）。首次运行会要求登录 Cloudflare。

### 绑定域名

两个平台都会在控制台给出**需要配置的 DNS 记录**，照抄到你的域名服务商即可，通常十几分钟生效：

- **根域 `dalao.me`**：平台会给出 A 记录或要求把 NS 托管给平台
- **子域 `www.dalao.me`**：通常是 CNAME 记录

> 记录值请以控制台当时显示的为准 —— 平台会调整 IP，别照抄旧教程里的地址。

### 部署相关的两个坑

**1. 依赖构建脚本需要显式放行。**

`pnpm@10+` 默认拦截依赖的 `postinstall` 脚本。本项目的 `pnpm-workspace.yaml` 已经放行了 `esbuild` 和 `sharp`：

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

如果以后新增了带构建脚本的依赖，安装时会报 `ERR_PNPM_IGNORED_BUILDS`，把包名加进这个文件即可。**这个文件必须一起提交**，否则线上构建会失败。

> 注意：自 pnpm v11 起，设置在 `package.json` 的 `pnpm` 字段里**已不再被读取**，必须写在 `pnpm-workspace.yaml`。

**2. Node 版本。**

`package.json` 的 `engines` 已声明 `>=22.12.0`，`.nvmrc` 也已提供。若平台默认版本过低，在平台设置里指定 Node 22+ 即可。

---

## 目录结构

```
├─ astro.config.mjs          # 站点地址、集成、代码高亮主题
├─ pnpm-workspace.yaml       # pnpm 设置（含依赖构建白名单）
├─ vercel.json               # Vercel 安全响应头与缓存策略
├─ wrangler.jsonc            # Cloudflare Pages 配置
├─ public/
│  ├─ favicon.svg
│  ├─ og.png                 # 社交分享图，直接替换同名文件即可
│  └─ _headers               # Cloudflare 的响应头配置
└─ src/
   ├─ site.config.ts         # ★ 个人信息都在这
   ├─ content.config.ts      # 内容集合的字段校验规则
   ├─ content/
   │  ├─ blog/*.md           # 文章
   │  └─ projects/*.md       # 项目
   ├─ styles/global.css      # ★ 设计令牌与全站样式
   ├─ layouts/
   │  ├─ BaseLayout.astro    # 页面骨架、主题初始化
   │  └─ PostLayout.astro    # 文章页
   ├─ components/            # 图标、导航、页脚、SEO
   ├─ lib/utils.ts           # 日期、排序、标签等工具
   └─ pages/                 # 路由
```

---

## 自定义

**换配色** —— 只改 `src/styles/global.css` 顶部的两组变量：

```css
:root {
  --bg: #ffffff;
  --text: #18181b;
  --accent: #2563eb;   /* 强调色 */
}

:root[data-theme='dark'] {
  --bg: #0a0a0b;
  --text: #f4f4f5;
  --accent: #6ea8fe;
}
```

**加社交图标** —— 在 `src/components/Icon.astro` 的 `ICONS` 对象里加一条 SVG，然后在 `site.config.ts` 的 `socials` 里用同一个名字。

**换代码高亮主题** —— 改 `astro.config.mjs` 里的 `shikiConfig.themes`，取值见 [Shiki 主题列表](https://shiki.style/themes)。

**换分享图** —— 替换 `public/og.png`（建议 1200×630）。

**改字体** —— `global.css` 里改 `--font-sans` / `--font-mono`。默认用系统字体栈，不加载外部字体，因此没有网络请求、没有闪字。

---

## 技术说明

**为什么代码高亮的深色覆盖要带 `!important`？**
Shiki 的双主题输出会把浅色值直接内联成 `style="color:#xxx"`，深色值放进 `--shiki-dark` 变量。内联样式优先级高于任何普通选择器，所以 `global.css` 里深色覆盖必须带 `!important`，否则深色模式下代码块会停在白底深字、而文字已变浅，直接看不清。

**为什么日期用 UTC getter？**
frontmatter 里的 `2026-01-01` 按 UTC 零点解析。若用本地时间取值，构建机时区不同（本地 UTC+8、平台为 UTC）会产出差一天的日期。

**构建产物** —— `dist/` 里就是普通 HTML/CSS，任何静态托管都能直接跑，换平台只需改一个配置文件。
