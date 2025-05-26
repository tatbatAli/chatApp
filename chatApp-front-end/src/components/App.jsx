import React from "react";
import Messages from "./MessagePage";
import SignUpPage from "./SignUp";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import EmailVerify from "./EmailVerify";
import ForgetPwd from "./ForgetPwd";
import ResetPwd from "./ResetPwd";
import LoginPage from "./LoginPage";
import Logout from "./LogOut";

function App() {
  return (
    <Routes>
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/" element={<SignUpPage />} />
      <Route path="/MessagePage/userName?/:userId?" element={<Messages />} />
      <Route path="/MessagePage" element={<Messages />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/SignUp" element={<SignUpPage />} />
      <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
      <Route path="/ForgetPwd" element={<ForgetPwd />} />
      <Route path="/auth/:id/resetPwd" element={<ResetPwd />} />
      <Route path="/LogOut" element={<Logout />} />
    </Routes>
  );
}

export default App;
