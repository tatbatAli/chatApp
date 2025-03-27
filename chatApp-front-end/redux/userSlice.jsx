import React from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  token: null,
  isAuthenticated: null,
};

const user = createSlice({
  name: "user",
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
    logOut: (state) => {
      (state.token = null), (state.isAuthenticated = null);
    },
  },
});

export const { setUser, loginSuccess, authentication, logOut } = user.actions;

export default user.reducer;
