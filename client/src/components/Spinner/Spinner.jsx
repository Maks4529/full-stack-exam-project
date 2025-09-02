import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './Spinner.module.sass';

function SpinnerLoader() {
  return (
    <div className={styles.loaderContainer}>
      <ClipLoader
        size={50}
        color="#46568a"
        loading
      />
    </div>
  );
}

export default SpinnerLoader;
