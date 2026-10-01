import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 起，从 'astro:content' 导出的 z 已被标记弃用，正确来源是 'astro/zod'
import { z } from 'astro/zod';

// Astro 7 内置 Zod v4：顶层校验器（z.url() / z.email()）取代了 zod3 的
// z.string().url() 链式写法。
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 首页「精选」标记
    featured: z.boolean().default(false),
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
    // 数字越小越靠前
    order: z.number().default(999),
  }),
});

export const collections = { blog, projects };
