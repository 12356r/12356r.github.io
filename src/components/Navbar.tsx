import { ChevronDown, Menu, Moon, Search, Star, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS, SITE } from '../data/site';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../hooks/useTheme';
import { useScrolled } from '../hooks/useUi';
import SearchOverlay from './SearchOverlay';

function Logo() {
  return (
    <Link to="/" className="brand" aria-label={`${SITE.name} 首页`}>
      <span className="brand__mark" aria-hidden="true">
        <img
          src="/brand/zzu-emblem.png"
          srcSet="/brand/zzu-emblem-sm.png 192w"
          width={44}
          height={44}
          alt=""
          decoding="async"
        />
      </span>
      <span className="brand__text">
        <span className="brand__cn">郑州大学</span>
        <span className="brand__en">ZHENGZHOU UNIVERSITY</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  /** 悬停展开（临时）与点击固定（保持展开）分开管理 */
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const openGroup = hovered ?? pinned;
  const groupRef = useRef<HTMLDivElement | null>(null);
  const scrolled = useScrolled(20);
  const { count } = useFavorites();
  const { resolved: theme, toggle: toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setHovered(null);
    setPinned(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!openGroup) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinned(null);
        setHovered(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (groupRef.current && !groupRef.current.contains(e.target as Node)) {
        setPinned(null);
        setHovered(null);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [openGroup]);

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav__inner">
          <Logo />

          <nav className="nav__links" aria-label="主导航">
            {NAV_ITEMS.map((item) => {
              if (!item.children) {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to as string}
                    end={item.to === '/'}
                    className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="nav__link-cn">{item.label}</span>
                    <span className="nav__link-en">{item.en}</span>
                  </NavLink>
                );
              }

              const childActive = item.children.some((c) => location.pathname.startsWith(c.to));
              const open = openGroup === item.label;
              return (
                <div
                  key={item.label}
                  className="nav__group"
                  ref={groupRef}
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(null);
                  }}
                >
                  <button
                    type="button"
                    className={`nav__link nav__link--group ${childActive ? 'is-active' : ''}`}
                    aria-expanded={open}
                    aria-haspopup="true"
                    onClick={() => {
                      // 点击即固定展开：即使移开鼠标，菜单也保持打开，再次点击收起
                      setPinned((p) => (p === item.label ? null : item.label));
                      setHovered(null);
                    }}
                    onFocus={() => setHovered(item.label)}
                  >
                    <span className="nav__link-cn">{item.label}</span>
                    <span className="nav__link-en">{item.en}</span>
                    <ChevronDown size={12} className="nav__chev" aria-hidden="true" />
                  </button>

                  <div className={`nav__dropdown ${open ? 'is-open' : ''}`} role="menu" aria-label={item.label}>
                    <p className="nav__dropdown-title">{item.label}</p>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        role="menuitem"
                        className={({ isActive }) => `nav__dropdown-link ${isActive ? 'is-active' : ''}`}
                        onClick={() => {
                          setPinned(null);
                          setHovered(null);
                        }}
                      >
                        <span>{child.label}</span>
                        <span className="nav__dropdown-en">{child.en}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="nav__actions">
            <button type="button" className="nav__search" onClick={() => setSearchOpen(true)} aria-label="打开站内搜索">
              <Search size={16} aria-hidden="true" />
              <span>搜索</span>
            </button>
            <button
              type="button"
              className="nav__icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            >
              {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            </button>
            <Link to="/favorites" className="nav__icon" aria-label={`我的收藏（${count} 项）`}>
              <Star size={18} aria-hidden="true" />
              {count > 0 ? <span className="nav__badge">{count > 99 ? '99+' : count}</span> : null}
            </Link>
            <button
              type="button"
              className="nav__hamburger"
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div id="mobile-menu" className="nav__mobile is-open">
            <nav aria-label="移动端导航">
              <ul>
                {NAV_ITEMS.map((item) =>
                  item.children ? (
                    <li key={item.label} className="nav__mobile-group">
                      <p className="nav__mobile-heading">
                        <span>{item.label}</span>
                        <span className="nav__mobile-en">{item.en}</span>
                      </p>
                      <ul className="nav__mobile-sub">
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <NavLink
                              to={child.to}
                              className={({ isActive }) => `nav__mobile-link nav__mobile-link--sub ${isActive ? 'is-active' : ''}`}
                            >
                              <span>{child.label}</span>
                              <span className="nav__mobile-en">{child.en}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li key={item.to}>
                      <NavLink
                        to={item.to as string}
                        end={item.to === '/'}
                        className={({ isActive }) => `nav__mobile-link ${isActive ? 'is-active' : ''}`}
                      >
                        <span>{item.label}</span>
                        <span className="nav__mobile-en">{item.en}</span>
                      </NavLink>
                    </li>
                  ),
                )}
                <li>
                  <NavLink to="/news" className={({ isActive }) => `nav__mobile-link ${isActive ? 'is-active' : ''}`}>
                    <span>资讯与公告</span>
                    <span className="nav__mobile-en">NEWS</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className={({ isActive }) => `nav__mobile-link ${isActive ? 'is-active' : ''}`}>
                    <span>关于本站</span>
                    <span className="nav__mobile-en">ABOUT</span>
                  </NavLink>
                </li>
              </ul>
            </nav>
            <button type="button" className="btn btn--ghost" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}>
              <Search size={16} aria-hidden="true" /> 搜索站内内容
            </button>
          </div>
        ) : null}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
