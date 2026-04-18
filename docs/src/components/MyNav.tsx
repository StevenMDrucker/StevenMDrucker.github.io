import { NavLink } from 'react-router-dom';

export function MyNav() {
  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <NavLink className="site-brand" to="/about">
          Steven M.&nbsp;<span className="brand-accent">Drucker</span>
        </NavLink>
        <ul className="site-nav-links">
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/about">
              Bio
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/Featured">
              Featured
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/Research">
              Research
            </NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/CV">
              CV
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
