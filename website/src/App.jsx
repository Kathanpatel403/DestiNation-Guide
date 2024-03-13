import React, {useState, useEffect} from "react";
import "./App.css";import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes, Route as ReactRoute } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import LoginPage from "./screens/LoginPage";
import SignupPage from "./screens/SignupPage";
import ProfileScreen from "./screens/ProfileScreen";
import ForgotPassword from "./screens/ForgotPassword";
import UserInformationForm from "./screens/UserInformationForm";
import LandingPage from "./screens/LandingPage";
import UserReviewRating from "./screens/UserReviewRating";
import BookmarkPage from "./screens/BookmarkPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateUserInformation from "./screens/UpdateUserInformation";
import RecommendationCard from "./components/RecommendationCard";
import PopularCard from "./components/PopularCard";
import CategoryDetails from "./components/categorydetails";
import PlaceDetails from "./components/PlaceDetails";
import Alldesti from "./components/alldestination";
import { auth } from "./config/firebase";
import SearchPlace from "./screens/SearchPlace";
import OneReviewRating from "./screens/OneReviewRating";
import AllReviewRating from "./screens/AllReviewRating";
import RecommendedPlaces from "./screens/RecommendedPlaces";


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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/userinfo" element={<UserInformationForm />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/place/:placeName" element={<PlaceDetails />} />
          <Route path="/destinations/" element={<Alldesti />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/userreviewrating" element={<UserReviewRating />} />
          <Route path="/bookmarks" element={<BookmarkPage />} />
          <Route path="/updateuserinfo" element={<UpdateUserInformation />} />
          <Route path="/searchplace" element={<SearchPlace />} />
          <Route path="/give-review" element={<OneReviewRating />} />
          <Route path="/all-reviews" element={<AllReviewRating />} />
          <Route path="/popular" element={<PopularCard />} />
          <Route path="/recommended" element={<RecommendedPlaces />} />

          <ReactRoute exact path="/" element={<HomeScreen />} /> {/* Use Route component with element prop */}
          <ReactRoute path="/category/:categoryTitle" element={<CategoryDetails />} /> {/* Use Route component with element prop */}
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;