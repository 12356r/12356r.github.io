import type { SourceRef } from './types';

/** 站点级配置与来源声明：所有事实性内容都应能追溯到这里列出的来源。 */

export const SITE = {
  name: '郑州大学校园探索',
  nameEn: 'Zhengzhou University Campus Explorer',
  tagline: '遇见郑大，遇见更好的自己',
  taglineEn: 'Explore the campus. Discover the story.',
  description:
    '从一处风景开始，探索郑州大学的校园生活与人文故事。校园风光、校园地图、宿舍、美食、社团与学院专业，一站浏览。',
  disclaimer: '本网站为校园文化与信息导览项目，非郑州大学官方网站。',
  updatedAt: '2026-10-20',
  feedbackMail: 'campus-explorer@example.com',
};

export const SOURCES: Record<string, SourceRef> = {
  intro: {
    label: '郑州大学 · 学校简介（数据更新截至 2026 年 6 月）',
    url: 'https://www15.zzu.edu.cn/xxgk/xxjj.htm',
  },
  home: { label: '郑州大学官网', url: 'https://www15.zzu.edu.cn/' },
  library: { label: '郑州大学图书馆', url: 'https://library.zzu.edu.cn/' },
  departmentsHumanities: {
    label: '郑州大学 · 文科院系',
    url: 'https://www15.zzu.edu.cn/yxzy/wkyx1.htm',
  },
  departmentsEngineering: {
    label: '郑州大学 · 理工院系',
    url: 'https://www15.zzu.edu.cn/yxzy/lgyx1.htm',
  },
  departmentsMedical: {
    label: '郑州大学 · 河南医学院',
    url: 'https://www15.zzu.edu.cn/yxzy/hnyxy2.htm',
  },
  campusService: { label: '郑州大学 · 校园服务', url: 'https://www15.zzu.edu.cn/dxwh/xyfw.htm' },
  campusMapOfficial: { label: '郑州大学 · 校园地图', url: 'https://www15.zzu.edu.cn/xydt.htm' },
  news: { label: '郑州大学新闻网', url: 'https://news.zzu.edu.cn/' },
  admission: { label: '郑州大学招生网', url: 'https://ao.zzu.edu.cn/' },
  graduate: { label: '郑州大学研究生招生', url: 'https://yz.zzu.edu.cn/' },
  libraryOpen: { label: '郑州大学图书馆 · 开放与服务', url: 'https://library.zzu.edu.cn/' },
  hospital: { label: '郑州大学医院管理办公室', url: 'https://www15.zzu.edu.cn/' },
};

export interface StatItem {
  label: string;
  value: string;
  unit?: string;
  note?: string;
}

/** 首页概览数字全部取自学校简介，未做任何推测。 */
export const OVERVIEW_STATS: StatItem[] = [
  { label: '校区', value: '4', unit: '个', note: '主校区 / 南校区 / 北校区 / 东校区' },
  { label: '占地', value: '8500', unit: '余亩', note: '学校总占地面积' },
  { label: '学院', value: '48', unit: '个', note: '校本部现有学院' },
  { label: '本科专业', value: '128', unit: '个', note: '校本部本科专业数' },
];

export const ABOUT_FACTS = [
  '郑州大学由河南省人民政府兴办，法定住所地为河南省郑州市科学大道100号。',
  '学校是国家“211工程”重点建设高校、“双一流”建设高校、部省合建高校。',
  '现有四个校区：主校区（科学大道100号）、南校区（大学北路75号）、北校区（文化路97号）、东校区（大学北路40号）。',
  '设有化学、材料科学与工程、临床医学 3 个世界一流建设学科。',
  '校训“求是 担当”，校风“笃信仁厚、慎思勤勉”。',
];

export interface NavChild {
  to: string;
  label: string;
  en: string;
}

export interface NavItem {
  label: string;
  en: string;
  /** 没有下拉菜单时的目标地址 */
  to?: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '首页', en: 'HOME' },
  {
    label: '校园生活',
    en: 'CAMPUS LIFE',
    children: [
      { to: '/scenery', label: '校园风光', en: 'SCENERY' },
      { to: '/dorm', label: '宿舍生活', en: 'DORM' },
      { to: '/food', label: '校园美食', en: 'FOOD' },
      { to: '/activities', label: '社团活动', en: 'ACTIVITIES' },
    ],
  },
  { to: '/map', label: '校园地图', en: 'MAP' },
  { to: '/teachers', label: '校园名师', en: 'MENTORS' },
  { to: '/education', label: '思政育人', en: 'EDUCATION' },
  { to: '/board', label: '校园贴吧', en: 'BOARD' },
];

/** 展开后的扁平导航，用于页脚与首页「更多内容」 */
export const NAV_FLAT: Array<NavChild & { parent?: string }> = NAV_ITEMS.flatMap((item) =>
  item.children
    ? item.children.map((c) => ({ ...c, parent: item.label }))
    : [{ to: item.to as string, label: item.label, en: item.en }],
);

export const QUICK_LINKS = [
  { to: '/scenery', label: '校园风光', en: 'SCENERY', desc: '四季风景与地标' },
  { to: '/dorm', label: '宿舍生活', en: 'DORM', desc: '住宿与生活服务' },
  { to: '/food', label: '校园美食', en: 'FOOD', desc: '三餐与校园味道' },
  { to: '/activities', label: '社团活动', en: 'ACTIVITIES', desc: '课余与青春现场' },
  { to: '/board', label: '校园贴吧', en: 'BOARD', desc: '匿名留言与照片' },
];
