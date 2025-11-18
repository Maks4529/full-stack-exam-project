import { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './CountdownTimer.module.sass';

function CountdownTimer({ event, onNotify }) {
  const [timeLeft, setTimeLeft] = useState(event.datetime - Date.now());
  const [notified, setNotified] = useState(event.notified);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(event.datetime - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [event.datetime]);

  useEffect(() => {
    const notifyMs = event.notifyBefore * 60 * 1000;
    if (timeLeft <= notifyMs && !notified) {
      setNotified(true);
      if (onNotify) onNotify(event.id);
    }
  }, [timeLeft, event.notifyBefore, event.id, notified, onNotify]);

  let progressPercent = 0;
  if (event.createdAt) {
    const totalDuration = event.datetime - event.createdAt;
    const timePassed = Date.now() - event.createdAt;
    progressPercent = (timePassed / totalDuration) * 100;
  }

  if (timeLeft <= 0) {
    return (
      <div className={styles.finished}>{event.name} – the time has come!</div>
    );
  }

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
  const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

  const timerClasses = classNames(styles.timer, {
    [styles.soon]: notified,
  });

  return (
    <div
      className={timerClasses}
      style={{ '--progress-width': `${Math.min(progressPercent, 100)}%` }}
    >
      <div className={styles.content}>
        <div className={styles.eventName}>{event.name}</div>
        <div className={styles.timeLeft}>
          {days}d {hours}h {minutes}m {seconds}s
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
