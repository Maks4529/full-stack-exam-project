import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './InputSearch.module.sass';

function InputSearch() {
  return (
    <form className={styles.searchContainer}>
      <span className={styles.leftIcon}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </span>
      <input
        className={styles.searchInput}
        type="text"
        name="search"
        placeholder="Search Over 300,000+ Premium Names"
      />
      <button className={styles.searchButton} type="submit">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
}

export default InputSearch;