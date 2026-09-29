import { NavLink } from 'react-router';

const PAGES = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'radar', label: 'Radar', path: '/radar' },
  { id: 'focus', label: 'Focus', path: '/focus' },
  { id: 'profile', label: 'Autori', path: '/profile' },
  { id: 'archive', label: 'Archivio', path: '/archive' },
]; 

/**
 * Header della piattaforma con navigazione principale.
 * @returns {React.JSX.Element} - Componente Header.
 */
function Header() {
  return (
    <header className="header">
      <div className="header-shell">
        <NavLink className="brand" to="/" end>
          <span className="brand-mark">S</span>
          <span className="brand-copy">
            <strong>Signal Atlas</strong>
            <small>Hacker News re-immaginato</small>
          </span>
        </NavLink>
        <nav className="header-nav" aria-label="Navigazione principale">
          <ul>
            {PAGES.map((page) => (
              <li key={page.id}>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to={page.path}
                  end={page.path === '/'}
                >
                  {page.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
