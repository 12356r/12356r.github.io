import { ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EDU_LINKS } from '../data/education';
import { findSpot } from '../data/eduSpots';

interface Props {
  /** 当前页面对应的板块路由（与 EDU_LINKS 中的 route 对应） */
  route: string;
}

/**
 * 页面末尾的「思政育人视角」小卡：把当前板块与育人主题连起来，
 * 并指向 /education 汇总页。
 */
export default function EduNote({ route }: Props) {
  /* 已在板块内放了「思政微课堂」的页面不再重复渲染页尾小卡 */
  if (findSpot(route)) return null;

  const item = EDU_LINKS.find((e) => e.route === route);

  if (!item) {
    /* 首页没有单独的板块，用一句话把全站主题带出来 */
    if (route !== '/') return null;
    return (
      <aside className="edu-note" aria-label="思政育人视角">
        <div className="edu-note__head">
          <span className="edu-note__badge">
            <GraduationCap size={14} aria-hidden="true" />
            思政育人视角
          </span>
          <span className="edu-note__theme">八个板块 · 八种育人角度</span>
        </div>
        <p className="edu-note__text">
          校园风光谈文化自信，名师谈师德师风，宿舍谈劳动与集体，食堂谈勤俭节约，社团谈实践，地图谈家国情怀，植物谈生态文明，贴吧谈网络文明——每一块都能当成一堂看得见的思政课。
        </p>
        <Link className="link-arrow" to="/education">
          打开「思政育人」总览
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </aside>
    );
  }

  return (
    <aside className="edu-note" aria-label="思政育人视角">
      <div className="edu-note__head">
        <span className="edu-note__badge">
          <GraduationCap size={14} aria-hidden="true" />
          思政育人视角
        </span>
        <span className="edu-note__theme">{item.theme}</span>
      </div>
      <p className="edu-note__text">{item.link}</p>
      <Link className="link-arrow" to="/education">
        看看这一板块怎么用来育人
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </aside>
  );
}
