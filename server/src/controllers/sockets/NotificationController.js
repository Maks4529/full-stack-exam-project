const WebSocket = require('./WebSocket');
const CONSTANTS = require('../../constants');

class NotificationController extends WebSocket {
  emitEntryCreated(target) {
    this.io.to(target).emit(CONSTANTS.NOTIFICATION_ENTRY_CREATED);
  }

  emitChangeMark(target) {
    this.io.to(target).emit(CONSTANTS.NOTIFICATION_CHANGE_MARK);
  }

  emitChangeOfferStatus(target, message, contestId) {
    try {
      this.io
        .to(String(target))
        .emit(CONSTANTS.NOTIFICATION_CHANGE_OFFER_STATUS, {
          message,
          contestId,
        });
    } catch (e) {
      console.error(
        '[NotificationController] failed to emit changeOfferStatus',
        e && (e.message || e)
      );
    }
  }
}

module.exports = NotificationController;
