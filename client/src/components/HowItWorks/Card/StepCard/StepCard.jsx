import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import styles from './StepCard.module.sass';

function StepCard(props) {
  const { step, description } = props;

  return (
    <article className={styles.stepCard}>
      <span className={styles.step}>{`Step ${step}`}</span>
      <p className={styles.description}>{description}</p>
      {step <= 3 && (
        <FontAwesomeIcon icon={faArrowRight} className={styles.arrow} />
      )}
    </article>
  );
}

export default StepCard;
