import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

export default function EmptyState({
  title,
  desc,
  action,
  icon,
}: {
  title: string;
  desc?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="empty" role="status">
      <div className="empty__icon">{icon ?? <SearchX size={26} aria-hidden="true" />}</div>
      <h3>{title}</h3>
      {desc ? <p>{desc}</p> : null}
      {action}
    </div>
  );
}
