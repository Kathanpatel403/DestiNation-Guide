import React, { useState, useEffect,useRef} from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import InputControlPage from "./InputControlPage";
import { auth } from "../config/firebase";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";
import { firestore } from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import HomeHeader from '../components/Headers';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, Icon } from 'react-leaflet';
import L from 'leaflet';
import image from '../assets/images/logo.png'
import '../components/PlaceDetails.css'
import { FaHeart } from "react-icons/fa";

import {
doc,
getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
function AllReviewRating() {
    const navigate = useNavigate();
    const location = useLocation();
    const placeName = location.state.placeName;
    const [reviewsData, setReviewsData] = useState([]);
    const [place, setPlace] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);
    const [isFavourite, toggleFavourite] = useState(false);
    const placeId = location.state.placeId;
    useEffect(() => {
        const fetchReviewPlace = async () => {
            console.log("AllReviewRating screen refreshed!")
            try {
                const userRolesCollection = collection(firestore, 'userRoles');
                const queryForPlace = query(userRolesCollection, where(`ReviewRating.${placeName}`, '!=', null));
                const querySnapshot = await getDocs(queryForPlace);

                if (!querySnapshot.empty) {
                    const data = [];
                    querySnapshot.forEach((doc) => {
                        const userData = doc.data();
                        const { name, email } = userData;
                        const reviewData = {
                            name,
                            email,
                            review: userData.ReviewRating[placeName].Review,
                            rating: userData.ReviewRating[placeName].Rating,
                        };
                        data.push(reviewData);
                    });

                    setReviewsData(data);
                } else {
                    setReviewsData([]);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        }
        fetchReviewPlace();
    }, []);

    const generateStars = () => {
        console.log("generating stars")
    }

    const customIcon = new L.Icon({
        iconUrl: image, // URL to the custom icon image
        iconSize: [120, 120], // Size of the icon
    });

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/places/${placeName}`);
                setPlace(response.data.place); // Assuming the response contains a 'place' property
                console.log("Place details fetched from backend: ", place)
            } catch (error) {
                console.error('Error fetching place details:', error);
            }
        };

        fetchPlaceDetails();
    }, [placeName]);

    const redirectToMapWithDirections = () => {
        const { latitude, longitude } = place;
        if (latitude && longitude) {
            // Check if geolocation is supported
            if ("geolocation" in navigator) {
                // Get user's current location
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude: userLat, longitude: userLng } = position.coords;
                    // Construct the URL with directions from user's location to the destination
                    const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${latitude},${longitude}`;
                    // Open the URL in a new tab
                    window.open(url, '_blank');
                }, error => {
                    console.error('Error getting user location:', error);
                    // If there's an error getting user's location, fallback to opening the map without directions
                    openMapWithoutDirections();
                });
            } else {
                console.error('Geolocation is not supported');
                // If geolocation is not supported, fallback to opening the map without directions
                openMapWithoutDirections();
            }
        } else {
            console.error('Latitude and longitude not available');
        }
    };

    const openMapWithoutDirections = () => {
        const { latitude, longitude } = place;
        if (latitude && longitude) {
            // Construct the URL without directions
            const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
            // Open the URL in a new tab
            window.open(url, '_blank');
        } else {
            console.error('Latitude and longitude not available');
        }
    };
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
                  navigate("/give-review", {
                    state: { placeName: place.Name },
                  });
                }}
                className="map-button pt-2"
              >
                Give Review
              </button>
            </div>
          </div>



                    <div className="flex flex-col items-center ml-96 p-4">
                        <h1 className='mt-10 mb-7 text-center mr-16 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '50px' }}>All reviews for {place.Name}</h1>
                        <div className="w-full">
                            <div>
                                {reviewsData.map((review, index) => (
                                    <div key={index}
                                        style={{
                                            backgroundColor: "#e3e3e3",
                                            borderRadius: '15px',
                                            padding: '15px',
                                            marginBottom: '15px',
                                            shadowColor: '#fff',
                                            shadowOffset: { width: 0, height: 5 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 8,
                                            elevation: 8,
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            marginLeft: '15px',
                                            marginRight: '15px'
                                        }}>
                                        <div style={{ fontSize: '20px', fontWeight: "bold", marginBottom: '15px' }}>Name: {review.name}</div>
                                        <div style={{ fontSize: '20px', marginBottom: '15px' }}>Email: {review.email}</div>
                                        <div style={{ fontSize: '20px', marginBottom: '15px' }}>Review: {review.review}</div>
                                        <div style={{ flexDirection: "row" }}>
                                            <div style={{ fontSize: '20px', marginBottom: '15px' }}>Rating: ({review.rating})</div>
                                            <div style={{ fontSize: '20px' }}>  {generateStars(review.rating)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

            ) : (
                <p>Loading...</p>
            )}
</div>
        </div>
    )
}

export default AllReviewRating