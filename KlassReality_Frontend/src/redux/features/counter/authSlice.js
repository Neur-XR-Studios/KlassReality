import { createSlice } from "@reduxjs/toolkit";

export const auth = createSlice({
  name: "auth",
  initialState: {
    config: window.localStorage.getItem("config")
      ? JSON.parse(window.localStorage.getItem("config"))
      : window.localStorage.getItem("config"),
  },
  reducers: {
    saveConfig: (state, action) => {
      state.config = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveConfig } = auth.actions;

export default auth.reducer;
