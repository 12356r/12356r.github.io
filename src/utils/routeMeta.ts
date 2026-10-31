import { NEWS_CHANNELS } from '../data/content';
import { PLACES } from '../data/scenery';

interface RouteMeta {
  title: string;
  desc: string;
}

const STATIC: Record<string, RouteMeta> = {
  '/': {
    title: '',
    desc: '郑州大学校园探索：校园风光、校园地图、宿舍生活、校园美食、社团活动与校园贴吧，每条信息标注来源与核验状态。',
  },
  '/life': {
    title: '校园生活',
    desc: '校园生活四个模块的入口：校园风光、宿舍生活、校园美食、社团活动，可从这一页选择想去的地方。',
  },
  '/scenery': {
    title: '校园风光',
    desc: '按校区与类别浏览郑州大学的校园风光与地点信息，每条标注所属校区、核验状态与官方来源。',
  },
  '/map': {
    title: '校园地图',
    desc: '基于 OpenStreetMap 的校园地点浏览工具：四校区地址、地点检索、列表定位与坐标标注。',
  },
  '/dorm': {
    title: '宿舍生活',
    desc: '郑州大学住宿相关信息说明与官方查询路径。本站不编造房型、床位数、收费标准与设施配置。',
  },
  '/food': {
    title: '校园美食',
    desc: '校园餐饮栏目结构示例，说明如何获取可核验的餐饮信息，不提供未经核实的价格与营业时间。',
  },
  '/activities': {
    title: '社团活动',
    desc: '校园社团与活动栏目的结构示例，并提供获取真实活动信息的官方渠道。',
  },
  '/board': {
    title: '校园贴吧',
    desc: '匿名留言板：不用登录即可发布文字或照片，所有人都能看到。请勿发布他人隐私与联系方式。',
  },
  '/teachers': {
    title: '校园名师',
    desc: '郑州大学名师事迹：院士吴养洁、消化病学专家段芳龄的从教故事，以及国家级教学名师名录。内容整理自学校官网。',
  },
  '/education': {
    title: '思政育人',
    desc: '把校园风光、名师、宿舍、美食、社团、地图、植物与贴吧八个板块，分别对应到文化自信、师德师风、劳动教育等思政主题，并给出具体用法。',
  },
  '/news': {
    title: '资讯与公告',
    desc: '郑州大学官方信息渠道入口。本站不转载、不改写新闻，最新内容以官方发布为准。',
  },
  '/about': {
    title: '关于本站',
    desc: '郑州大学校园探索项目的设计目的、信息来源原则与核验状态说明。本站为非官方网站。',
  },
  '/favorites': {
    title: '我的收藏',
    desc: '收藏的校园地点、食堂档口与贴吧留言，保存在当前浏览器本地。',
  },
  '/search': {
    title: '站内搜索',
    desc: '搜索校园地点、学院专业、美食、社团活动与资讯入口。',
  },
};

export function getRouteMeta(pathname: string): RouteMeta {
  const direct = STATIC[pathname];
  if (direct) return direct;

  const placeMatch = pathname.match(/^\/scenery\/([^/]+)$/);
  if (placeMatch) {
    const place = PLACES.find((p) => p.id === placeMatch[1]);
    if (place) return { title: place.name, desc: place.summary };
  }

  const newsMatch = pathname.match(/^\/news\/([^/]+)$/);
  if (newsMatch) {
    const item = NEWS_CHANNELS.find((n) => n.id === newsMatch[1]);
    if (item) return { title: item.title, desc: item.summary };
  }

  return { title: '页面未找到', desc: '该页面可能已经移动或链接有误，请返回首页继续浏览。' };
}
