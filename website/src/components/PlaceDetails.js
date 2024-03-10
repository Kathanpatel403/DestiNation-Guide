import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PlaceDetails.css';
import HomeHeader from './Headers';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { MapContainer, TileLayer, Marker, Popup, Icon } from 'react-leaflet'; // Import Leaflet components
import L from 'leaflet';
import image from '../assets/images/logo.png'
import { FaSearch, FaArrowRight, FaHeart } from "react-icons/fa";
import { auth, firestore, storage } from "../config/firebase";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlaceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { placeName, placeid } = useParams();
  const [place, setPlace] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const [isFavourite, toggleFavourite] = useState(false);
  const placeId = location.state.placeId;


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

  useEffect(() => {
    const startCarousel = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % place.Image.length);
      }, 3000); // Change image every 3 seconds
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
            console.log("place is already in bookmarks!")
            toggleFavourite(!isFavourite);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchBookmarkStatus();
  }, []);

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
            position: 'bottom-right',
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
            position: 'bottom-right',
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
          position: 'bottom-right',
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
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error fetching user data:", error);
    }
  }

  return (
    <>
      <div style={{ width: '98%', marginLeft: '12px' }}>
        <HomeHeader />
      </div>
      <div>
        {place ? (
          <div>
            <h1 className='mt-10 text-3xl text-center mb-6'>{place.Name}</h1>
            {/* Carousel */}
            <div className='carousel-container'>
              {place.Image.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index}`}
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: `${index === currentIndex ? '0' : '-100%'}`,
                    transition: 'left 1s',
                    width: '95%',
                    height: '97%',
                    margin: 15,
                    objectFit: 'cover',
                    borderRadius: 10
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


            <div className='main-div'>
              <p className='text-xl description'>
                <span className='description-heading'>Description</span><br />
                {place.LongDescription}
              </p>
              <p className='location'><span className='location-heading'>Location:</span> {place.City},{place.State},{place.Country}({place.latitude},{place.longitude})</p>
              <p className='Timing'><span className='Timings-h'>Timings:</span> {place.Timings}</p>
              <p className='Fee'><span className='Fee-h'>Fee:</span> {place.Fee}</p>
              <p className='Feelink'><span style={{ fontWeight: 'bolder', color: 'black' }}>FeeLink:</span> <a href={place.FeeLink} target="_blank" rel="noopener noreferrer">Click Here</a></p>
              <p className='BMTV' style={{ fontWeight: 'bolder', color: 'black' }}><span className='BMTV-h'>BMTV:</span> {place.BMTV}</p>
              <div>
                <h2 className='Activities' style={{ fontWeight: 'bolder', color: 'black' }}>Activities:</h2>
                <ul className='Activities'>
                  {Array.isArray(place.Activities) ? (
                    place.Activities.map((Activities, index) => (
                      <li key={index}>{Activities}</li>
                    ))
                  ) : (
                    <li>{place.Category}</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className='Amenities' style={{ fontWeight: 'bolder', color: 'black' }}>Amenities:</h2>
                <ul className='Amenities'>
                  {Array.isArray(place.Amenities) ? (
                    place.Amenities.map((Amenities, index) => (
                      <li key={index}>{Amenities}</li>
                    ))
                  ) : (
                    <li>{place.Category}</li>
                  )}
                </ul>
              </div>
              <div><h2 className='Amenities' style={{ fontWeight: 'bolder', color: 'black' }}>Map</h2>
                <MapContainer center={[place.latitude, place.longitude]} zoom={16} style={{ height: '500px' }}>
                  <TileLayer

                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  />
                  <Marker position={[place.latitude, place.longitude]} icon={customIcon}>
                    <Popup>
                      {place.Name}
                    </Popup>
                  </Marker>
                </MapContainer>
                <button onClick={redirectToMapWithDirections} className='map-button'>Get Direction</button>
              </div>
              <div>
                <button onClick={() => { navigate("/give-review", { state: { placeName: place.Name } }) }} className='map-button'>Give Review</button>
              </div>

              <div>
                <button onClick={() => { navigate("/all-reviews", { state: { placeName: place.Name } }) }} className='map-button'>See all Review</button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default PlaceDetails;
