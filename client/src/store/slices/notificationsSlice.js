import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification (state, action) {
      const payload = action.payload;
      const id = String(payload.id || Date.now());
      state.list.unshift({
        id,
        read: false,
        createdAt: new Date().toISOString(),
        ...payload,
        id,
      });
      state.unreadCount += 1;
    },
    markAsRead (state, action) {
      const id = String(action.payload);
      const item = state.list.find(n => String(n.id) === id);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllRead (state) {
      state.list.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification (state, action) {
      const id = String(action.payload);
      const idx = state.list.findIndex(n => String(n.id) === id);
      if (idx !== -1) {
        if (!state.list[idx].read)
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.list.splice(idx, 1);
      }
    },
    clearNotifications (state) {
      state.list = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllRead,
  removeNotification,
  clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
