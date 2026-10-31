import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="面包屑导航">
      <Link to="/" aria-label="返回首页">
        <Home size={14} aria-hidden="true" style={{ display: 'inline', verticalAlign: '-2px' }} />
      </Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <ChevronRight size={13} aria-hidden="true" style={{ opacity: 0.6 }} />
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
