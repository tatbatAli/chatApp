import { configureStore } from "@reduxjs/toolkit";
import reducerSlice from "./userSlice";

const store = configureStore({
  reducer: {
    userSlice: reducerSlice,
  },
});

export default store;
