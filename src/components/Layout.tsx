import { ArrowUp } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import EduNote from './EduNote';
import PageFallback from './PageFallback';
import { useScrollProgress, useScrolled } from '../hooks/useUi';
import { usePageMeta } from '../hooks/usePageMeta';
import { getRouteMeta } from '../utils/routeMeta';

function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${progress})` }}
      role="progressbar"
      aria-label="页面浏览进度"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    />
  );
}

function ToTop() {
  const visible = useScrolled(700);
  return (
    <button
      type="button"
      className={`to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="返回顶部"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}

export default function Layout() {
  const { pathname, search } = useLocation();
  const meta = getRouteMeta(pathname);
  usePageMeta(meta.title || undefined, meta.desc);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return (
    <>
      <a className="skip-link" href="#main">
        跳到主要内容
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main" key={pathname} className="page-enter">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
        <div className="container">
          <EduNote route={pathname} />
        </div>
      </main>
      <Footer />
      <ToTop />
    </>
  );
}
