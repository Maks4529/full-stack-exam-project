import { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DATA from '../howItWorksData';
import styles from './AccordionFaq.module.sass';

function AccordionFaq () {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);
  const {
    menuItems,
    questionsBody1,
    questionsBody2,
    questionsBody3,
    questionsBody4,
  } = DATA;

  const toggleQuestion = (section, index) => {
    setOpenQuestion(
      openQuestion?.section === section && openQuestion?.index === index
        ? null
        : { section, index }
    );
  };

  return (
    <article className={styles.faqContainer}>
      <ul className={styles.listFaq}>
        {menuItems.map((item, index) => (
          <li
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={classNames({ [styles.active]: activeIndex === index })}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
      <div className={styles.questionsContainer}>
        <h3 id='question1'>Launching A Contest</h3>
        <ul className={styles.questionsList}>
          {questionsBody1.map(( item, index) => (
            <li
              key={index}
              onClick={() => toggleQuestion('questionsBody1', index)}
              className={classNames(styles.question, {
                [styles.open]:
                  openQuestion?.section === 'questionsBody1' &&
                  openQuestion?.index === index,
              })}
            >
              <span className={styles.questionText}>{item.question}</span>
              <span className={styles.plus}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
              {openQuestion?.section === 'questionsBody1' &&
                openQuestion?.index === index && (
                  <p className={styles.answer}>{item.answer}</p>
                )}
            </li>
          ))}
        </ul>
        <h3 id='question2'>Buying From Marketplace</h3>
        <ul className={styles.questionsList}>
          {questionsBody2.map((item, index) => (
            <li
              key={index}
              onClick={() => toggleQuestion('questionsBody2', index)}
              className={classNames(styles.question, {
                [styles.open]:
                  openQuestion?.section === 'questionsBody2' &&
                  openQuestion?.index === index,
              })}
            >
              <span className={styles.questionText}>{item.question}</span>
              <span className={styles.plus}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
              {openQuestion?.section === 'questionsBody2' &&
                openQuestion?.index === index && (
                  <p className={styles.answer}>{item.answer}</p>
                )}
            </li>
          ))}
        </ul>
        <h3 id='question3'>Managed Contests</h3>
        <ul className={styles.questionsList}>
          {questionsBody3.map((item, index) => (
            <li
              key={index}
              onClick={() => toggleQuestion('questionsBody3', index)}
              className={classNames(styles.question, {
                [styles.open]:
                  openQuestion?.section === 'questionsBody3' &&
                  openQuestion?.index === index,
              })}
            >
              <span className={styles.questionText}>{item.question}</span>
              <span className={styles.plus}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
              {openQuestion?.section === 'questionsBody3' &&
                openQuestion?.index === index && (
                  <p className={styles.answer}>{item.answer}</p>
                )}
            </li>
          ))}
        </ul>
        <h3 id='question4'>For Creatives</h3>
        <ul className={styles.questionsList}>
          {questionsBody4.map((item, index) => (
            <li
              key={index}
              onClick={() => toggleQuestion('questionsBody4', index)}
              className={classNames(styles.question, {
                [styles.open]:
                  openQuestion?.section === 'questionsBody4' &&
                  openQuestion?.index === index,
              })}
            >
              <span className={styles.questionText}>{item.question}</span>
              <span className={styles.plus}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
              {openQuestion?.section === 'questionsBody4' &&
                openQuestion?.index === index && (
                  <p className={styles.answer}>{item.answer}</p>
                )}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default AccordionFaq;
