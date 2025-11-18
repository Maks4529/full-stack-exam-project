import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './NotificationsDropdown.module.sass';
import {
  markAsRead,
  markAllRead,
  removeNotification,
} from '../../store/slices/notificationsSlice';

export default function NotificationsDropdown({ anchorRef, onClose }) {
  const dispatch = useDispatch();
  const notifications = useSelector((s) => s.notifications.list);
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const anchor = anchorRef && anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const top = rect.bottom + 8 + window.scrollY;
    const left = rect.right - 320 + window.scrollX;
    setPos({ top, left: Math.max(8, left) });

    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        !anchor.contains(e.target)
      ) {
        onClose && onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', onClose);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', onClose);
    };
  }, [anchorRef, onClose]);

  const content = (
    <div
      ref={containerRef}
      className={styles.dropdown}
      style={{ position: 'absolute', top: pos.top, left: pos.left }}
    >
      <div className={styles.header}>
        <span>Notifications</span>
        <div className={styles.actions}>
          <button
            className={styles.markAll}
            onClick={() => dispatch(markAllRead())}
          >
            Mark all as read
          </button>
        </div>
      </div>
      <div className={styles.list}>
        {(!notifications || notifications.length === 0) && (
          <div className={styles.empty}>No notifications</div>
        )}
        {notifications &&
          notifications.map((n) => (
            <div
              key={n.id}
              className={`${styles.item} ${n.read ? styles.read : ''}`}
            >
              <div className={styles.message}>{n.message}</div>
              <div className={styles.meta}>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
                <div className={styles.itemActions}>
                  {!n.read && (
                    <button onClick={() => dispatch(markAsRead(n.id))}>
                      Read
                    </button>
                  )}
                  <button onClick={() => dispatch(removeNotification(n.id))}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
