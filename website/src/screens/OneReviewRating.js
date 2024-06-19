import React, { useState, useEffect,useRef } from "react";
import { auth, firestore } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import HomeHeader from "../components/Headers";
import axios from "axios";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import image from "../assets/images/logo.png";
import { FaHeart } from "react-icons/fa";

import {

  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
export default function OneReviewRating() {
  const navigate = useNavigate();
  const [review, setreview] = useState("");
  const [rating, setRating] = useState(0);
  const location = useLocation();
  const placeName = location.state.placeName;
  const [place, setPlace] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const [isFavourite, toggleFavourite] = useState(false);
  const placeId = location.state.placeId;

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleReviewSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRoleRef = doc(firestore, "userRoles", uid);

        const userSnapshot = await getDoc(userRoleRef);
        const userData = userSnapshot.data();
        if (userData) {
          await setDoc(
            userRoleRef,
            {
              ReviewRating: {
                [placeName]: {
                  Review: review,
                  Rating: rating,
                },
              },
            },
            { merge: true }
          );
          console.log("Review added successfully!");
          toast.success(`Review added to database successfully!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.log("failed to add reviews on firestore!");
          toast.success(`Failed to add reviews on firestore!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } catch (error) {
      console.log("Something went wrong while adding reviews to firestore!");
      toast.success(`Something went wrong!: ${error}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const customIcon = new L.Icon({
    iconUrl: image, // URL to the custom icon image
    iconSize: [120, 120], // Size of the icon
  });

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/places/${placeName}`
        );
        setPlace(response.data.place); // Assuming the response contains a 'place' property
        console.log("Place details fetched from backend: ", place);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlaceDetails();
  }, [placeName]);
  const handlebookmarks = async (placeid) => {
    console.log("bookmarked handled for placeid:", placeid);
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRoleRef = doc(firestore, "userRoles", uid);
        const userSnapshot = await getDoc(userRoleRef);
        const userData = userSnapshot.data();

        if (
          userData &&
          userData.BookmarkedPlaces &&
          userData.BookmarkedPlaces.includes(placeid)
        ) {
          await updateDoc(userRoleRef, {
            BookmarkedPlaces: arrayRemove(placeid),
          });
          console.log("Bookmark removed from firestore successfully!");
          toast.success(`Bookmarks removed successfully!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleFavourite(false);
        } else {
          await updateDoc(userRoleRef, {
            BookmarkedPlaces: arrayUnion(placeid),
          });
          console.log("bookmark added to firestore successfully!");
          toast.success(`Bookmark added successfully!`, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          toggleFavourite(!isFavourite);
        }
      } else {
        toast.success(`User data not found!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.success(`Error fetching user data: ${error}`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      console.log("placeid: ", placeId);
      try {
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          const userRoleRef = doc(firestore, "userRoles", uid);
          const userSnapshot = await getDoc(userRoleRef);
          const userData = userSnapshot.data();

          if (
            userData &&
            userData.BookmarkedPlaces &&
            userData.BookmarkedPlaces.includes(placeId)
          ) {
            console.log("place is already in bookmarks!");
            toggleFavourite(!isFavourite);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBookmarkStatus();
  }, []);

  useEffect(() => {
    const startCarousel = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % place.Image.length);
      }, 3000);
    };

    const stopCarousel = () => {
      clearInterval(intervalRef.current);
    };

    if (place && place.Image && place.Image.length > 1) {
      startCarousel();
      return () => stopCarousel();
    }
  }, [place]);
  const redirectToMapWithDirections = () => {
    const { latitude, longitude } = place;
    if (latitude && longitude) {
      // Check if geolocation is supported
      if ("geolocation" in navigator) {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: userLat, longitude: userLng } = position.coords;
            // Construct the URL with directions from user's location to the destination
            const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude},${longitude}`;
            // Open the URL in a new tab
            window.open(url, "_blank");
          },
          (error) => {
            console.error("Error getting user location:", error);
            // If there's an error getting user's location, fallback to opening the map without directions
            openMapWithoutDirections();
          }
        );
      } else {
        console.error("Geolocation is not supported");
        // If geolocation is not supported, fallback to opening the map without directions
        openMapWithoutDirections();
      }
    } else {
      console.error("Latitude and longitude not available");
    }
  };

  const openMapWithoutDirections = () => {
    const { latitude, longitude } = place;
    if (latitude && longitude) {
      // Construct the URL without directions
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      // Open the URL in a new tab
      window.open(url, "_blank");
    } else {
      console.error("Latitude and longitude not available");
    }
  };

  return (
    <div>
      <div className="fixed z-10">
        <HomeHeader />
      </div>
<div style={{
  paddingTop:'200px'
}}>
      {place ? (
        <div className="flex">
          <div className="flex flex-col items-center w-4/12 p-4 ">
          <div className="carousel-container ml-96 mt-16">
                {place.Image.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index}`}
                    style={{
                      position: "absolute",
                      top: "0",
                      left: `${index === currentIndex ? "0" : "-100%"}`,
                      transition: "left 1s",
                      width: "95%",
                      height: "97%",
                      margin: 17,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                ))}
                <div>
                  <button onClick={() => handlebookmarks(place.Place_id)}>
                    <FaHeart
                      className="fas fa-heart heart-icon"
                      color={isFavourite ? "red" : "gray"}
                    ></FaHeart>
                  </button>
                </div>
              </div>
            <div style={{
              display:'flex',
              width:'150px',
              height:'70px',
              margin:10,
              textAlign:'center',
             
            }}>
             
             
 <button
                onClick={redirectToMapWithDirections}
                className="map-button pt-2"
                
              >
                Get Direction
              </button>
          

            
              <button
                onClick={() => {
                  navigate(`/place/${encodeURIComponent(place.Name)}`, {
                    state: { placeId: place.Place_id },
                  });
                }}
                className="map-button pt-2"
              >
                Go to destination
              </button>
            

            
              <button
                onClick={() => {
                  navigate("/all-reviews", {
                    state: { placeName: place.Name },
                  });
                }}
                className="map-button pt-2"
              >
                See all Review
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center w-8/12 p-4 ml-64">
            <h1
              className="mt-10 mb-7  text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform"
             
            >
              User Review for {place.Name}
            </h1>

            <div className="max-w-md mx-auto p-6 shadow-md mt-[15px] bg-gray-100 border rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">
                Submit Review and Rating
              </h2>

              <div className="mb-4">
                <p className="mb-2">Rating: {rating}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`cursor-pointer ${
                        i <= rating
                          ? "text-yellow-500 text-[2rem]"
                          : "text-gray-300 text-[2rem]"
                      } h-[50px] w-[500px]`}
                      onClick={() => handleStarClick(i)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="review" className="block text-gray-700">
                  Review:
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={review}
                  onChange={(e) => setreview(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleReviewSubmit}
                  className="px-6 py-3 bg-gray-400 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
  </div>
    </div>
  );
}
