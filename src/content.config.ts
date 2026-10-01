import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 起，从 'astro:content' 导出的 z 已被标记弃用，正确来源是 'astro/zod'
import { z } from 'astro/zod';

/**
 * 内容模型定义。
 *
 * 这里的每个字段都会自动出现在后台（/admin）的编辑表单里 ——
 * 想加字段，在下面加一行；想改校验规则（必填/可选/默认值），改这一行即可。
 * 字段名就是 Markdown frontmatter 里的键名。
 *
 * 关于默认值：给 `.default(...)` 的字段在后台是可选的，留空会用默认值；
 * 没有默认值且非 `.optional()` 的字段是必填的，漏填会在构建时直接报错。
 */

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),

    /** 草稿：只在本地预览可见，不参与线上构建 */
    draft: z.boolean().default(false),
    /** 精选：出现在首页「精选文章」区 */
    featured: z.boolean().default(false),
    /** 置顶：排在文章列表最前面 */
    pinned: z.boolean().default(false),

    /** 封面图路径，如 /media/cover.jpg；留空则不显示 */
    cover: z.string().default(''),
    /** 所属系列，用来把同一主题的多篇文章串起来；留空表示不属于任何系列 */
    series: z.string().default(''),

    /** 单独覆盖 SEO 标题（留空则用 title） */
    seoTitle: z.string().default(''),
    /** 单独覆盖 SEO 描述（留空则用 description） */
    seoDescription: z.string().default(''),
    /** 原文链接：文章首发在别处时填写，会输出 canonical 指向原文 */
    canonical: z.string().default(''),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    year: z.union([z.string(), z.number()]).optional(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(999),

    /** 项目状态：active 维护中 / wip 开发中 / archived 已归档 */
    status: z.enum(['active', 'wip', 'archived']).default('active'),
    /** 你在这个项目里担任的角色 */
    role: z.string().default(''),
    /** 亮点条目，显示在项目详情页 */
    highlights: z.array(z.string()).default([]),
    /** 图集：/media/xxx.png，显示在项目详情页正文之后 */
    gallery: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    /** 不希望被搜索引擎收录时打开 */
    noindex: z.boolean().default(false),
    /** 排序用，数字越小越靠前 */
    order: z.number().default(999),
  }),
});

export const collections = { blog, projects, pages };
