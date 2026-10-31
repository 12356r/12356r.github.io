/**
 * 社团活动 · 活动纪实
 *
 * 三条都来自项目方提供的现场照片与海报，只写照片与海报上能看到的信息
 * （名称、时间、主办方、现场形式），不补写参与人数、奖项等未经证实的细节。
 */

export interface ActivityFeature {
  id: string;
  name: string;
  when: string;
  organizer?: string;
  image: string;
  imageWide: string;
  imageAlt: string;
  summary: string;
  /** 现场能看到的具体细节 */
  details: string[];
  /** 与思政主题的连接 */
  theme: string;
  edu: string;
}

export const ACTIVITY_FEATURES: ActivityFeature[] = [
  {
    id: 'keji-tiyanying',
    name: '科技互动体验营',
    when: '2026 年 10 月',
    organizer: '2026 年青少年科技社团支持计划 · 科创活动',
    image: '/images/activities/keji-card.jpg',
    imageWide: '/images/activities/keji-wide.jpg',
    imageAlt: '科技互动体验营的蓝色主题展板，上面写着「科技互动体验营」「2026 年青少年科技社团支持计划」',
    summary:
      '一场把实验室搬到展位上的活动：展位开放、实物演示、实操体验、科普讲解，四件事同时进行——不只看，还要上手。',
    details: ['展位开放：各社团摆出自己的作品与实验装置', '实物演示 + 实操体验：学生自己讲解、自己演示', '科普讲解：把原理讲到听得懂为止'],
    theme: '科技自立自强 · 创新精神',
    edu: '科学精神不是记住结论，而是愿意动手试一次、也愿意把原理讲给别人听。把「我做过」讲清楚，比背下十道题更接近创新。',
  },
  {
    id: 'shetuan-wenhua-jie',
    name: '学生社团文化节',
    when: '2026 年 5 月（第十八届）',
    organizer: '共青团郑州大学委员会',
    image: '/images/activities/wenhua-card.jpg',
    imageWide: '/images/activities/wenhua-wide.jpg',
    imageAlt: '学生社团文化节的橙红色主题展板，题字为「夏韶景明 风华聿昭」',
    summary:
      '「夏韶景明，风华聿昭」——一年一度的社团之夜，也是第十八届学生社团文化节。台上台下，都是学生自己排、自己演、自己张罗。',
    details: ['主题题字「夏韶景明 风华聿昭」，取少年风华、光明昭彰之意', '社团之夜 + 文化节，一届一届办到第十八届', '主办单位为共青团郑州大学委员会'],
    theme: '文化自信 · 以文化人',
    edu: '一台晚会能办十八届，靠的不是一次热情，而是每年都有人接手。文化传承听着很大，落到实处就是「今年轮到我们，别办砸了」。',
  },
  {
    id: 'baituan-dazhan',
    name: '百团大战 · 社团招新',
    when: '每年秋季开学季',
    image: '/images/activities/baituan-card.jpg',
    imageWide: '/images/activities/baituan-wide.jpg',
    imageAlt: '操场上的社团招新现场，蓝色帐篷一顶接一顶排开，学生在帐篷间穿梭咨询',
    summary:
      '操场上几百顶帐篷排开，一顶就是一个社团的门面。招新是新生第一次自己做选择：想成为什么样的人，从加入哪个社团开始。',
    details: ['蓝色帐篷成排摆在操场上，每个社团一个展位', '老成员现场答疑、表演、发传单', '新生在一天里走完几十个展位，自己判断、自己选择'],
    theme: '实践育人 · 集体生活',
    edu: '一次招新就是一次真实的组织生活：搭帐篷、排班、讲清楚自己社团在做什么。选择社团，也是在选择「我想和什么样的人一起做事」。',
  },
];
