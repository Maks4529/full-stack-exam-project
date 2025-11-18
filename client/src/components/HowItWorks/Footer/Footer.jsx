import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import FOOTER_DATA from './footerData';
import styles from './Footer.module.sass';

function Footer() {
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleAccordionClick = (title) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerTop}>
        {Object.entries(FOOTER_DATA).map(([title, items]) => (
          <div key={title} className={styles.column}>
            <button
              type="button"
              className={styles.titleButton}
              onClick={() => handleAccordionClick(title)}
            >
              {title}
              <FontAwesomeIcon
                className={styles.accordionIcon}
                icon={openAccordion === title ? faChevronUp : faChevronDown}
              />
            </button>

            <ul
              className={`${styles.list} ${openAccordion === title ? styles.open : ''}`}
            >
              {items.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.bottomCenter}>
          <div className={styles.rating}>
            <a href="https://www.trustpilot.com/review/atom.com">
              <b>EXCELLENT</b>
              <div className={styles.stars}>
                <img
                  className={styles.star}
                  src="staticImages/howItWorks/trustpilot.png"
                  alt="trustpilot"
                />
                <img
                  className={styles.star}
                  src="staticImages/howItWorks/trustpilot.png"
                  alt="trustpilot"
                />
                <img
                  className={styles.star}
                  src="staticImages/howItWorks/trustpilot.png"
                  alt="trustpilot"
                />
                <img
                  className={styles.star}
                  src="staticImages/howItWorks/trustpilot.png"
                  alt="trustpilot"
                />
                <img
                  className={styles.star}
                  src="staticImages/howItWorks/trustpilot.png"
                  alt="trustpilot"
                />
              </div>
              <span>Trustpilot</span>
            </a>
          </div>
          <div className={styles.reviews}>
            <span>4.5 / 5</span> based on 728 ratings
          </div>
        </div>

        <ul className={styles.bottomRight}>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </li>
          <li>
            <a href="#">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </li>
        </ul>

        <div className={styles.bottomLeft}>
          <p>Copyright © 2025 Atom.com • Consent Preferences</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
