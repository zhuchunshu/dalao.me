import { z } from 'astro/zod';
import siteData from '../data/site.json';

/**
 * 站点配置的唯一数据源是 src/data/site.json。
 * 本文件负责：读取 → 校验 → 导出带类型的 SITE 对象。
 *
 * 为什么数据在 JSON 而不在这里？
 * 因为后台（/admin）只能编辑数据文件，改不了 TypeScript。
 * 把它做成 JSON 后，站点信息既能在后台点点改，也能直接手改，
 * 而下面的 Zod schema 保证改错了会在构建时立刻报错，而不是静默产出空页面。
 */

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const socialSchema = linkSchema.extend({
  /** 图标名，可选值见 src/components/Icon.astro 的 ICONS；未知名字会自动回退为 link */
  icon: z.string().default('link'),
});

const siteSchema = z.object({
  /** 站点根地址，必须是完整 URL（含 https://），用于 canonical / sitemap / RSS */
  url: z.url(),
  /** 站点名，显示在浏览器标签与页头 */
  title: z.string(),
  /** 首页副标题 / 一句话介绍 */
  tagline: z.string(),
  /** 默认 SEO 描述 */
  description: z.string(),
  /** 页面语言 */
  lang: z.string().default('zh-CN'),

  author: z.object({
    name: z.string(),
    /** 身份标签，如 Developer / 设计师 */
    role: z.string().default(''),
    /** 个人简介，数组每一项是一个段落 */
    bio: z.array(z.string()).default([]),
    /** 所在地，留空则不显示 */
    location: z.string().default(''),
    email: z.string().default(''),
    /** 头像路径，如 /avatar.jpg；留空则回退为姓名首字 */
    avatar: z.string().default(''),
  }),

  socials: z.array(socialSchema).default([]),
  nav: z.array(linkSchema).default([]),

  /** 首页各区块的开关 */
  sections: z
    .object({
      showProjects: z.boolean().default(true),
      showFeaturedPosts: z.boolean().default(true),
      showLatestPosts: z.boolean().default(true),
    })
    .prefault({}),

  /** 首页细节 */
  home: z
    .object({
      primaryCta: linkSchema.default({ label: '看看项目', href: '/projects/' }),
      secondaryCta: linkSchema.default({ label: '读文章', href: '/blog/' }),
      /** 首页项目区最多显示几个 */
      projectsCount: z.number().int().positive().default(4),
      /** 首页「最新文章」最多显示几篇 */
      latestPostsCount: z.number().int().positive().default(6),
    })
    .prefault({}),

  footer: z
    .object({
      /** 版权署名，留空则用 author.name */
      copyright: z.string().default(''),
      /** 备案号等附加信息，留空则不显示 */
      extra: z.string().default(''),
    })
    .prefault({}),
});

export type SiteConfig = z.infer<typeof siteSchema>;
export type SocialLink = z.infer<typeof socialSchema>;
export type NavItem = z.infer<typeof linkSchema>;

const result = siteSchema.safeParse(siteData);

if (!result.success) {
  // 让配置写错时给出能直接定位到字段的报错，而不是一句笼统的构建失败
  const issues = result.error.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : '(根对象)';
      return `  · ${path} —— ${issue.message}`;
    })
    .join('\n');

  throw new Error(
    `src/data/site.json 校验未通过：\n${issues}\n\n` +
      `请修正该文件后重新构建。也可以在本地运行 pnpm dev 后打开 /admin 用后台修改。`,
  );
}

export const SITE: SiteConfig = result.data;
export default SITE;
