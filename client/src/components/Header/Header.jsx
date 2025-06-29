import styles from './Header.module.css';
import HeaderLogo from '../../components/HeaderLogo/HeaderLogo.jsx';
import Nav from '../../components/Nav/Nav.jsx';

export default function Header() {
  return (
    <header className={`${styles.container} ${styles.wrapper}`}>
      <HeaderLogo />
      <Nav />
    </header>
  );
}
