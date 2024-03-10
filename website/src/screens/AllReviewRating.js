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

function AllReviewRating() {
    const navigate = useNavigate();
    const location = useLocation();
    const placeName = location.state.placeName;
    const [reviewsData, setReviewsData] = useState([]);

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

    const generateStars = () =>{
        console.log("generating stars")
    }

    return (
        <div className="flex flex-row items-center justify-center  h-screen bg-cover bg-center bg-no-repeat min-h-screen"
            style={{
                backgroundImage: `url(${background})`,

            }}>
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
                        <div style={{ fontSize: '15px', fontWeight: "bold", marginBottom: '15px' }}>Name: {review.name}</div>
                        <div style={{ fontSize: '15px', marginBottom: '15px' }}>Email: {review.email}</div>
                        <div style={{ fontSize: '15px', marginBottom: '15px' }}>Review: {review.review}</div>
                        <div style={{ flexDirection: "row" }}>
                            <div style={{ fontSize: '15px', marginBottom: '15px' }}>Rating: ({review.rating})</div>
                            <div style={{ fontSize: '15px' }}>  {generateStars(review.rating)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllReviewRating