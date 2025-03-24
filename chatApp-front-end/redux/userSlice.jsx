import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  token: null,
  isAuthenticated: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload;
    },
    authentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUser, loginSuccess, authentication } = userSlice.actions;

export default userSlice.reducer;
