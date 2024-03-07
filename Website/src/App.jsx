import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import LoginPage from "./screens/LoginPage";
import SignupPage from "./screens/SignupPage";

import { auth } from "./config/firebase";
import ForgotPassword from "./screens/ForgotPassword";
import UserInformationForm from "./screens/UserInformationForm";
import LandingPage from "./screens/LandingPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/userinfo" element={<UserInformationForm />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/Home" element={<HomeScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;