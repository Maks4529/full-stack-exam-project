import { Component } from 'react';
import Header from '../../components/HowItWorks/Header/Header';
import ItemCard from '../../components/HowItWorks/Card/ItemCard/ItemCard';
import StepCard from '../../components/HowItWorks/Card/StepCard/StepCard';
import AccordionFaq from '../../components/HowItWorks/Accordion/AccordionFaq';
import InputSearch from '../../components/HowItWorks/InputSearch/InputSearch';
import CONSTANTS from '../../constants';
import DATA from '../../components/HowItWorks/howItWorksData';
import styles from './HowItWorks.module.sass';
import Footer from '../../components/HowItWorks/Footer/Footer';

class HowItWorksPage extends Component {
  render () {
    return (
        <>
      <Header />
      <main className={styles.howItWorksPage}>
        <section className={styles.container1}>
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
        </section>
        <section className={styles.container2}>
          <div className={styles.blueMessage}>Our Services</div>
          <h2>3 Ways To Use Atom</h2>
          <p className={styles.description}>
            Atom offers 3 ways to get you a perfect name for your business.
          </p>
          <div className={styles.cardsContainer}>
            <ItemCard  icon={`${CONSTANTS.STATIC_IMAGES_PATH}/howItWorks/lightning.svg`} iconAlt={`lighting`} title={'Launch a Contest'} description={'Work with hundreds of creative experts to get custom name suggestions for your business or brand. All names are auto-checked for URL availability.'} link={'/startContest'} linkBody={'Launch a Contest'}/>
            <ItemCard  icon={`${CONSTANTS.STATIC_IMAGES_PATH}/howItWorks/computer.svg`} iconAlt={`computer`} title={'Explore Names For Sale'} description={'Our branding team has curated thousands of pre-made names that you can purchase instantly. All names include a matching URL and a complimentary Logo Design.'} link={'/namesForSale'} linkBody={'Explore Names For Sale'}/>
            <ItemCard  icon={`${CONSTANTS.STATIC_IMAGES_PATH}/howItWorks/lamp.svg`} iconAlt={`lamp`} title={'Agency-level Managed Contests'} description={'Our Managed contests combine the power of crowdsourcing with the rich experience of our branding consultants. Get a complete agency-level experience at a fraction of Agency costs.'} link={'/managedContests'} linkBody={'Learn More'}/>
          </div>
        </section>
        <section className={styles.container3}>
          <img src={`${CONSTANTS.STATIC_IMAGES_PATH}/howItWorks/trophy.svg`} alt="trophy" />
          <h2>How Do Naming Contests Work?</h2>
          <div className={styles.stepsContainer}>
          <StepCard step={'1'} description={'Fill out your Naming Brief and begin receiving name ideas in minutes'} />
          <StepCard step={'2'} description={'Rate the submissions and provide feedback to creatives. Creatives submit even more names based on your feedback.'} />
          <StepCard step={'3'} description={'Our team helps you test your favorite names with your target audience. We also assist with Trademark screening.'} />
          <StepCard step={'4'} description={'Pick a Winner. The winner gets paid for their submission.'} />
          </div>
        </section>
        <section className={styles.container4}>
          <h2>Frequently Asked Questions</h2>
          <AccordionFaq />
          <InputSearch />
          <ul className={styles.tagsContainer}>
            {DATA.tags.map((tag, index) => <li key={index} className={styles.tag}><a href={tag.link}>{tag.title}</a></li>)}
          </ul>
        </section>
      </main>
      <Footer />
        </>
    );
  }
}

export default HowItWorksPage;
