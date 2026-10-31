import type { Activity, FaqItem, FoodItem, NewsItem } from './types';
import { SOURCES } from './site';

/* ============================================================
   校园美食
   ------------------------------------------------------------
   结构：只保留「食堂」一个板块。
   - 食堂：名称、位置、楼层与招牌菜品由项目方现场拍摄与整理提供，标注「已核验」；
     菜单价格与营业时间仍以现场公示为准。
   ============================================================ */

export const FOOD_AREAS = [
  { id: 'canteen', label: '食堂', en: 'CANTEEN' },
] as const;

export const FOOD_ITEMS: FoodItem[] = [
  /* ---------------- 一、食堂 ---------------- */
  {
    id: 'canteen-juyingyuan',
    name: '聚英园餐厅',
    area: 'canteen',
    kind: '食堂餐厅',
    summary: '三层大食堂，菜品最丰富的一处；自带清真窗口，校内校园卡服务中心也设在这里。南操场运动完来这儿吃饭最近。',
    location: '主校区 · 柳园生活区西南侧（柳园 19、20、21、23 号楼旁）',
    features: ['三层食堂', '设清真窗口', '校园卡服务中心在此', '靠近南操场'],
    highlights: ['泡泡鸡', '猪脚饭', '石锅拌饭'],
    note: '位置、楼层与招牌菜品由项目方整理提供（2026-10），实景照片由项目方拍摄；营业时间、价格与支付方式以现场公示为准。',
    tags: ['柳园', '三层', '清真窗口'],
    art: { kind: 'bowl', seed: 17 },
    image: '/images/food/juyingyuan-card.jpg',
    imageWide: '/images/food/juyingyuan-wide.jpg',
    sources: [],
    verification: 'verified',
    updatedAt: '2026-10-21',
  },
  {
    id: 'canteen-fenghuayuan',
    name: '风华园餐厅',
    area: 'canteen',
    kind: '食堂餐厅',
    summary: '性价比很高的一处：一层自选餐实惠量大，以家常口味为主，环境明亮，适合日常清淡就餐。',
    location: '主校区 · 柳园生活区北侧（柳园 22、24 号楼旁）',
    features: ['两层', '一层自选餐厅', '二层南侧为豫湘源餐厅', '环境明亮'],
    highlights: ['自选餐', '烤鸭饭', '家常简餐'],
    note: '位置、楼层与招牌菜品由项目方整理提供（2026-10），实景照片由项目方拍摄；营业时间、价格与支付方式以现场公示为准。',
    tags: ['柳园', '两层', '性价比'],
    art: { kind: 'bowl', seed: 29 },
    image: '/images/food/fenghuayuan-card.jpg',
    imageWide: '/images/food/fenghuayuan-wide.jpg',
    sources: [],
    verification: 'verified',
    updatedAt: '2026-10-21',
  },
  {
    id: 'canteen-heyuan-1',
    name: '荷园一餐厅',
    area: 'canteen',
    kind: '食堂餐厅',
    summary: '二楼偏文艺的「网红」餐厅，适合聚餐小坐；菜品以瓦香鸡、盖浇饭等为主。',
    location: '主校区 · 荷园生活区西侧（荷园 10、11 号楼附近）',
    features: ['两层', '二楼为「匆匆那年」餐厅'],
    highlights: ['瓦香鸡', '盖浇饭'],
    note: '位置、楼层与招牌菜品由项目方整理提供（2026-10），实景照片由项目方拍摄；营业时间、价格与支付方式以现场公示为准。',
    tags: ['荷园', '两层', '文艺氛围'],
    art: { kind: 'bowl', seed: 41 },
    image: '/images/food/heyuan-1-card.jpg',
    imageWide: '/images/food/heyuan-1-wide.jpg',
    sources: [],
    verification: 'verified',
    updatedAt: '2026-10-21',
  },
  {
    id: 'canteen-heyuan-2',
    name: '荷园二餐厅',
    area: 'canteen',
    kind: '食堂餐厅',
    summary: '口味多元、粥品齐全的人气食堂；瓦罐汤、烤盘饭、冒烤鸭口碑不错。',
    location: '主校区 · 荷园生活区西侧（荷园 12、13 号楼附近）',
    features: ['两层', '二楼为沙滩风格装修'],
    highlights: ['瓦罐汤', '烤盘饭', '冒烤鸭'],
    note: '位置、楼层与招牌菜品由项目方整理提供（2026-10），实景照片由项目方拍摄；营业时间、价格与支付方式以现场公示为准。',
    tags: ['荷园', '两层', '粥品'],
    art: { kind: 'bowl', seed: 53 },
    image: '/images/food/heyuan-2-card.jpg',
    imageWide: '/images/food/heyuan-2-wide.jpg',
    sources: [],
    verification: 'verified',
    updatedAt: '2026-10-21',
  },
  {
    id: 'canteen-qiusuiyuan',
    name: '秋穗园餐厅',
    area: 'canteen',
    kind: '食堂餐厅',
    summary: '早餐选择最多的一处，面食种类齐全，还办起了校内首家校园夜市；离教学楼近，下课顺路就能吃。',
    location: '主校区 · 菊园生活区西侧',
    features: ['三层', '带电梯', '校内首家校园夜市', '离教学楼近'],
    highlights: ['生煎', '车轮饼', '酱香饼'],
    note: '位置、楼层与招牌菜品由项目方整理提供（2026-10），实景照片由项目方拍摄；营业时间、价格与支付方式以现场公示为准。',
    tags: ['菊园', '三层', '早餐'],
    art: { kind: 'bowl', seed: 3 },
    image: '/images/food/qiusuiyuan-card.jpg',
    imageWide: '/images/food/qiusuiyuan-wide.jpg',
    sources: [],
    verification: 'verified',
    updatedAt: '2026-10-21',
  },
  {
    id: 'canteen-jinggeyuan',
    name: '竞舸园餐厅',
    area: 'canteen',
    kind: '食堂餐厅',
    summary: '环境相对安静、座位多样，既能吃饭也能轻自习；粥品、饸饹面、芝士焗饭分量都足。',
    location: '主校区 · 松园生活区西侧（松园 10、11 号楼旁）',
    features: ['三层', '座位多样', '一层自选餐厅', '二层南快餐 / 北美食城', '三层风味美食餐厅'],
    highlights: ['特色粥品', '饸饹面', '芝士焗饭'],
    note: '位置、楼层与招牌菜品由项目方整理提供（2026-10），实景照片由项目方拍摄；营业时间、价格与支付方式以现场公示为准。',
    tags: ['松园', '三层', '可轻自习'],
    art: { kind: 'bowl', seed: 67 },
    image: '/images/food/jinggeyuan-card.jpg',
    imageWide: '/images/food/jinggeyuan-wide.jpg',
    sources: [],
    verification: 'verified',
    updatedAt: '2026-10-21',
  },


];

/* ============================================================
   校园美食 · 食堂档口推荐
   ============================================================ */

export interface CanteenPick {
  id: string;
  canteenId: string;
  name: string;
  floor?: string;
  price?: string;
  desc: string;
  image: string;
  imageAlt: string;
  /** 图片角标文案，默认「示意图」；确认是 AI 生成的写「AI 示意图」 */
  imageTag?: string;
}

/**
 * 档口推荐：文字与价格由项目方整理提供（2026-10）；
 * 配图为 AI 生成示意图，不是实拍，页面上会明确标注。
 */
export const CANTEEN_PICKS: CanteenPick[] = [
  /* 聚英园：来源《聚英园美食推荐》，配图带「豆包AI生成」水印 */
  {
    id: 'jyy-changfen',
    canteenId: 'canteen-juyingyuan',
    name: '肠粉档',
    desc: '薄滑透亮的肠粉淋上鲜酱汁，配菜给得足；店家怕男生吃不饱会主动加量，适合当早餐。',
    image: '/images/food/picks/jyy-changfen.jpg',
    imageAlt: 'AI 生成的肠粉示意图',
    imageTag: 'AI 示意图',
  },
  {
    id: 'jyy-hundun',
    canteenId: 'canteen-juyingyuan',
    name: '手工红油馄饨',
    floor: '二楼',
    desc: '皮薄馅大，泡在红油汤里，撒葱花、紫菜与芝麻，辣香明显，一口一个。',
    image: '/images/food/picks/jyy-hundun.jpg',
    imageAlt: 'AI 生成的红油馄饨示意图',
    imageTag: 'AI 示意图',
  },
  {
    id: 'jyy-xiangbafan',
    canteenId: 'canteen-juyingyuan',
    name: '香扒饭',
    floor: '一楼',
    price: '约 6 元',
    desc: '三菜杂粮餐：紫米配西兰花、菌片和青菜，再加一个鸡腿，价位低、搭配均衡。',
    image: '/images/food/picks/jyy-xiangbafan.jpg',
    imageAlt: 'AI 生成的香扒饭示意图',
    imageTag: 'AI 示意图',
  },
  {
    id: 'jyy-menmian',
    canteenId: 'canteen-juyingyuan',
    name: '小锅焖面',
    floor: '一楼',
    desc: '面条劲道，裹满香辣酱汁，配青椒、鸡蛋与豆芽大火翻炒，锅气足、分量大。',
    image: '/images/food/picks/jyy-menmian.jpg',
    imageAlt: 'AI 生成的小锅焖面示意图',
    imageTag: 'AI 示意图',
  },

  /* 荷园一餐厅：来源《荷园一食堂美食推荐》 */
  {
    id: 'hey1-niuroumian',
    canteenId: 'canteen-heyuan-1',
    name: '私房牛肉面',
    floor: '一楼',
    price: '大碗约 7 元',
    desc: '卤牛肉片给得实在，配小油菜和花生米，汤头浓郁；大碗可以免费加面。',
    image: '/images/food/picks/hey1-niuroumian.jpg',
    imageAlt: '牛肉面示意图',
  },
  {
    id: 'hey1-jiaotoumian',
    canteenId: 'canteen-heyuan-1',
    name: '辣椒炒肉浇头面',
    floor: '二楼 · 匆匆那年',
    desc: '面条口感接近手擀面，浇头现炒；青椒、五花肉、洋葱、蒜薹咸香，拌开后每根面都挂汁。',
    image: '/images/food/picks/hey1-jiaotoumian.jpg',
    imageAlt: '辣椒炒肉浇头面示意图',
  },
  {
    id: 'hey1-jianbangfen',
    canteenId: 'canteen-heyuan-1',
    name: '江西拌粉',
    floor: '二楼 · 匆匆那年',
    desc: '米粉爽滑，铺笋丝、肉末、芹菜、花生米与酸豆角，淋辣椒油拌匀，比浇头面清淡些。',
    image: '/images/food/picks/hey1-jianbangfen.jpg',
    imageAlt: '江西拌粉示意图',
  },
  {
    id: 'hey1-ganbianmian',
    canteenId: 'canteen-heyuan-1',
    name: '干煸面',
    floor: '二楼 · 匆匆那年（左侧）',
    desc: '配菜给得多：芹菜、洋葱、肉丝、千张丝拌在一起，撒白芝麻，辣里带一点甜。',
    image: '/images/food/picks/hey1-ganbianmian.jpg',
    imageAlt: '干煸面示意图',
  },
  {
    id: 'hey1-chebianmian',
    canteenId: 'canteen-heyuan-1',
    name: '陕西手工扯面',
    floor: '二楼 · 匆匆那年',
    desc: '宽面手工扯制，筋道有嚼劲；双椒加肉块大火爆炒，配包菜和红油，拌开油亮。',
    image: '/images/food/picks/hey1-chebianmian.jpg',
    imageAlt: '陕西手工扯面示意图',
  },

  /* 风华园：来源《风华园美食推荐》 */
  {
    id: 'fhy-kaoyafan',
    canteenId: 'canteen-fenghuayuan',
    name: '烤鸭饭',
    desc: '烤鸭皮脆肉嫩、卤香入味，大片鸭肉盖在米饭上，配一个卤蛋和上海青，分量扎实。',
    image: '/images/food/picks/fhy-kaoyafan.jpg',
    imageAlt: '烤鸭饭示意图',
  },
  {
    id: 'fhy-waguanmian',
    canteenId: 'canteen-fenghuayuan',
    name: '手工瓦罐面',
    floor: '二楼',
    desc: '现擀的面条筋道挂汤，瓦罐里炖香菇、青菜与海带，出锅撒香菜和油辣子，辣而不燥。',
    image: '/images/food/picks/fhy-waguanmian.jpg',
    imageAlt: '手工瓦罐面示意图',
  },
  {
    id: 'fhy-niuroufen',
    canteenId: 'canteen-fenghuayuan',
    name: '越南牛肉粉',
    floor: '二楼',
    desc: '清汤鲜爽不油腻，薄切牛肉配青柠片、小米辣与香菜，挤上青柠汁酸辣开胃，可再加酸豆角。',
    image: '/images/food/picks/fhy-niuroufen.jpg',
    imageAlt: '越南牛肉粉示意图',
  },
  {
    id: 'fhy-suroufan',
    canteenId: 'canteen-fenghuayuan',
    name: '港式酥肉饭',
    floor: '二楼',
    desc: '金黄酸汤打底，肥牛片与现炸酥肉吸满汤汁，底下还有金针菇、豆腐泡和粉丝，酸辣开胃。',
    image: '/images/food/picks/fhy-suroufan.jpg',
    imageAlt: '港式酥肉饭示意图',
  },
  {
    id: 'fhy-yuntun',
    canteenId: 'canteen-fenghuayuan',
    name: '干拌云吞',
    desc: '薄皮大馅裹满芝麻酱，撒小葱花，另配一碟红油辣椒蘸着吃，酱香里带点香辣。',
    image: '/images/food/picks/fhy-yuntun.jpg',
    imageAlt: '干拌云吞示意图',
  },

  /* 荷园二餐厅：来源《荷园二食堂美食推荐》 */
  {
    id: 'hy2-huoguofen',
    canteenId: 'canteen-heyuan-2',
    name: '火锅粉',
    floor: '二楼',
    desc: '配料给得足：豆腐泡、海带、青菜吸满麻辣汤底，细粉丝爽滑；饭点去常要排队。',
    image: '/images/food/picks/hy2-huoguofen.jpg',
    imageAlt: '火锅粉示意图',
  },
  {
    id: 'hy2-wanzamian',
    canteenId: 'canteen-heyuan-2',
    name: '成都豌杂面',
    floor: '二楼',
    desc: '豌豆炖得软糯起沙，杂酱香浓，拌上辣油和葱花；旁边配一碟泡菜解腻。',
    image: '/images/food/picks/hy2-wanzamian.jpg',
    imageAlt: '成都豌杂面示意图',
  },
  {
    id: 'hy2-qiehuangfan',
    canteenId: 'canteen-heyuan-2',
    name: '茄皇饭',
    floor: '二楼',
    desc: '茄汁烧肉块裹满酱汁，酸甜开胃，配上海青与白米饭；肉块给得实在，汤汁拌饭很下饭。',
    image: '/images/food/picks/hy2-qiehuangfan.jpg',
    imageAlt: '茄皇饭示意图',
  },
  {
    id: 'hy2-daoxiaomian',
    canteenId: 'canteen-heyuan-2',
    name: '开封刀削面',
    floor: '二楼',
    desc: '宽面手工削制，筋道有嚼劲；配豆芽、韭菜和肉末，辣油汤汁浓郁。',
    image: '/images/food/picks/hy2-daoxiaomian.jpg',
    imageAlt: '开封刀削面示意图',
  },
  {
    id: 'hy2-waxiangji',
    canteenId: 'canteen-heyuan-2',
    name: '瓦香鸡',
    floor: '二楼',
    desc: '鸡肉块嫩滑入味，配青椒、洋葱和土豆，酱汁浓郁，配一碗白米饭最合适。',
    image: '/images/food/picks/hy2-waxiangji.jpg',
    imageAlt: '瓦香鸡示意图',
  },

  /* 秋穗园：来源《秋穗园美食推荐》 */
  {
    id: 'qsy-jifan',
    canteenId: 'canteen-qiusuiyuan',
    name: '海南鸡饭',
    desc: '白切鸡腿皮滑肉嫩，鸡油米饭粒粒分明，配玉米粒、卤蛋和上海青，口味清爽不油腻。',
    image: '/images/food/picks/qsy-jifan.jpg',
    imageAlt: '海南鸡饭示意图',
  },
  {
    id: 'qsy-bamian',
    canteenId: 'canteen-qiusuiyuan',
    name: '蔬菜拌面',
    floor: '三楼',
    price: '小份约 8 元',
    desc: '绿色手工宽面浇麻酱，拌花菜、炸藕盒、青菜、木耳、豆角与炸丸子，可以多放辣椒。',
    image: '/images/food/picks/qsy-bamian.jpg',
    imageAlt: '蔬菜拌面示意图',
  },
  {
    id: 'qsy-ganguo',
    canteenId: 'canteen-qiusuiyuan',
    name: '川湘干锅',
    floor: '二楼 · 最北侧',
    desc: '小炒肉肥瘦相间，配蒜薹、青椒、洋葱，撒白芝麻；堂食可以小火加热，菜量足。',
    image: '/images/food/picks/qsy-ganguo.jpg',
    imageAlt: '川湘干锅示意图',
  },
  {
    id: 'qsy-shousiji',
    canteenId: 'canteen-qiusuiyuan',
    name: '手撕鸡肉饭',
    desc: '鸡丝拌生菜、千张、洋葱和花生米，淋辣椒油，口感像凉菜，清爽解腻。',
    image: '/images/food/picks/qsy-shousiji.jpg',
    imageAlt: '手撕鸡肉饭示意图',
  },

  /* 竞舸园：来源《竞舸园美食推荐》 */
  {
    id: 'jgy-dapanji',
    canteenId: 'canteen-jinggeyuan',
    name: '大盘鸡',
    floor: '一楼 · 餐厅最左侧',
    price: '小份约 10 元',
    desc: '鸡肉块炖得软烂，土豆绵密吸满汤汁；宽面裹红油，撒香菜与葱花，小份就够吃。',
    image: '/images/food/picks/jgy-dapanji.jpg',
    imageAlt: '大盘鸡示意图',
  },
  {
    id: 'jgy-maokaoya',
    canteenId: 'canteen-jinggeyuan',
    name: '冒烤鸭',
    desc: '烤鸭块浸在红油麻辣汤底里，配酥脆豌豆、葱花、白芝麻和方便面，汤底浓郁。',
    image: '/images/food/picks/jgy-maokaoya.jpg',
    imageAlt: '冒烤鸭示意图',
  },
  {
    id: 'jgy-youpomian',
    canteenId: 'canteen-jinggeyuan',
    name: '油泼面',
    floor: '竞舸园三楼',
    desc: '手工宽面拌火腿肠、胡萝卜丁、黄瓜丁、青椒、豆芽与鸡蛋碎，辣椒面一泼就香。',
    image: '/images/food/picks/jgy-youpomian.jpg',
    imageAlt: '油泼面示意图',
  },
  {
    id: 'jgy-chenpiya',
    canteenId: 'canteen-jinggeyuan',
    name: '陈皮鸭',
    floor: '竞舸园二楼',
    desc: '外皮焦脆、现切热乎，可选咸口或甜口；配黄瓜丝、土豆丝和米饭，解腻下饭。',
    image: '/images/food/picks/jgy-chenpiya.jpg',
    imageAlt: '陈皮鸭示意图',
  },
];

/* ============================================================
   宿舍生活
   ============================================================ */

export interface DormZone {
  id: string;
  name: string;
  order: string;
  canteens: string[];
  extras: string[];
  summary: string;
  /** 园区石碑实景照片（项目方拍摄） */
  image: string;
  imageAlt: string;
}

/**
 * 主校区的四个宿舍园区，自南向北依次为：柳园 → 荷园 → 菊园 → 松园。
 * 园区名称与顺序由项目方提供；园区石碑照片由项目方拍摄（2026-10）。
 * 各园区的食堂对应「校园美食 · 食堂」板块。
 */
export const DORM_ZONES: DormZone[] = [
  {
    id: 'liuyuan',
    name: '柳园',
    order: '最南端',
    canteens: ['聚英园餐厅', '风华园餐厅'],
    extras: ['紧邻南操场', '校园卡服务中心', '菜鸟驿站', '天猫超市', '靠近南门与泊月长廊'],
    summary:
      '主校区最南端，也是最早建成的宿舍园区。紧邻南操场，聚英园、风华园两大食堂都在这一片；校园卡服务中心、菜鸟驿站、天猫超市汇集于此，靠近南门与泊月长廊——运动、取快递都方便。',
    image: '/images/dorm/liuyuan.jpg',
    imageAlt: '郑州大学柳园宿舍园区的石碑，碑上刻有红色「柳园」二字，周围是绿树与草地',
  },
  {
    id: 'heyuan',
    name: '荷园',
    order: '校园 CBD',
    canteens: ['荷园一餐厅', '荷园二餐厅'],
    extras: ['校内商业街', '水果店 · 奶茶店 · 打印店 · 药店', '人气最高'],
    summary:
      '人气最高的园区，被叫作「校园 CBD」：自带校内商业街，水果店、奶茶店、打印店、药店一应俱全，配荷园一、二餐厅。生活业态最丰富，日常采购和休闲选择都多，热闹也便捷。',
    image: '/images/dorm/heyuan.jpg',
    imageAlt: '郑州大学荷园宿舍园区的石碑，碑上刻有红色「荷园」二字，旁边是木柱与林荫道',
  },
  {
    id: 'juyuan',
    name: '菊园',
    order: '校园中部',
    canteens: ['秋穗园餐厅'],
    extras: ['位置居中', '规模小巧', '设施齐全', '校园夜市'],
    summary:
      '位于校园中部，往返教学区距离适中，规模相对小巧但设施齐全，配套秋穗园餐厅，还有校内首家校园夜市。上课、吃饭的距离比较均衡，安静程度也适中。',
    image: '/images/dorm/juyuan.jpg',
    imageAlt: '郑州大学菊园宿舍园区的石碑，碑上刻有「菊园」二字，掩在灌木丛中，背后是宿舍楼',
  },
  {
    id: 'songyuan',
    name: '松园',
    order: '最北端',
    canteens: ['竞舸园餐厅'],
    extras: ['临近北门与北操场', '靠近地铁口', '大学生活动中心', '独立洗浴中心', '座位多、可轻自习'],
    summary:
      '主校区最北端，临近北门与北操场，靠近地铁口，交通方便；环境清幽，设有大学生活动中心。食堂是竞舸园（也常被叫作松园餐厅，座位多、可以轻自习），另有独立洗浴中心——适合喜欢安静的同学。',
    image: '/images/dorm/songyuan.jpg',
    imageAlt: '郑州大学松园宿舍园区的石碑，碑上刻有红色「松园」二字，上方是红砖连廊，右侧为宿舍楼',
  },
];


export const DORM_FAQ: FaqItem[] = [
  {
    id: 'dorm-faq-1',
    question: '如何查询官方住宿安排？',
    answer:
      '住宿安排由学校统一发布。请通过学校官网、迎新专题或所在学院（书院）的通知渠道获取，本站不提供住宿分配信息。',
    source: SOURCES.campusService,
  },
  {
    id: 'dorm-faq-2',
    question: '如何了解宿舍设施与房型？',
    answer:
      '不同校区的宿舍条件并不相同，本站没有获得可核验的设施清单，因此不做描述。请在入校前以学校官方通知与现场公示为准。',
    source: SOURCES.intro,
  },
  {
    id: 'dorm-faq-3',
    question: '住宿费用与缴费方式在哪里查看？',
    answer: '收费项目与标准以学校官方发布为准。本站不提供任何收费标准数字，避免与实际不符。',
    source: SOURCES.campusService,
  },
  {
    id: 'dorm-faq-4',
    question: '在哪里查找校园生活服务？',
    answer: '学校官网“校园服务”栏目汇总了与学习、生活相关的服务入口，可作为查询起点。',
    source: SOURCES.campusService,
  },
];

/* ============================================================
   社团活动（示例数据，非真实活动）
   ============================================================ */

export const ACTIVITIES: Activity[] = [
  {
    id: 'act-01',
    title: '示例：学术科技类活动',
    category: '学术科技',
    summary: '用于展示活动卡片的示例条目，不是真实活动，也不提供报名入口。',
    status: '示例数据',
    art: { kind: 'stage', seed: 21, mood: 'day' },
    sources: [SOURCES.news],
    verification: 'illustrative',
  },
  {
    id: 'act-02',
    title: '示例：文艺表演类活动',
    category: '文艺表演',
    summary: '示例条目：展示活动分类与版式，时间、地点、主办方均为占位说明。',
    status: '示例数据',
    art: { kind: 'stage', seed: 33, mood: 'dusk' },
    sources: [SOURCES.news],
    verification: 'illustrative',
  },
  {
    id: 'act-03',
    title: '示例：体育竞技类活动',
    category: '体育运动',
    summary: '示例条目：用于说明运动类活动的展示方式，不对应真实赛事。',
    status: '示例数据',
    art: { kind: 'court', seed: 45, mood: 'summer' },
    sources: [SOURCES.news],
    verification: 'illustrative',
  },
  {
    id: 'act-04',
    title: '示例：志愿服务活动',
    category: '志愿服务',
    summary: '示例条目：展示志愿服务类活动的卡片结构，无真实招募信息。',
    status: '示例数据',
    art: { kind: 'trees', seed: 57, mood: 'spring' },
    sources: [SOURCES.news],
    verification: 'illustrative',
  },
  {
    id: 'act-05',
    title: '示例：兴趣社团招新',
    category: '兴趣社团',
    summary: '示例条目：社团招新的时间、地点与流程每年不同，请以校内通知为准。',
    status: '示例数据',
    art: { kind: 'plaza', seed: 69, mood: 'autumn' },
    sources: [SOURCES.news],
    verification: 'illustrative',
  },
  {
    id: 'act-06',
    title: '示例：校园文化类活动',
    category: '校园文化',
    summary: '示例条目：用于展示校园文化活动的内容结构，不代表真实排期。',
    status: '示例数据',
    art: { kind: 'arch', seed: 81, mood: 'spring' },
    sources: [SOURCES.news],
    verification: 'illustrative',
  },
];

export const ACTIVITY_CATEGORIES = [
  '全部',
  '学术科技',
  '文艺表演',
  '体育运动',
  '志愿服务',
  '兴趣社团',
  '校园文化',
] as const;

/* ============================================================
   资讯与公告：只做官方渠道入口，不编造新闻
   ============================================================ */

export const NEWS_CHANNELS: NewsItem[] = [
  {
    id: 'news-site',
    title: '郑州大学新闻网 · 校园最新动态',
    category: '校园动态',
    summary:
      '学校官方新闻发布渠道。校园新闻、人物报道与专题内容以该站点为准，本站不转载、不改写。',
    source: SOURCES.news,
    verification: 'verified',
  },
  {
    id: 'news-admission',
    title: '郑州大学招生网 · 招生信息与政策',
    category: '招生信息',
    summary: '本科招生政策、招生计划、历年录取等信息以招生网公布为准。',
    source: SOURCES.admission,
    verification: 'verified',
  },
  {
    id: 'news-graduate',
    title: '郑州大学研究生招生 · 硕士博士招生',
    category: '招生信息',
    summary: '研究生招生简章、专业目录与复试录取信息以研究生招生网站公布为准。',
    source: SOURCES.graduate,
    verification: 'verified',
  },
  {
    id: 'news-service',
    title: '郑州大学校园服务 · 生活与服务指南',
    category: '校园服务',
    summary: '校园生活相关的服务入口与说明，具体办理流程以学校公布为准。',
    source: SOURCES.campusService,
    verification: 'verified',
  },
];

export const NEWS_CATEGORIES = ['全部', '校园动态', '招生信息', '校园服务'] as const;
