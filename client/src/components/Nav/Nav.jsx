import styles from './Nav.module.css';
import { NavLink } from 'react-router-dom';
import NavLinkCustom from '../NavLink/NavLinkCustom.jsx';

export default function Nav() {
  const links = [
    { title: 'CSV Аналитик', icon: 'upload', to: '/upload' },
    { title: 'CSV Генератор', icon: 'plus', to: '/generator' },
    { title: 'История', icon: 'history', to: '/history' },
  ];

  return (
    <nav className={styles.nav}>
      <ul className={styles.list}>
        {links.map(({ title, icon, to }) => (
          <li key={to} className={styles.marginR}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? styles.active : '')}
              style={{ textDecoration: 'none', position: 'relative' }}
              end
            >
              <NavLinkCustom title={title} icon={icon} />
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
