// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署目标：Vercel / Cloudflare Pages —— 纯静态输出，无服务端运行时依赖。
// 若改用 SSR/边缘函数，再按需追加 @astrojs/vercel 或 @astrojs/cloudflare 适配器。
export default defineConfig({
  site: 'https://dalao.me',
  integrations: [sitemap()],
  build: {
    // 静态站直接产出目录式 URL，Vercel 与 Cloudflare 均可零配置识别
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
