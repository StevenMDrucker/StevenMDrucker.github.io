import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ParticleLogo } from './ParticleLogo';

export function MyNav() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light');

  useEffect(() => {
    if (dark) {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <nav className="site-nav">
      <div className="site-nav-inner">
        <NavLink className="site-brand" to="/about" style={{ display: 'flex', alignItems: 'center' }}>
          <ParticleLogo fontSize={18} height={44} />
        </NavLink>
        <ul className="site-nav-links">
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/about">Bio</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/Featured">Featured</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/Research">Research</NavLink>
          </li>
          <li>
            <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/CV">CV</NavLink>
          </li>
          <li>
            <a className="site-nav-link" href="/StevenDrucker_Resume.pdf" target="_blank" rel="noreferrer">Resume</a>
          </li>
          <li>
            <button
              className="theme-toggle"
              onClick={() => setDark(d => !d)}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
