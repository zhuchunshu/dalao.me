# dalao.me

个人网站。[Astro](https://astro.build) 构建，输出纯静态文件，可部署到 **Vercel** 或 **Cloudflare Pages** —— 不需要买服务器，域名之外没有第二笔支出。

自带一个**可视化后台**：打开 `/admin` 就能写文章、加项目、改站点配置，改完自动提交到 Git 并触发重新部署。后台本身不占任何服务器资源。

## 特性

- 纯静态输出，零服务端运行时
- **可视化后台**，内容与站点配置都能点着改
- 后台无需 OAuth 服务器、无需数据库，用 GitHub 令牌即开即用
- 深色 / 浅色主题，首帧不闪烁，可跟随系统
- 文章 / 项目 / 自定义页面 / 标签 / RSS / sitemap / 404 齐全
- 内容模型可扩展：加一个字段只需改两处
- 零 CSS 框架、零客户端 JS 框架

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

## 后台

后台是 [Sveltia CMS](https://sveltiacms.app)：一个从 CDN 加载的单文件应用，直接读写仓库里的 Markdown 与 JSON 文件。它不依赖任何后端服务 —— **没有数据库、没有 API 服务器、没有需要付费的东西**。

### 线上使用（部署之后）

1. 先按下面的「部署」把站点发上去
2. 打开 `https://dalao.me/admin/`
3. 点 **使用访问令牌登录**，粘一个 GitHub Personal Access Token

生成令牌时勾选权限：

| 令牌类型 | 需要的权限 |
| --- | --- |
| Fine-grained | **Contents: Read and write**（若用编辑流程，再加 **Pull requests: Read and write**）|
| Classic | `repo` 整个范围 |

保存后即可在任意设备、任意浏览器上管理内容。令牌只存在你自己浏览器的本地存储里，不会上传到任何第三方。

> 后台登录页也提供 GitHub OAuth 登录按钮，但那条路要注册 OAuth App 并额外部署一个认证服务。用令牌登录就够了，不必折腾。

### 本地使用（推荐日常写作）

本地方式**连登录都不需要**，直接改磁盘上的文件：

```bash
pnpm dev
```

然后在 **Chrome / Edge / Brave**（必须基于 Chromium，它依赖 File System Access API）打开：

```
http://localhost:4321/admin/index.html
```

点「使用本地仓库」，在弹出的对话框里选中项目根目录。之后所有改动都落在本地文件上，你自己 `git commit` 决定什么时候提交。

> 地址必须带上 `index.html`，否则开发服务器会把它当页面热重载，边改边刷新。

### 登录前要改的一处

`public/admin/config.yml` 里的 `repo` 现在是占位值，改成你自己的仓库：

```yaml
backend:
  name: github
  repo: 你的用户名/dalao.me
  branch: main
```

---

## 内容与字段

后台侧边栏有四类内容，全部可增删改：

| 内容类型 | 存放位置 | 生成的路由 |
| --- | --- | --- |
| 文章 | `src/content/blog/*.md` | `/blog/文件名/` |
| 项目 | `src/content/projects/*.md` | `/projects/文件名/` |
| 自定义页面 | `src/content/pages/*.md` | `/文件名/` |
| 站点设置 | `src/data/site.json` | 全站 |

### 文章字段

`标题`、`摘要`、`发布日期`、`修订日期`、`标签`、`草稿`、`精选`、`置顶`、`封面图`、`所属系列`、`SEO 标题`、`SEO 描述`、`原文链接`、`正文`。

其中几个值得单独说明：

- **草稿**：打开后只在本地预览可见，不会进入线上构建
- **置顶**：排在文章列表最前面
- **原文链接**：文章首发在其他平台时填写，会输出指向原文的 canonical，避免被判定为重复内容
- **SEO 标题 / 描述**：留空就用「标题」和「摘要」

### 项目字段

`名称`、`简介`、`年份`、`技术栈`、`状态`、`担任角色`、`亮点`、`图集`、`源码地址`、`在线地址`、`精选`、`排序权重`、`说明`。

**状态**有三个选项：维护中 / 开发中 / 已归档。默认的「维护中」不显示徽章，另外两种会在卡片上标出来。

### 自定义页面

用来放 `/uses/`、`/friends/` 这类固定网址的页面，和文章一样用 Markdown 写。

文件名决定网址：`uses.md` → `/uses/`。**避免使用 `about`、`blog`、`projects`、`tags` 这几个已被占用的名字** —— Astro 中静态路由优先，同名的新页面不会生效。

### 加一个新字段

只改两个地方，字段就会同时出现在后台表单和构建校验里：

1. `src/content.config.ts` —— 加校验规则（类型、是否必填、默认值）
2. `public/admin/config.yml` —— 在对应 collection 的 `fields` 里加表单项

比如给文章加一个「阅读难度」：

```ts
// src/content.config.ts
difficulty: z.enum(['入门', '进阶', '深入']).default('入门'),
```

```yaml
# public/admin/config.yml，放在 blog 的 fields 里
- name: difficulty
  label: 阅读难度
  widget: select
  default: 入门
  options: [入门, 进阶, 深入]
```

字段名两边必须一致。之后在页面上用 `post.data.difficulty` 取用即可。

**改错会怎样？** 构建会立刻失败，并把出问题的字段名和原因打出来 —— 而不是静默生成一个空页面。

### 站点设置

对应 `src/data/site.json`，包含站点名、副标题、作者信息、社交链接、导航、首页区块开关、首页按钮与数量、页脚。这个文件由 `src/lib/site.ts` 用 Zod 校验，错填会给出可定位的报错：

```
src/data/site.json 校验未通过：
  · url —— Invalid URL
  · author.name —— Required
```

---

## 部署

两种方式都免费，推荐 **Git 集成**：以后 `git push` 自动上线，后台保存内容也会自动触发。

### 方案 A：Vercel

1. 推到 GitHub
2. 打开 [vercel.com/new](https://vercel.com/new) 导入仓库，自动识别 Astro，直接 Deploy
3. **Settings → Domains** 添加 `dalao.me`，按提示配置 DNS

命令行方式：`npx vercel`（预览）/ `npx vercel --prod`（正式）

### 方案 B：Cloudflare Pages

1. 推到 GitHub
2. 控制台 → **Workers & Pages → Create → Pages → Connect to Git**
3. 构建配置：Framework preset `Astro`，Build command `pnpm build`，Output directory `dist`
4. **Custom domains** 添加 `dalao.me`

命令行方式：`pnpm build && npx wrangler pages deploy dist`

### 绑定域名

两个平台都会给出**需要你配置的 DNS 记录**，照抄到域名服务商即可，通常十几分钟生效。记录值以控制台当时显示的为准 —— 平台会调整 IP，别照抄旧教程。

### 部署相关的两个坑

**1. 依赖构建脚本需要显式放行。**

`pnpm@10+` 默认拦截依赖的 `postinstall` 脚本。`pnpm-workspace.yaml` 已放行 `esbuild` 和 `sharp`：

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

以后新增带构建脚本的依赖时，安装会报 `ERR_PNPM_IGNORED_BUILDS`，把包名加进来即可。**这个文件必须一起提交**，否则线上构建会失败。

> 自 pnpm v11 起，写在 `package.json` 的 `pnpm` 字段里**已不再被读取**，必须写在 `pnpm-workspace.yaml`。

**2. 后台不能放在 `src/pages/` 下。**

`public/admin/index.html` 必须保持是静态文件。如果改成 `src/pages/admin.astro`，本地开发时页面会随每次改动热重载，编辑体验会被打断。

---

## 目录结构

```
├─ astro.config.mjs          # 站点地址、集成、代码高亮主题
├─ pnpm-workspace.yaml       # pnpm 设置（含依赖构建白名单）
├─ vercel.json               # Vercel 响应头与缓存策略
├─ wrangler.jsonc            # Cloudflare Pages 配置
├─ public/
│  ├─ admin/
│  │  ├─ index.html          # ★ 后台入口
│  │  └─ config.yml          # ★ 后台配置：内容类型与字段都在这里定义
│  ├─ media/                 # 后台上传的图片存放于此
│  ├─ favicon.svg
│  ├─ og.png                 # 社交分享图，直接替换同名文件即可
│  └─ _headers               # Cloudflare 的响应头配置
└─ src/
   ├─ data/site.json         # ★ 站点配置（可在后台编辑）
   ├─ lib/site.ts            # 站点配置的校验与类型
   ├─ content.config.ts      # ★ 内容字段的校验规则
   ├─ content/
   │  ├─ blog/*.md           # 文章
   │  ├─ projects/*.md       # 项目
   │  └─ pages/*.md          # 自定义页面
   ├─ styles/global.css      # ★ 设计令牌与全站样式
   ├─ layouts/               # 页面骨架、文章页
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
  --accent: #2563eb;      /* 强调色 */
}

:root[data-theme='dark'] {
  --bg: #0a0a0b;
  --text: #f4f4f5;
  --accent: #6ea8fe;
}
```

**加社交图标** —— 在 `src/components/Icon.astro` 的 `ICONS` 里加一条 SVG，然后在后台「站点设置 → 社交链接」里选用。

**换代码高亮主题** —— 改 `astro.config.mjs` 的 `shikiConfig.themes`，取值见 [Shiki 主题列表](https://shiki.style/themes)。

**换分享图** —— 替换 `public/og.png`（建议 1200×630）。

**改字体** —— 改 `global.css` 里的 `--font-sans` / `--font-mono`。默认用系统字体栈，不加载外部字体，因此没有额外网络请求、也没有闪字。

---

## 技术说明

**后台为什么不需要服务器？**
Sveltia CMS 是一个跑在浏览器里的静态应用，它通过 GitHub API 直接提交文件到你的仓库。Git 仓库就是数据库，提交动作就是"保存"。托管平台上没有多出任何进程。

**为什么代码高亮的深色覆盖要带 `!important`？**
Shiki 的双主题输出会把浅色值直接内联成 `style="color:#xxx"`，深色值放进 `--shiki-dark` 变量。内联样式优先级高于任何普通选择器，所以深色覆盖必须带 `!important`，否则深色模式下代码块会停在白底深字、而文字已变浅，直接看不清。

**为什么日期用 UTC getter？**
frontmatter 里的 `2026-01-01` 按 UTC 零点解析。若用本地时间取值，构建机时区不同（本地 UTC+8、平台为 UTC）会产出差一天的日期。

**为什么站点配置是 JSON？**
因为后台只能编辑数据文件，改不了 TypeScript。把它做成 JSON 后，站点信息既能在后台点着改，也能直接手改，而 `src/lib/site.ts` 的 Zod schema 保证改错了会在构建时立刻报错。

**构建产物** —— `dist/` 里就是普通 HTML/CSS，任何静态托管都能直接跑，换平台只需改一个配置文件。
