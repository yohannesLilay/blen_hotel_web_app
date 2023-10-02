import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  drawerOpen: false,
  openItem: ["dashboard"],
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      state.drawerOpen = action.payload.drawerOpen;
    },
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },
  },
});

export const { openDrawer, activeItem } = menuSlice.actions;

export default menuSlice.reducer;
