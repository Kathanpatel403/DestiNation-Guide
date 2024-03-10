import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, firestore, storage } from "../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, arrayUnion, arrayRemove } from "firebase/firestore";
import axios from 'axios';
import '../components/card.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Headers from '../components/Headers';
import '../components/header.css';
import { FaSearch, FaArrowRight, FaHeart } from 'react-icons/fa';

export default function SearchPlace() {
    const location = useLocation();
    const [searchedPlaces, setSearchedPlaces] = useState([]);
    let navigate = useNavigate();
    const placeName = location.state.placeName;

    useEffect(() => {
        fetchSearchedPlaces();
    }, []);

    const fetchSearchedPlaces = async () => {
        toast.success(`searched Place: ${placeName}`)
        try {
            const response = await axios.post('http://localhost:8000/api/get_searched_places', {
                SearchedPlace: placeName,
            });

            const data = response.data;
            setSearchedPlaces(data.matching_places);
            console.log("Searched  fetched from backend!");
        } catch (error) {
            console.error('Error sending searched places to backend:', error);
            toast.success(`Error sending Searched Places to backend! ${error}`, {
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

    const handlebookmarks = () => {
        console.log("handling bookmarks")
    }

    return (
        <div>
            <div>
                <Headers />
            </div>
            <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '580px' }}>Searched Places</h1>
            <div>
                <div className="wrapper">
                    {searchedPlaces.map((place, index) => (
                        <div className="card" key={index}>
                            <img src={place.Image[0]} alt={place.Name} />
                            
                            <div className="descriptions">
                                <h1>{place.Name}</h1>
                                <p>{place.ShortDescription}</p>
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
    )
}