import styles from './NavLink.module.css';
export default function NavLinkCustom({ title, icon, isActive = false }) {
  return (
    <>
      <div className={styles.item}>
        <span
          className={`${styles.link} ${styles[icon]} ${isActive && styles.active}`}
        >
          {title}
        </span>
      </div>
    </>
  );
}
