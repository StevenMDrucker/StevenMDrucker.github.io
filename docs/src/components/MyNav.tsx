import { NavLink } from 'react-router-dom';

export function MyNav() {
  return (
    <div className="row my-2">
      <div className="col-lg-1"></div>
      <div className="col-lg-8">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/about">Bio</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/Featured">Featured</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/Research">Research</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/CV">CV</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
