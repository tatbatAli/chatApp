import axios from "axios";
import store from "../../redux/store";

const api = axios.create({
  baseURL: "http://localhost:5000/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.userSlice.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
