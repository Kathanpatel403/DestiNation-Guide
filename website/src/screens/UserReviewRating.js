import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, firestore, storage } from "../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, arrayUnion, arrayRemove } from "firebase/firestore";
import Headers from '../components/Headers';
import { signOut, sendPasswordResetEmail } from "firebase/auth";

export default function UserReviewRating() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [locationPreferences, setLocationPreferences] = useState([]);
  const [categoryPreferences, setCategoryPreferences] = useState([]);
  const [review, setReviews] = useState([]);
  const [reviewsData, setReviewsData] = useState(null);


  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRef = doc(firestore, "userRoles", uid);

      try {
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          // Check if the user data contains the ReviewRating section
          if (userData.ReviewRating) {
            // Extract reviews and ratings from the ReviewRating section
            const reviewsData = Object.entries(userData.ReviewRating).map(([placeName, reviewInfo]) => ({
              placeName: placeName,
              rating: reviewInfo.Rating,
              review: reviewInfo.Review
            }));

            // Combine user data with reviews data
            const userDataWithReviews = {
              ...userData,
              reviews: reviewsData
            };

            setUserData(userDataWithReviews);

            toast.success('User data fetched successfully', {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            toast.success('User data does not contain reviews', {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
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
        toast.error(`Error fetching user data: ${error}`, {
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
  }, []);

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

  const handleUpdateInformation = () => {
    navigate("/updateuserinfo")
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


  const handlebookmarks = () => {
    console.log("handling bookmarks")
  }

  return (
    <>
      <div>
        <div>
          <Headers />
        </div>
        <div className="flex">
          <div className="flex flex-col items-center justify-center w-4/12 p-4 border-r border-gray-500">

            <div className="mb-6">
              <button
                onClick={() => { navigate("/profile") }}
                className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
              >
                Profile
                <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
              </button>
            </div>

            <div className="mb-6">
              <button
                onClick={handleUpdateInformation}
                className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
              >
                Update information
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


          <div className="flex flex-col items-center justify-center w-8/12 p-4">
            <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '50px' }}>User's all reviews</h1>

            {userData && (
              <div className="mt-[30px]">
                <h1>User Information: </h1>
                <div style={{
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
                  marginRight: '15px',
                }}>
                  <p>Name: {userData.name}</p>
                  <p>Email: {userData.email}</p>
                </div>
                <h2>Reviews: </h2>
                {userData.reviews && userData.reviews.map((review, index) => (
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
                    <h3>{review.placeName}</h3>
                    <p>Rating: {review.rating}</p>
                    <p>Review: {review.review}</p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </>
  );


}