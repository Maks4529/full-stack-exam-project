import { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import DATA from '../howItWorksData';
import styles from './AccordionFaq.module.sass';

function AccordionFaq() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(null);
  const {
    menuItems,
    questionsBody1,
    questionsBody2,
    questionsBody3,
    questionsBody4,
  } = DATA;

  const sections = [
    {
      id: 'question1',
      title: 'Launching A Contest',
      questions: questionsBody1,
    },
    {
      id: 'question2',
      title: 'Buying From Marketplace',
      questions: questionsBody2,
    },
    { id: 'question3', title: 'Managed Contests', questions: questionsBody3 },
    { id: 'question4', title: 'For Creatives', questions: questionsBody4 },
  ];

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
        {sections.map((section) => (
          <div key={section.id}>
            <h3 id={section.id}>{section.title}</h3>
            <ul className={styles.questionsList}>
              {section.questions.map((item, index) => {
                const isOpen =
                  openQuestion?.section === section.id &&
                  openQuestion?.index === index;
                return (
                  <li
                    key={index}
                    onClick={() => toggleQuestion(section.id, index)}
                    className={classNames(styles.question, {
                      [styles.open]: isOpen,
                    })}
                  >
                    <div className={styles.questionHeader}>
                      <span className={styles.questionText}>
                        {item.question}
                      </span>
                      <span className={styles.plus}>
                        <FontAwesomeIcon icon={faXmark} />
                      </span>
                    </div>
                    {isOpen && (
                      <div className={styles.answer}>{item.answer}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

export default AccordionFaq;
