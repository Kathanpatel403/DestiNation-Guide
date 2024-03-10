import React, { useState, useEffect } from 'react';
import { auth, firestore } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

export default function OneReviewRating() {
    const navigate = useNavigate();
    const [review, setreview] = useState("");
    const [rating, setRating] = useState(0);
    const location = useLocation();
    const placeName = location.state.placeName;

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

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Submit Review and Rating</h2>

            <div className="mb-4">
                <p className="mb-2">Rating: {rating}</p>
                <div className="flex]">
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
                    rows="4"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none"
                    required
                ></textarea>
            </div>

            <div>
                <button
                    type="button"
                    onClick={handleReviewSubmit}
                    className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
