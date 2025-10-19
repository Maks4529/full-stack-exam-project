import React from 'react';
import styles from './NextButton.module.sass';

function NextButton(props) {
  const { submit } = props;

  return (
    <div onClick={submit} className={styles.buttonContainer}>
      <span>Next</span>
    </div>
  );
}

export default NextButton;
