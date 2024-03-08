import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import LoginPage from "./screens/LoginPage";
import SignupPage from "./screens/SignupPage";
import RecommendationCard from "./component/RecommendationCard"; // Import RecommendationPage component
import { auth } from "./config/firebase";
import ForgotPassword from "./screens/ForgotPassword";
import UserInformationForm from "./screens/UserInformationForm";
import PopularCard from "./component/PopularCard";
import CategoryDetails from "./component/categorydetails";
import PlaceDetails from "./component/PlaceDetails";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App" style={{
      overflowX: 'hidden', overflowY: 'visible',
    }}>
      <Router>
        <Routes>
          {/* Redirect to login if user is not authenticated */}
          {!user && <Route path="/" element={<Navigate to="/login" />} />}
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/userinfo" element={<UserInformationForm />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/place/:placeName" element={<PlaceDetails />}/>
          <Route path="/destinations/" element={<PopularCard />} /> {/* Add this route */}
          <Route path="/category/:categoryTitle" component={CategoryDetails} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
