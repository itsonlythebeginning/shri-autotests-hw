import styles from './HeaderLogo.module.css';
import Logo from '../../assets/svg/logo-pic.svg';

export default function HeaderLogo() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.logo}>
          <a href="#" className={styles.logoLink}>
            <img src={Logo} alt="Логотип мероприятия" />
          </a>
          <h1 className={styles.logoTitle}>Межгалактическая аналитика</h1>
        </div>
      </div>
    </>
  );
}
