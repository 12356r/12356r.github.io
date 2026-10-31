import { Star } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface Props {
  id: string;
  label?: string;
  variant?: 'inline' | 'float';
}

/** 收藏按钮：状态写入 localStorage，刷新与再次访问后保持。 */
export default function FavoriteButton({ id, label = '收藏', variant = 'inline' }: Props) {
  const { has, toggle } = useFavorites();
  const active = has(id);

  return (
    <button
      type="button"
      className={`fav-btn ${variant === 'float' ? 'fav-btn--float' : ''}`}
      aria-pressed={active}
      aria-label={active ? `取消收藏：${label}` : `收藏：${label}`}
      title={active ? '取消收藏' : '收藏'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
    >
      <Star size={15} strokeWidth={2.2} fill={active ? 'currentColor' : 'none'} aria-hidden="true" />
      {variant === 'inline' ? <span>{active ? '已收藏' : '收藏'}</span> : null}
    </button>
  );
}
