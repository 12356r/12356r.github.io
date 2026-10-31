import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { EDU_INTRO, EDU_LINKS, EDU_USES } from '../data/education';

export default function Education() {
  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 33, mood: 'autumn' }}
        eyebrow="EDUCATION"
        title="思政育人 · 把价值判断落到具体的事上"
        desc={EDU_INTRO}
        crumbs={[{ label: '思政育人' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="EIGHT VIEWS"
            title="八个板块，八种育人角度"
            desc="每个板块都对应一个思政主题，并给出「怎么看」「怎么用」。材料都来自站内已整理的内容，可到对应页面查看。"
          />

          <div className="edu-grid">
            {EDU_LINKS.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 7) * 50}>
                <article className="edu-card">
                  <div className="edu-card__top">
                    <span className="edu-card__index">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="edu-card__title">
                        <Link to={e.route}>{e.label}</Link>
                      </h3>
                      <p className="edu-card__en">{e.en}</p>
                    </div>
                    <span className="edu-card__theme">{e.theme}</span>
                  </div>

                  <p className="edu-card__link">{e.link}</p>

                  <ul className="edu-card__points">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>

                  <Link className="link-arrow" to={e.route}>
                    去{e.label}
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead
            eyebrow="HOW TO USE"
            title="三种常见用法"
            desc="这不是一份「学习材料」，而是一个可以带着走一遍的校园。"
          />
          <ol className="lesson-list">
            {EDU_USES.map((u, i) => (
              <li className="lesson" key={u.title}>
                <span className="lesson__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="lesson__title">{u.title}</h3>
                <p className="lesson__text">{u.text}</p>
              </li>
            ))}
          </ol>

          <div className="notice" style={{ marginTop: 26 }}>
            <BookOpen size={16} aria-hidden="true" />
            <p>
              <strong>说明：</strong>
              本页只做「板块—主题—用法」的对应，不替代思政课程内容；涉及人物与事迹的部分，均可在对应页面找到官网原文链接。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="respect-band">
            <p className="respect-band__eyebrow">ONE MORE THING</p>
            <h2 className="respect-band__title">
              <Sparkles size={20} aria-hidden="true" /> 校园本身就是教材
            </h2>
            <p className="respect-band__text">
              <GraduationCap size={14} aria-hidden="true" />{' '}
              一次实验、一间宿舍、一顿饭、一条留言，都比一句口号更能说明「什么是好的」。这个站点把可核验的材料整理在一起，
              剩下的那一步——带着学生走过去、停下来、问一句为什么——留给老师。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
