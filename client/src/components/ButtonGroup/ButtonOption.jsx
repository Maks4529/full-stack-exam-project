import React from 'react';
import classNames from 'classnames';
import styles from './ButtonOption.module.sass';

function ButtonOption({
  id,
  title,
  description,
  isRecommended,
  isSelected,
  onSelect,
}) {

  const cardClasses = classNames(styles.buttonCard, {
    [styles.active]: isSelected,
  });

  const handleClick = () => {
    onSelect(id);
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      {isRecommended && (
        <span className={styles.badge}>Recommended</span>
      )}
      <div className={styles.buttonCardHeader}>
        <h3>{title}</h3>
        {isSelected && <span className={styles.check}>✔</span>}
      </div>
      <p>{description}</p>
    </div>
  );
}

export default React.memo(ButtonOption);