import React, { useState, useEffect } from "react";
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

function AllReviewRating() {
    const navigate = useNavigate();
    const location = useLocation();
    const placeName = location.state.placeName;
    const [reviewsData, setReviewsData] = useState([]);
    const [place, setPlace] = useState();

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

    return (
        <div>
            <div>
                <HomeHeader />
            </div>

            {place ? (
                <div className="flex">
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
                            <button onClick={() => { navigate("/give-review", { state: { placeName: place.Name } }) }} className='map-button'>Give Review</button>
                        </div>

                        <div className="w-[100px]">
                            <button onClick={() => { navigate(`/place/${encodeURIComponent(place.Name)}`, { state: { placeId: place.Place_id } }) }} className='map-button'>Go to destination</button>
                        </div>
                    </div>


                    <div className="flex flex-col items-center w-8/12 p-4">
                        <h1 className='mt-10 mb-7 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '50px' }}>All reviews for {place.Name}</h1>
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
    )
}

export default AllReviewRating