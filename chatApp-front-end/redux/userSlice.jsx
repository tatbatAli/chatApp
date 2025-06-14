import React, { act } from "react";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  userId: null,
  email: null,
  token: null,
  imageUrl: null,
  isAuthenticated: null,
  recentUserId: null,
  notifCount: 0,
  notifList: [],
  onlineUsers: [],
  recentUsers: [],
  roomId: null,
  roomName: null,
  roomList: [],
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
    authentication: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setRecentUserId: (state, action) => {
      state.recentUserId = action.payload;
    },
    setOnlineUser: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addRecentUsers: (state, action) => {
      const user = action.payload;
      const exist = state.recentUsers.some((u) => u._id === user._id);
      if (!exist) {
        state.recentUsers = [user, ...state.recentUsers].slice(0, 3);
      }
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setRoomName: (state, action) => {
      state.roomName = action.payload;
    },
    setRoomList: (state, action) => {
      state.roomList = [...state.roomList, ...action.payload];
    },
    addNotification: (state, action) => {
      state.notifList.unshift(action.payload);
      state.notifCount += 1;
    },
    markAllAsRead: (state, action) => {
      state.notifCount = 0;
    },
    logOut: (state) => {
      (state.token = null),
        (state.isAuthenticated = null),
        (state.userId = null);
    },
  },
});

export const {
  setUser,
  setUserId,
  setUserEmail,
  loginSuccess,
  setImageUrl,
  authentication,
  setRecentUserId,
  setOnlineUser,
  addRecentUsers,
  setRoomId,
  setRoomName,
  setRoomList,
  addNotification,
  markAllAsRead,
  logOut,
} = user.actions;

export default user.reducer;
