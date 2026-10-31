import { Link } from 'react-router-dom';
import type { CampusPlace } from '../data/types';
import { campusName } from '../data/campuses';
import Media from './Media';
import FavoriteButton from './FavoriteButton';
import VerificationBadge from './VerificationBadge';

export default function PlaceCard({ place }: { place: CampusPlace }) {
  return (
    <article className="card card--hover place-card">
      <div className="card__media">
        <Media
          art={place.art}
          image={place.image}
          alt={`${place.name}${place.image ? ' 校园实景照片' : '（示意图）'}`}
        />
        <FavoriteButton id={`place-${place.id}`} label={place.name} variant="float" />
        <span className="place-card__campus">{campusName(place.campus)}</span>
      </div>
      <div className="card__body">
        <div className="place-card__meta">
          <span className="tag">{place.category}</span>
          <VerificationBadge status={place.verification} compact />
        </div>
        <h3 className="card__title">
          <Link to={`/scenery/${place.id}`} className="card__hit">
            {place.name}
          </Link>
        </h3>
        <p className="card__desc">{place.summary}</p>
        <div className="card__foot">
          <span className="link-arrow">查看详情</span>
          <span className="place-card__en">{place.nameEn}</span>
        </div>
      </div>
    </article>
  );
}
