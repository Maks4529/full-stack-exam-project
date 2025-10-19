import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './ItemCard.module.sass';
function ItemCard(props) {
    const {icon, iconAlt, title, description, link, linkBody} = props;

  return (
    <article className={styles.itemCards}>
        <img src={icon} className={styles.icon} alt={iconAlt} />
        <h3>{title}</h3>
        <p className={styles.description}>{description}</p>
        <Link className={styles.link} to={link}>{linkBody} <FontAwesomeIcon icon={faArrowRight} size="lg" /></Link>
    </article>
  )
}

export default ItemCard;