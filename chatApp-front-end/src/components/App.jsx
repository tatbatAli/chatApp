import React, { useEffect } from "react";
import Messages from "./MessagePage";
import SignUpPage from "./SignUp";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import EmailVerify from "./EmailVerify";
import ForgetPwd from "./ForgetPwd";
import ResetPwd from "./ResetPwd";
import LoginPage from "./LoginPage";
import Logout from "./LogOut";
import NotificationListener from "./NotificationListener";
import RoomPage from "./RoomPage";
import socket from "../../Hooks/socket";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUser } from "../../redux/userSlice";

function App() {
  const currentUser = useSelector((state) => state.userSlice.username);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("online-users", (onlineUsers) => {
      console.log(onlineUsers);
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
        <Route
          path="/MessagePage/:sender?/:recepient?"
          element={<Messages />}
        />
        <Route path="/MessagePage" element={<Messages />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/Room" element={<RoomPage />} />
        <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/ForgetPwd" element={<ForgetPwd />} />
        <Route path="/auth/:id/resetPwd" element={<ResetPwd />} />
        <Route path="/LogOut" element={<Logout />} />
      </Routes>
    </>
  );
}

export default App;
