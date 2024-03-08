import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Routes, Route as ReactRoute } from 'react-router-dom';
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
import Alldesti from "./component/alldestination";

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
          {/* {!user && <Route path="/" element={<Navigate to="/login" />} />} */}
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/userinfo" element={<UserInformationForm />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/place/:placeName" element={<PlaceDetails />}/>
          <Route path="/destinations/" element={<Alldesti />} /> {/* Add this route */}
        
          
        <ReactRoute exact path="/" element={<HomeScreen />} /> {/* Use Route component with element prop */}
        <ReactRoute path="/category/:categoryTitle" element={<CategoryDetails />} /> {/* Use Route component with element prop */}
      
        </Routes>
      </Router>
    </div>
  );
}

export default App;
