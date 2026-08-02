export const site = {
  domain: 'arayucofe.com.cn',
  nameZh: '何森',
  nameEn: 'FREID',
  email: 'rklnoomad@outlook.com',
  linkedIn: '',
  github: '',
};

export type Lang = 'zh' | 'en';

export const copy = {
  zh: {
    langLabel: 'EN',
    langHref: '/en/',
    nav: [
      { label: '研究', href: '/#research' },
      { label: '方法', href: '/#capabilities' },
      { label: '文章', href: '/insights/' },
      { label: '关于', href: '/#about' },
    ],
    footerLine: '工业现场 × 系统构建 × AI 落地',
  },
  en: {
    langLabel: '中文',
    langHref: '/',
    nav: [
      { label: 'Research', href: '/en/#research' },
      { label: 'Method', href: '/en/#capabilities' },
      { label: 'Insights', href: '/en/insights/' },
      { label: 'About', href: '/en/#about' },
    ],
    footerLine: 'Industrial reality × System building × Applied AI',
  },
} satisfies Record<Lang, unknown>;
