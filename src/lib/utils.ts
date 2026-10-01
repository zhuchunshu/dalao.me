import type { CollectionEntry } from 'astro:content';

/**
 * 日期格式化统一使用 UTC getter。
 * 原因：frontmatter 里的 `pubDate: 2026-01-01` 被解析为 UTC 零点，
 * 若用本地 getter，构建机时区不同（本地 UTC+8 / Vercel 与 Cloudflare 为 UTC）
 * 会产出差一天的日期。UTC getter 让任何环境结果一致。
 */
export function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 长格式：2026 年 1 月 1 日 */
export function formatDateLong(date: Date): string {
  return `${date.getUTCFullYear()} 年 ${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`;
}

/** 供 <time datetime="..."> 使用的机器可读格式 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * 粗略阅读时长：中文按字符数、英文按词数估算。
 * 只用于展示，不追求精确。
 */
export function readingTime(body: string | undefined): string {
  if (!body) return '1 分钟';
  const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/\s+/g, ' ');
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length;
  // 中文约 400 字/分钟，英文约 220 词/分钟
  const minutes = Math.max(1, Math.round(cjk / 400 + words / 220));
  return `${minutes} 分钟`;
}

/**
 * 排序：置顶优先，然后按发布日期倒序；
 * 同日期时按标题稳定排序，避免不同机器构建顺序不一致。
 * pinned 是可选字段，没有它的集合（如项目）照常按日期排。
 */
export function sortByDateDesc<
  T extends { data: { pubDate: Date; title: string; pinned?: boolean } },
>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const pinned = Number(b.data.pinned ?? false) - Number(a.data.pinned ?? false);
    if (pinned !== 0) return pinned;

    const diff = b.data.pubDate.getTime() - a.data.pubDate.getTime();
    return diff !== 0 ? diff : a.data.title.localeCompare(b.data.title, 'zh-CN');
  });
}

/**
 * 过滤草稿：生产构建排除 draft，开发环境保留以便本地预览。
 */
export function visiblePosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return import.meta.env.PROD ? posts.filter((p) => !p.data.draft) : posts;
}

/** 收集全部标签及计数，按出现次数降序 */
export function collectTags(posts: CollectionEntry<'blog'>[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

/** 取姓名首字符作为头像兜底（中文取首字，英文取首字母，最多两位） */
export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  if (/[\u4e00-\u9fa5]/.test(trimmed[0]!)) return trimmed.slice(0, 1);
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** 拼接站内绝对地址 */
export function absoluteUrl(path: string, site: string): string {
  const base = site.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

/**
 * 项目状态 → 中文标签。
 * active 是默认值，界面上不显示徽章，免得每张卡都挂一个「维护中」。
 */
export const PROJECT_STATUS: Record<string, string> = {
  active: '维护中',
  wip: '开发中',
  archived: '已归档',
};

/** 取状态徽章文案；默认状态或未知值返回空字符串，调用处据此决定是否渲染 */
export function statusLabel(status: string): string {
  return status === 'active' ? '' : (PROJECT_STATUS[status] ?? '');
}
