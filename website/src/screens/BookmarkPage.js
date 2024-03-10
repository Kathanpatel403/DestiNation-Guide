import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, firestore, storage } from "../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, arrayUnion, arrayRemove } from "firebase/firestore";
import axios from 'axios';
import '../components/card.css';
import { Link } from 'react-router-dom';
import Headers from '../components/Headers';
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { FaSearch, FaArrowRight, FaHeart } from 'react-icons/fa';

export default function BookmarkPage() {
    const [bookmarkedPlaces, setBookmarkedPlaces] = useState([]);
    const [userData, setUserData] = useState(null);
    const [locationPreferences, setLocationPreferences] = useState([]);
    const [categoryPreferences, setCategoryPreferences] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        fetchBookmarkedPlacesFromFirestore();
    }, []);

    const fetchBookmarkedPlacesFromFirestore = async () => {
        const user = auth.currentUser;

        const uid = user.uid;
        const userRoleRef = doc(firestore, "userRoles", uid);

        const userSnapshot = await getDoc(userRoleRef);
        const userData = userSnapshot.data().BookmarkedPlaces;
        console.log(userData)
        try {
            const response = await axios.post('http://localhost:8000/api/get_bookmarked_places', {
                BookmarkedPlaces: userData,
            });

            const data = response.data;
            setBookmarkedPlaces(data.bookmarked_places);
            console.log("Bookmark fetched from backend!");
        } catch (error) {
            console.error('Error sending BookmarkedPlaces to backend:', error);
            toast.success(`Error sending bookmarked places to backend! ${error}`, {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const changePasswordHandler = async () => {
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const userRoleRef = doc(firestore, "userRoles", uid);

            try {
                const docSnapshot = await getDoc(userRoleRef);

                if (docSnapshot.exists()) {
                    const email = docSnapshot.data().email;
                    await sendPasswordResetEmail(auth, email)
                        .then(() => {
                            toast.success(`Password reset link sent successfully!`, {
                                position: 'bottom-right',
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            console.log('Password reset link sent successfully!')
                        })
                        .catch((error) => {
                            toast.success(`Error occured while sending link: ${error}`, {
                                position: 'bottom-right',
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            console.error(`Error occurred: ${error.message}`)
                        })
                } else {
                    toast.success(`User data not found`, {
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
    }

    const handleUserReviewRating = () => {
        navigate("/userreviewrating")
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
                .then(() =>
                    console.log("Successfully logged out!"));
            toast.success(`Logged out successfully!`, {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            navigate("/login");
        } catch (error) {
            toast.success(`Error logging out: ${error}`, {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.error("Error logging out:", error);
        }
    };

    const fetchUserData = async () => {
        const user = auth.currentUser;

        if (user) {
            const uid = user.uid;
            const userRoleRef = doc(firestore, "userRoles", uid);

            try {
                const docSnapshot = await getDoc(userRoleRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setUserData(data);
                    setLocationPreferences(data.LocationPreference || []);
                    setCategoryPreferences(data.CategoryPreference || []);

                } else {
                    toast.success('User data not found', {
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
                toast.success(`Error fetching data! ${error}`, {
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
    };

    useEffect(() => {
        fetchUserData();
        const intervalId = setInterval(() => {
            fetchUserData();
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const handlebookmarks = () => {
        console.log("handling bookmarks")
    }

    return (
        <div className="bg-cover bg-center bg-no-repeat min-h-screen overflow-hidden" style={{ backgroundImage: `url(${background})` }}>
            <div>
                <Headers />
            </div>
            <div className="flex">
                <div className="flex flex-col items-center justify-center w-4/12 p-4 border-r border-gray-500">

                    <div className="mb-6">
                        <button
                            onClick={() => { navigate("/updateuserinfo") }}
                            className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
                        >
                            Update Information
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={handleUserReviewRating}
                            className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
                        >
                            User's All Reviews
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={() => { navigate("/bookmarks") }}
                            className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
                        >
                            Bookmarks
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={changePasswordHandler}
                            className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
                        >
                            Change Password
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
                        </button>
                    </div>

                    <div className="mb-6">
                        <button
                            onClick={handleLogout}
                            className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
                        >
                            Logout
                            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
                        </button>
                    </div>
                </div>

                <div>
                    <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '450px' }}>Bookmarked Places</h1>
                    <div className="wrapper">
                        {bookmarkedPlaces.map((place, index) => (
                            <div className="card" key={index}>
                                <img src={place.Image[0]} alt={place.Name} />

                                <div className="descriptions">
                                    <h1>{place.Name}</h1>
                                    <p>{place.ShortDescription}</p>
                                    {/* Use Link to redirect to details page */}
                                    <button onClick={() => { navigate(`/place/${encodeURIComponent(place.Name)}`, { state: { placeId: place.Place_id } }) }}>
                                        <i className="fab fa-youtube"></i>
                                        View More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}