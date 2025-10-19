import { useEffect, useState } from "react";
import styles from "./CountdownTimer.module.sass";

function CountdownTimer({ event, onNotify }) {
  const [timeLeft, setTimeLeft] = useState(event.datetime - Date.now());
  const [notified, setNotified] = useState(false);

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

  if (timeLeft <= 0) {
    return <div className={styles.finished}>{event.name} – the time has come!</div>;
  }

  const seconds = Math.floor((timeLeft / 1000) % 60);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24);
  const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);

  return (
    <div className={`${styles.timer} ${notified ? styles.soon : ""}`}>
      <strong>{event.name}</strong>
      <span>
        {days}d {hours}h {minutes}m {seconds}s
      </span>
    </div>
  );
}

export default CountdownTimer;
