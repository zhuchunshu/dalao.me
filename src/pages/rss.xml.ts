import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '../site.config';
import { visiblePosts, sortByDateDesc } from '../lib/utils';

export async function GET(context: APIContext) {
  const posts = sortByDateDesc(visiblePosts(await getCollection('blog')));

  return rss({
    title: SITE.title,
    description: SITE.description,
    // context.site 来自 astro.config.mjs 的 site 字段；缺失时回退到 site.config.ts
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
