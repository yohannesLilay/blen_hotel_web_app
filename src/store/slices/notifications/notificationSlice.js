import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notificationCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    incrementNotificationCount: (state) => {
      state.notificationCount += 1;
    },
    decrementNotificationCount: (state) => {
      state.notificationCount -= 1;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload; 
    },
  },
});

export const {
  incrementNotificationCount,
  decrementNotificationCount,
  setNotificationCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
