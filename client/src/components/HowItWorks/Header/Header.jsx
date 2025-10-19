import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCircleUser, faPhone, faHeart, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import CONSTANTS from '../../../constants';
import styles from './Header.module.sass';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <Link to='/'>
        <img
          className={styles.logo}
          src={`${CONSTANTS.STATIC_IMAGES_PATH}/howItWorks/atom-logo.webp`}
          alt="atom-logo"
        />
      </Link>

      <button className={styles.burger} onClick={toggleMenu}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </button>
      <ul className={`${styles.linkList} ${isOpen ? styles.open : ''}`}>
        <li className={styles.menuLink}><a href='https://google.com'>Domains for Sale</a></li>
        <li className={styles.menuLink}><a href='https://google.com'>Naming & Branding</a></li>
        <li className={styles.menuLink}><a href='https://google.com'>Research & Testing</a></li>
        <li className={styles.menuLink}><a href='https://google.com'>Trademarks</a></li>
        <li className={styles.menuLink}><a href='https://google.com'>Resources</a></li>
      </ul>
      <ul className={styles.iconList}>
        <li className={styles.menuIcon}><FontAwesomeIcon icon={faMagnifyingGlass} size="lg" /></li>
        <li className={styles.menuIcon}><FontAwesomeIcon icon={faCircleUser} size="lg" /></li>
        <li className={styles.menuIcon}><FontAwesomeIcon icon={faPhone} size="lg" /></li>
        <li className={styles.menuIcon}><FontAwesomeIcon icon={faHeart} size="lg" /></li>
      </ul>
    </header>
  );
}

export default Header;
