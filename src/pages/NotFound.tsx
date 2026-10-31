import { ArrowLeft, Compass, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SceneArt from '../components/SceneArt';
import { NAV_FLAT } from '../data/site';

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container notfound__inner">
        <div className="notfound__art" aria-hidden="true">
          <SceneArt art={{ kind: 'map', seed: 8 }} />
        </div>
        <p className="eyebrow">404 · PAGE NOT FOUND</p>
        <h1>这条小路通往校园外</h1>
        <p className="lead">
          页面可能已经移动或链接有误。可以回到首页，或从下面的栏目继续浏览。
        </p>
        <div className="notfound__actions">
          <Link className="btn" to="/">
            <HomeIcon size={15} aria-hidden="true" />
            回到首页
          </Link>
          <Link className="btn btn--ghost" to="/scenery">
            <Compass size={15} aria-hidden="true" />
            浏览校园风光
          </Link>
          <Link className="btn btn--ghost" to="/search">
            <ArrowLeft size={15} aria-hidden="true" />
            站内搜索
          </Link>
        </div>
        <div className="chips notfound__links">
          {NAV_FLAT.filter((item) => item.to !== '/').map((item) => (
            <Link key={item.to} to={item.to} className="chip">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
