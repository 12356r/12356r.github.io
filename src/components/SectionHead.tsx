import type { ReactNode } from 'react';

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  desc?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
}

export default function SectionHead({ eyebrow, title, desc, action, align = 'left' }: SectionHeadProps) {
  return (
    <div className="section-head" style={align === 'center' ? { justifyContent: 'center', textAlign: 'center' } : undefined}>
      <div className="section-head__main">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {desc ? <p>{desc}</p> : null}
      </div>
      {action ? <div className="section-head__action">{action}</div> : null}
    </div>
  );
}
