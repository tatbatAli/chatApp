import React from "react";
import Messages from "./MessagePage";
import SignUpPage from "./SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import { Provider } from "react-redux";
import store from "../../redux/store";
import LoginPage from "./LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/" element={<SignUpPage />} />
      <Route path="/MessagePage/:userId?" element={<Messages />} />
      <Route path="/LoginPage" element={<LoginPage />} />
      <Route path="/SignUp" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
