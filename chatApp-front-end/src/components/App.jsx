import React, { useEffect } from "react";
import Messages from "./MessagePage";
import SignUpPage from "./SignUp";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import EmailVerify from "./EmailVerify";
import ForgetPwd from "./ForgetPwd";
import ResetPwd from "./ResetPwd";
import LoginPage from "./LoginPage";
import Logout from "./Logout";
import NotificationListener from "./NotificationListener";
import RoomPage from "./RoomPage";
import socket from "../../Hooks/socket";
import { useSelector, useDispatch } from "react-redux";
import {
  authentication,
  loginSuccess,
  setOnlineUser,
  setUser,
  setUserId,
} from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";
import api from "../api/api";

function App() {
  const currentUser = useSelector((state) => state.userSlice.username);
  const accessToken = useSelector((state) => state.userSlice.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        const userData = response.data;

        console.log(userData);

        dispatch(setUser(userData.username));
        dispatch(setUserId(userData.userId));
        dispatch(loginSuccess(userData.token));
        dispatch(authentication(true));

        navigate("/HomePage");
      } catch (error) {
        console.log("No Authentification", error);
        dispatch(setUser(null));
        dispatch(setUserId(null));
        dispatch(authentication(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    socket.on("online-users", (onlineUsers) => {
      const onlineUsersName = onlineUsers.map((u) => u.username);
      dispatch(setOnlineUser(onlineUsersName));
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const registerUser = () => {
      socket.emit("register", currentUser);
    };

    if (socket.connected) {
      registerUser();
    } else {
      socket.on("connect", registerUser);
    }

    return () => {
      socket.off("connect", registerUser);
    };
  }, [currentUser]);

  return (
    <>
      <NotificationListener />
      <Routes>
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/" element={<SignUpPage />} />
        <Route path="/MessagePage/:sender/:recepient" element={<Messages />} />
        <Route path="/MessagePage" element={<Messages />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/Room" element={<RoomPage />} />
        <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/ForgetPwd" element={<ForgetPwd />} />
        <Route path="/auth/:id/resetPwd" element={<ResetPwd />} />
        <Route path="/LogOut" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
