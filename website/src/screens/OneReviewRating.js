import React, { useState, useEffect } from 'react';
import { auth, firestore } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import HomeHeader from '../components/Headers';
import axios from 'axios';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { MapContainer, TileLayer, Marker, Popup, Icon } from 'react-leaflet';
import L from 'leaflet';
import image from '../assets/images/logo.png'

export default function OneReviewRating() {
  const navigate = useNavigate();
  const [review, setreview] = useState("");
  const [rating, setRating] = useState(0);
  const location = useLocation();
  const placeName = location.state.placeName;
  const [place, setPlace] = useState();

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
          await setDoc(userRoleRef, {
            ReviewRating: {
              [placeName]: {
                Review: review,
                Rating: rating,
              },
            },
          }, { merge: true })
          console.log('Review added successfully!');
          toast.success(`Review added to database successfully!`, {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          console.log("failed to add reviews on firestore!")
          toast.success(`Failed to add reviews on firestore!`, {
            position: 'bottom-right',
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
      console.log("Something went wrong while adding reviews to firestore!")
      toast.success(`Something went wrong!: ${error}`, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
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

  return (
    <div>
      <div>
        <HomeHeader />
      </div>

      {place ? (
        <div className='flex'>

          <div className="flex flex-col items-center w-4/12 p-4 border-r border-gray-500">
            <div>
              <h2 className='Amenities' style={{ fontWeight: 'bolder', color: 'black', width: '400px' }}>Map</h2>
              <MapContainer center={[place.latitude, place.longitude]} zoom={16} style={{ height: '450px' }}>
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
            <button onClick={() => { navigate(`/place/${encodeURIComponent(place.Name)}`, { state: { placeId: place.Place_id } }) }} className='map-button'>Go to destination</button>
            </div>

            <div>
              <button onClick={() => { navigate("/all-reviews", { state: { placeName: place.Name } }) }} className='map-button'>See all Review</button>
            </div>
          </div>


          <div className="flex flex-col items-center w-8/12 p-4">

            <h1 className='mt-10 mb-7 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '50px' }}>User Review for {place.Name}</h1>

            <div className="max-w-md mx-auto p-6 shadow-md mt-[15px] bg-gray-100 border rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Submit Review and Rating</h2>

              <div className="mb-4">
                <p className="mb-2">Rating: {rating}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`cursor-pointer ${i <= rating ? 'text-yellow-500 text-[2rem]' : 'text-gray-300 text-[2rem]'
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
  );
}
