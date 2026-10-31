import { ArrowRight, BookOpen, ExternalLink, FlaskConical, GraduationCap, Quote, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import Reveal from '../components/Reveal';
import SectionHead from '../components/SectionHead';
import { MASTER_SOURCE, MASTER_TEACHERS, TEACHERS, TEACHER_LESSONS } from '../data/teachers';

const CATEGORY_LABEL: Record<string, string> = {
  science: '科研·育人',
  medical: '医学·临床',
  teaching: '教学名师',
};

const CATEGORY_ICON = {
  science: FlaskConical,
  medical: Stethoscope,
  teaching: GraduationCap,
} as const;

export default function Teachers() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = TEACHERS.find((t) => t.id === openId) ?? null;

  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 41, mood: 'autumn' }}
        eyebrow="CAMPUS MENTORS"
        title="校园名师 · 讲台、实验室与病房"
        desc="名师不是墙上的照片，是他们在实验室、在讲台、在病房里具体做过的事。读几篇他们的故事，你会明白「求是 担当」这四个字，是怎么被一天天过出来的。"
        crumbs={[{ label: '校园名师' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="WHY THIS PAGE"
            title="为什么值得花十分钟读一读"
            desc="一所大学的底色，往往写在几位老师的日常里：他们怎么对待一次实验、一份论文、一个学生。下面九位师者的事迹都来自学校官网、院系官网与新闻网的长篇报道——读完之后，你大概能明白「求是 担当」不是墙上的四个字。"
          />

          <div className="teacher-grid">
            {TEACHERS.map((t, i) => {
              const Icon = CATEGORY_ICON[t.category] ?? GraduationCap;
              return (
                <Reveal key={t.id} delay={i * 80}>
                  <article className="teacher-card">
                    <div className="teacher-card__head">
                      <span className="teacher-card__avatar" aria-hidden="true">
                        {t.name.slice(0, 1)}
                      </span>
                      <div>
                        <h3 className="teacher-card__name">{t.name}</h3>
                        <p className="teacher-card__honor">
                          <Icon size={13} aria-hidden="true" />
                          {t.honor}
                        </p>
                        <p className="teacher-card__unit">
                          {t.unit} · {t.field}
                        </p>
                      </div>
                      <span className="teacher-card__cat">{CATEGORY_LABEL[t.category]}</span>
                    </div>

                    <p className="teacher-card__summary">{t.summary}</p>

                    {t.quote ? (
                      <blockquote className="teacher-card__quote">
                        <Quote size={14} aria-hidden="true" />
                        {t.quote}
                      </blockquote>
                    ) : null}

                    <div className="teacher-card__tags">
                      {t.spirit.map((s) => (
                        <span key={s} className="teacher-card__tag">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="teacher-card__foot">
                      <span className="teacher-card__years">{t.years}</span>
                      <button type="button" className="link-arrow" onClick={() => setOpenId(t.id)}>
                        读事迹
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="respect-band">
            <p className="respect-band__eyebrow">TO EVERY TEACHER</p>
            <h2 className="respect-band__title">郑大的每一位老师，都很厉害，都值得尊敬</h2>
            <p className="respect-band__text">
              这一页只能放下九个人，但郑州大学有几千名专任教师。有人把一门基础课上成全校抢着选的课，有人在实验室里守着一条曲线十几年，
              有人深夜还在回学生的邮件，有人把学生送进医院、送进车间、送进讲台。他们没有长篇报道，也没有头衔加身，
              但同样在把「求是 担当」四个字过成日子。
            </p>
            <p className="respect-band__text">
              所以，看到没被写进这一页的名字，不必觉得他们「不够格」——只是还没有人替他们把故事写下来。
              如果你身边有这样的老师，欢迎在 <Link to="/board">校园贴吧</Link> 里写下他/她做过的一件具体的小事。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="MASTER TEACHERS"
            title="国家级教学名师"
            desc="教育部国家级教学名师评选面向长期承担本科教学任务的一线教师。下面是郑州大学教务部公布的名单，按入选年份排列。"
            action={
              <a className="btn btn--ghost btn--sm" href={MASTER_SOURCE.url} target="_blank" rel="noopener noreferrer">
                查看原始名单
                <ExternalLink size={13} aria-hidden="true" />
              </a>
            }
          />

          <div className="master-list">
            {MASTER_TEACHERS.map((m, i) => (
              <div className="master-row" key={m.name}>
                <span className="master-row__year">{m.year}</span>
                <span className="master-row__name">{m.name}</span>
                <span className="master-row__unit">{m.unit}</span>
                <span className="master-row__badge">国家级教学名师</span>
                {i === 0 ? <span className="master-row__note">首批</span> : null}
              </div>
            ))}
          </div>

          <p className="master-note">
            <BookOpen size={14} aria-hidden="true" />
            名单只包含姓名、所在院系与入选年份；更详细的从教经历可到各学院官网查询，本站不补写未经核实的履历。
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="WHAT WE LEARN"
            title="他们身上共通的东西"
            desc="以下三点是根据上文两位师者的公开事迹做出的归纳，不是新的「史料」。"
          />
          <ol className="lesson-list">
            {TEACHER_LESSONS.map((l, i) => (
              <li className="lesson" key={l.title}>
                <span className="lesson__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="lesson__title">{l.title}</h3>
                <p className="lesson__text">{l.text}</p>
              </li>
            ))}
          </ol>

          <div className="notice" style={{ marginTop: 26 }}>
            <BookOpen size={16} aria-hidden="true" />
            <p>
              <strong>内容说明：</strong>
              本页人物与事迹均整理自郑州大学官网「郑大人物」「郑大故事」栏目与教务部名单（2026-10），
              每条都附原文链接。学校师资队伍规模庞大，这里只收录了有公开长篇报道或官方名录的几位，不代表全部。
            </p>
          </div>
        </div>
      </section>

      {/* 事迹详情 */}
      {open ? (
        <div className="teacher-modal" role="dialog" aria-modal="true" aria-label={`${open.name} 的事迹`} onClick={() => setOpenId(null)}>
          <div className="teacher-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="teacher-modal__close" onClick={() => setOpenId(null)} aria-label="关闭">
              ×
            </button>
            <p className="teacher-modal__eyebrow">{CATEGORY_LABEL[open.category]}</p>
            <h2 className="teacher-modal__name">
              {open.name}
              <span>{open.honor}</span>
            </h2>
            <p className="teacher-modal__meta">
              {open.unit} · {open.field} · {open.years}
            </p>

            <div className="teacher-modal__body">
              {open.story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {open.quote ? (
              <blockquote className="teacher-modal__quote">
                <Quote size={16} aria-hidden="true" />
                {open.quote}
              </blockquote>
            ) : null}

            <div className="teacher-card__tags">
              {open.spirit.map((s) => (
                <span key={s} className="teacher-card__tag">
                  {s}
                </span>
              ))}
            </div>

            <div className="teacher-modal__sources">
              <p className="teacher-modal__label">延伸阅读</p>
              {open.sources.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={13} aria-hidden="true" />
                  {s.label}
                </a>
              ))}
              <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
                整理日期：{open.updatedAt}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
