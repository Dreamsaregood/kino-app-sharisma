import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className={styles.sidebarBg}>
      <nav className={styles.menuList}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.menuItemActive + ' ' + styles.menuItem : styles.menuItem}>Фильмы</NavLink>
        <NavLink to="/series" className={({ isActive }) => isActive ? styles.menuItemActive + ' ' + styles.menuItem : styles.menuItem}>Сериалы</NavLink>
        <NavLink to="/tv" className={({ isActive }) => isActive ? styles.menuItemActive + ' ' + styles.menuItem : styles.menuItem}>ТВ</NavLink>
        {user && (
          <NavLink to="/favorites" className={({ isActive }) => isActive ? styles.menuItemActive + ' ' + styles.menuItem : styles.menuItem}>
            <span className={styles.menuItemIcon}>★</span>
            Избранное
          </NavLink>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;