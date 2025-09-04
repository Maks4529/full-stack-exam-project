import { Component } from 'react';
import Header from '../../components/HowItWorks/Header/Header';
import styles from './HowItWorks.module.sass';

class HowItWorksPage extends Component {
  render () {
    return (
        <>
      <Header />
      <main className={styles.howItWorksPage}>
        <div className={styles.container1}>
        <div className={styles.titleContainer}>
          <div className={styles.blueMessage}>World's #1 Naming Platform</div>
          <h1>How Does Atom Work?</h1>
          <p className={styles.description}>
            Atom helps you come up with a great name for your business by
            combining the power of crowdsourcing with sophisticated technology
            and Agency-level validation services.
          </p>
        </div>
        <div className={styles.videoContainer}>
          <iframe
            width='100%'
            height='100%'
            src='https://www.youtube.com/embed/Qlbm9p3pd-w'
            title='Atom How It Works'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          ></iframe>
        </div>
        </div>
      </main>
        </>
    );
  }
}

export default HowItWorksPage;
