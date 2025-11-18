import React from 'react';
import { toast } from 'react-toastify';
import WebSocket from './WebSocket';
import Notification from '../../../components/Notification/Notification';
import { addNotification } from '../../../store/slices/notificationsSlice';

class NotificationSocket extends WebSocket {
  constructor(dispatch, getState, room) {
    super(dispatch, getState, room);
  }

  anotherSubscribes = () => {
    this.onEntryCreated();
    this.onChangeMark();
    this.onChangeOfferStatus();
  };

  onChangeMark = () => {
    this.socket.on('changeMark', () => {
      try {
        this.dispatch(addNotification({ message: 'Someone liked your offer' }));
      } catch (e) {
        toast('Someone liked your offer');
      }
    });
  };

  onChangeOfferStatus = () => {
    this.socket.on('changeOfferStatus', (message) => {
      try {
        this.dispatch(
          addNotification({
            message: message.message,
            contestId: message.contestId,
          })
        );
      } catch (e) {
        toast(
          <Notification
            message={message.message}
            contestId={message.contestId}
          />
        );
      }
    });
  };

  onEntryCreated = () => {
    this.socket.on('onEntryCreated', () => {
      try {
        const id = Date.now();
        this.dispatch(
          addNotification({ id, message: 'New entry was created' })
        );
      } catch (e) {
        toast('New Entry');
      }
    });
  };

  subscribe = (id) => {
    const room = String(id);
    this.socket.emit('subscribe', room);
  };

  unsubsctibe = (id) => {
    this.socket.emit('unsubscribe', id);
  };
}

export default NotificationSocket;
