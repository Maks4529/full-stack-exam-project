import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowEventBadge } from '../../store/slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/Header/Header';
import CountdownTimer from '../../components/Events/Timer/CountdownTimer';
import styles from './EventsPage.module.sass';
import EventsForm from '../../components/Events/EventsForm/EventsForm';

function EventsPage () {
  const dispatch = useDispatch();
const showBadge = useSelector(state => state.userStore.showEventBadge);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (values, { resetForm }) => {
    const eventDateTime = new Date(`${values.date}T${values.time}`);
    const newEvent = {
      id: Date.now(),
      ...values,
      datetime: eventDateTime.getTime(),
    };

    setEvents(prev =>
      [...prev, newEvent].sort((a, b) => a.datetime - b.datetime)
    );

    resetForm();
  };

  const handleDelete = (id) => {
  const updatedEvents = events.filter(ev => ev.id !== id);
  setEvents(updatedEvents);

  const now = Date.now();
  const hasPendingNotifications = updatedEvents.some(
    ev => now <= ev.datetime && !ev.notified
  );

  dispatch(setShowEventBadge(hasPendingNotifications));
};

  const handleNotify = (id) => {
  setEvents(prev =>
    prev.map(ev => (ev.id === id ? { ...ev, notified: true } : ev))
  );

  const now = Date.now();
  const hasPending = events.some(ev => !ev.notified && now <= ev.datetime);
  dispatch(setShowEventBadge(hasPending));
};

  return (
    <>
      <Header showBadge={showBadge} />
      <main className={styles.eventsPage}>
        <h2>Events</h2>
        <EventsForm handleAddEvent={handleAddEvent} />
        <ul className={styles.list}>
          {events.map(ev => (
            <li key={ev.id}>
              <CountdownTimer event={ev} onNotify={handleNotify} />
              <button onClick={() => handleDelete(ev.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export default EventsPage;
