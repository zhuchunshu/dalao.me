/**
 * 站点全部可配置项集中于此。
 * 换名字、换简介、换社交链接、调导航 —— 只改这一个文件即可，无需碰任何组件。
 */

export interface SocialLink {
  /** 显示名 */
  label: string;
  /** 完整链接 */
  href: string;
  /** 内联 SVG 图标名，见 src/components/Icon.astro（github / x / mail / rss / telegram / zhihu / bilibili / link） */
  icon: string;
}

export interface SiteConfig {
  /** 站点根地址：与 astro.config.mjs 的 site 保持一致，用于 canonical / sitemap / RSS */
  url: string;
  /** 站点标题，显示在浏览器标签与首页大标题 */
  title: string;
  /** 首页副标题 / 一句话介绍 */
  tagline: string;
  /** 默认 SEO 描述 */
  description: string;
  /** 页面语言，中文站填 zh-CN */
  lang: string;
  /** 作者信息 */
  author: {
    name: string;
    /** 职业/身份标签，会显示在首页 */
    role: string;
    /** 个人简介，支持多段 */
    bio: string[];
    /** 所在地，留空则不显示 */
    location?: string;
    email?: string;
    /** 头像图片地址：放到 public/ 下再填 /avatar.jpg 即可，留空则用姓名首字母字母块 */
    avatar?: string;
  };
  /** 社交链接，增删条目即可 */
  socials: SocialLink[];
  /** 顶部导航 */
  nav: { label: string; href: string }[];
  /** 首页各区块开关与说明 */
  sections: {
    showProjects: boolean;
    showFeaturedPosts: boolean;
    showLatestPosts: boolean;
  };
  /** 页脚 */
  footer: {
    /** 版权归属显示名，留空则用 author.name */
    copyright?: string;
    /** 备案号等附加信息，留空不显示 */
    extra?: string;
  };
}

export const SITE: SiteConfig = {
  url: 'https://dalao.me',
  title: 'dalao',
  tagline: '写代码，也写点别的。',
  description: 'dalao 的个人网站 —— 记录项目、文章与正在琢磨的事情。',
  lang: 'zh-CN',

  author: {
    name: 'dalao',
    role: 'Developer',
    bio: [
      '你好，我是 dalao。这里是我的个人角落，用来放一些做完的项目、想明白的事情，以及还没想明白的。',
      '如果你对这里的东西感兴趣，欢迎通过下面的方式找到我。',
    ],
    // location: 'Earth',
    email: 'hi@dalao.me',
    // avatar: '/avatar.jpg',
  },

  socials: [
    { label: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
    { label: 'X', href: 'https://x.com/yourname', icon: 'x' },
    { label: 'Email', href: 'mailto:hi@dalao.me', icon: 'mail' },
    { label: 'RSS', href: '/rss.xml', icon: 'rss' },
  ],

  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog/' },
    { label: '项目', href: '/projects/' },
    { label: '关于', href: '/about/' },
  ],

  sections: {
    showProjects: true,
    showFeaturedPosts: true,
    showLatestPosts: true,
  },

  footer: {
    // copyright: 'dalao',
    // extra: '京ICP备00000000号',
  },
};

export default SITE;
