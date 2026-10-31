import type { ArtSpec } from '../components/SceneArt';

/**
 * 信息核验状态（贯穿全站的信誉约定）
 * - verified      已通过学校官网或公开权威来源核验
 * - pending       来自公开资料但尚未获得官方页面确认，展示时需标注「信息待核验」
 * - illustrative  示意／示例内容，仅用于演示版式与交互，不代表真实校园信息
 */
export type Verification = 'verified' | 'pending' | 'illustrative';

export interface SourceRef {
  label: string;
  url: string;
}

export type CampusId = 'main' | 'south' | 'north' | 'east';

export interface Campus {
  id: CampusId;
  name: string;
  address: string;
  short: string;
  art: ArtSpec;
  sources: SourceRef[];
  verification: Verification;
}

export type PlaceCategory =
  | '校园建筑'
  | '自然景观'
  | '校园公共空间'
  | '校园文化场所'
  | '学习与教学场所';

export interface CampusPlace {
  id: string;
  name: string;
  nameEn: string;
  campus: CampusId | 'all';
  category: PlaceCategory;
  summary: string;
  description: string[];
  /** 具体位置，例如「眉湖北段，厚山南侧」 */
  location?: string;
  art: ArtSpec;
  /** 同一地点的多张示意插画（不同季节/时段），用于详情页图集 */
  gallery?: ArtSpec[];
  image?: string | null;
  /** 详情页大图使用更宽的裁切（2.4:1），未提供时回退到 image */
  imageWide?: string | null;
  tags: string[];
  /** 仅在坐标经过核验后填写；为空时地图页不会生成标记 */
  coords?: { lat: number; lng: number } | null;
  openInfo?: string;
  tips?: string[];
  sources: SourceRef[];
  /** 无外部链接时说明内容来源与时效 */
  note?: string;
  verification: Verification;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  group: 'humanities' | 'engineering' | 'medical';
  type: '学院' | '学部' | '附属医院';
  discipline: string;
  url: string;
  phone: string;
  sources: SourceRef[];
  verification: Verification;
}

export type FoodArea = 'canteen';

export interface FoodItem {
  id: string;
  name: string;
  /** 所属板块：目前只保留食堂 */
  area: FoodArea;
  /** 业态，例如「食堂餐厅」 */
  kind: string;
  summary: string;
  location: string;
  contact?: string;
  /** 楼层、设施、周边等要点 */
  features?: string[];
  /** 招牌 / 推荐菜品 */
  highlights?: string[];
  /** 核验与时效说明 */
  note?: string;
  tags: string[];
  art: ArtSpec;
  image?: string | null;
  /** 详情弹窗使用更宽的裁切（2.4:1），未提供时回退到 image */
  imageWide?: string | null;
  priceNote?: string;
  sources: SourceRef[];
  verification: Verification;
  updatedAt: string;
}

export interface Activity {
  id: string;
  title: string;
  category: '学术科技' | '文艺表演' | '体育运动' | '志愿服务' | '兴趣社团' | '校园文化';
  summary: string;
  date?: string;
  place?: string;
  organizer?: string;
  art: ArtSpec;
  image?: string | null;
  status: '示例数据' | '已结束' | '即将开始';
  sources: SourceRef[];
  verification: Verification;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date?: string;
  summary: string;
  source: SourceRef;
  verification: Verification;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  source?: SourceRef;
}
