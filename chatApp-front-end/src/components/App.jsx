import React from "react";
import Messages from "./MessagePage";
import SignUpPage from "./SignUp";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import EmailVerify from "./EmailVerify";

import LoginPage from "./LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/" element={<SignUpPage />} />
      <Route path="/MessagePage/:userId?" element={<Messages />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/SignUp" element={<SignUpPage />} />
      <Route path="/auth/:id/verify/:token" element={<EmailVerify />} />
    </Routes>
  );
}

export default App;
