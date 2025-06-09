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
  setImageUrl,
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
  const isAuthenticated = useSelector(
    (state) => state.userSlice.isAuthenticated
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        const userData = response.data;

        dispatch(setUser(userData.username));
        dispatch(setUserId(userData.userId));
        dispatch(loginSuccess(userData.token));
        dispatch(authentication(true));

        console.log("=== Avatar Request Debug ===");
        console.log("About to request avatar...");
        console.log("User token:", userData.token ? "exists" : "missing");
        console.log("Token length:", userData.token?.length);

        try {
          const profileImg = await api.get("/uploadImage/getAvatar");
          const fullImageUrl = api.defaults.baseURL + profileImg.data.image;
          console.log("full image url", fullImageUrl);
          dispatch(setImageUrl(fullImageUrl));
        } catch (avatarError) {
          console.log("❌ Avatar request failed:");
          console.log("Error status:", avatarError.response?.status);
          console.log("Error message:", avatarError.response?.data);
          console.log("Full error:", avatarError);
        }

        navigate("/HomePage");
      } catch (error) {
        console.log("❌ Main auth error:", error);
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
