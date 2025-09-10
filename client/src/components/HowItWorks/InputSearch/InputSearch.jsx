import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import styles from './InputSearch.module.sass';

function InputSearch() {
  return (
    <form className={styles.inputContainer}>
    <input className={styles.input} type="text" name="search" placeholder='Search Over 300,000+ Premium Names'/>
    <button className={styles.button} type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
    </form>
  )
}

export default InputSearch;