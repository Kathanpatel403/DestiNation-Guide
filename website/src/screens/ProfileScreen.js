import React, { useState, useEffect } from 'react'
import avatar from "../assets/images/avatar.png";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth, firestore, storage } from "../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';
import Headers from '../components/Headers';


export default function ProfileScreen() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [locationPreferences, setLocationPreferences] = useState([]);
  const [categoryPreferences, setCategoryPreferences] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

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

  const handleImageClick = () => {
    // Trigger file input click
    document.getElementById('imageInput').click();
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      uploadImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    try {
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `userProfileImages/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update user profile in Firestore with the image URL
        const userRoleRef = doc(firestore, "userRoles", uid);
        await updateDoc(userRoleRef, { photoURL: downloadURL });

        setImageUrl(downloadURL);
        toast.success(`Image uploaded successfully!`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log('Image uploaded successfully!');
      }
    } catch (error) {
      toast.success(`Error uploading image: ${error}`, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error uploading image:', error);
    }
  };

  const LocationPreferences = ({ locationPreferences }) => {
    return (
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
          Location Preferences:
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
          {locationPreferences.map((location, index) => (
            <p key={index} style={{ marginRight: '1rem', marginBottom: '0.5rem' }}>
              {location}
            </p>
          ))}
        </div>
      </div>
    );
  };

  const handleUserReviewRating = () => {
    navigate("/userreviewrating")
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

        {/* Second Half (70% width) */}
        <div className="flex flex-col items-center justify-center w-8/12 p-4">
          <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '50px' }}>Profile Page</h1>

          <img
            src={userData?.photoURL || avatar}
            alt="Profile"
            style={{ width: '150px', height: '150px', borderRadius: '100%', cursor: 'pointer', marginBottom: '15px', marginTop: '50px' }}
            onClick={handleImageClick}
          />
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          <div className="border border-gray-600 p-5 rounded-xl ">
            <div
              style={{
                backgroundColor: "#e3e3e3", // Lighter background color
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '5px',
                marginLeft: '5px',
                marginRight: '5px',
                alignItems: "flex-start", // Align text to the left
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 1,
                borderColor: "#ccc", // Light border color
              }}>
              <div>Name: {userData?.name}</div>
            </div>

            <div
              style={{
                backgroundColor: "#e3e3e3", // Lighter background color
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '5px',
                marginLeft: '5px',
                marginRight: '5px',
                alignItems: "flex-start", // Align text to the left
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 1,
                borderColor: "#ccc", // Light border color
              }}>
              <div>Email: {userData?.email}</div>
            </div>

            <div
              style={{
                backgroundColor: "#e3e3e3", // Lighter background color
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '5px',
                marginLeft: '5px',
                marginRight: '5px',
                alignItems: "flex-start", // Align text to the left
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 1,
                borderColor: "#ccc", // Light border color
              }}>
              <div style={{ fontSize: '1 rem', color: '#333' }}>
                Location Preferences:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'flex-start' }}>
                {locationPreferences.map((location, index) => (
                  <p key={index} style={{ marginRight: '1rem' }}>
                    {location}
                  </p>
                ))}
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#e3e3e3", // Lighter background color
                borderRadius: '5px',
                padding: '5px',
                marginBottom: '5px',
                marginLeft: '5px',
                marginRight: '5px',
                alignItems: "flex-start", // Align text to the left
                shadowColor: "#fff",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 1,
                borderColor: "#ccc", // Light border color
              }}>
              <div style={{ fontSize: '1 rem', color: '#333' }}>
                Category Preferences:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'flex-start' }}>
                {categoryPreferences.map((category, index) => (
                  <p key={index} style={{ marginRight: '1rem' }}>
                    {category}
                  </p>
                ))}
              </div>
            </div>



          </div>


        </div>
      </div>
    </div>
  );

}