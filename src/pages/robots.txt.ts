import type { APIContext } from 'astro';
import { SITE } from '../lib/site';

export function GET(context: APIContext) {
  // context.site 的类型是 URL | undefined，而 SITE.url 是字符串，
  // 统一走一次 new URL() 再取 href，避免在 string 上访问 .href。
  const base = new URL(context.site ?? SITE.url).href.replace(/\/$/, '');

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${base}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
