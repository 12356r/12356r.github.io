import { ArrowRight, GraduationCap, Lightbulb, MessageCircleQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';
import { findSpot } from '../data/eduSpots';

interface Props {
  /** 当前板块路由 */
  route: string;
}

/**
 * 板块内的「思政微课堂」：看到什么 → 讨论什么 → 可以做什么。
 * 与页尾的「思政育人视角」小卡区分：这里给的是具体场景与可执行动作。
 */
export default function EduSpot({ route }: Props) {
  const spot = findSpot(route);
  if (!spot) return null;

  return (
    <section className="section section--flush-top">
      <div className="container">
        <div className="edu-spot">
          <div className="edu-spot__head">
            <span className="edu-spot__badge">
              <GraduationCap size={14} aria-hidden="true" />
              思政微课堂
            </span>
            <span className="edu-spot__theme">{spot.theme}</span>
          </div>

          <p className="edu-spot__scene">{spot.scene}</p>

          <div className="edu-spot__grid">
            <div className="edu-spot__cell">
              <p className="edu-spot__label">
                <MessageCircleQuestion size={14} aria-hidden="true" />
                讨论题
              </p>
              <p className="edu-spot__text">{spot.question}</p>
            </div>
            <div className="edu-spot__cell">
              <p className="edu-spot__label">
                <Lightbulb size={14} aria-hidden="true" />
                可以做的事
              </p>
              <p className="edu-spot__text">{spot.action}</p>
            </div>
          </div>

          <Link className="link-arrow" to="/education">
            更多板块的育人角度
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
