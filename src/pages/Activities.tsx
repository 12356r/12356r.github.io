import { GraduationCap } from 'lucide-react';
import EduSpot from '../components/EduSpot';
import PageBanner from '../components/PageBanner';
import SectionHead from '../components/SectionHead';
import { ACTIVITY_FEATURES } from '../data/activityFeatures';

export default function Activities() {
  return (
    <>
      <PageBanner
        art={{ kind: 'banner', seed: 21, mood: 'dusk' }}
        eyebrow="CAMPUS ACTIVITIES"
        title="社团活动 · 让青春更加丰富"
        desc="社团是学生自己张罗的一片天地：谁定规则、经费怎么分、活动散场谁留下收尾。在这里学到的东西，往往不在课本上。"
        crumbs={[{ label: '社团活动' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="WHAT WE DID"
            title="三场活动，三种成长"
            desc="科技、文化、组织生活——三张现场照片，对应三种不同的能力训练。"
          />

          <div className="act-feature-grid">
            {ACTIVITY_FEATURES.map((f) => (
              <article className="act-feature" key={f.id}>
                <div className="act-feature__media">
                  <img
                    src={f.image}
                    alt={f.imageAlt}
                    decoding="async"
                    width={900}
                    height={675}
                  />
                  <span className="act-feature__theme">{f.theme}</span>
                </div>
                <div className="act-feature__body">
                  <h3 className="act-feature__name">{f.name}</h3>
                  <p className="act-feature__when">
                    {f.when}
                    {f.organizer ? ` · ${f.organizer}` : ''}
                  </p>
                  <p className="act-feature__summary">{f.summary}</p>
                  <ul className="act-feature__details">
                    {f.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p className="act-feature__edu">
                    <GraduationCap size={14} aria-hidden="true" />
                    {f.edu}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <EduSpot route="/activities" />
    </>
  );
}
