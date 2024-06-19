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
import { FaUserEdit, FaRegComment, FaBookmark, FaLock, FaSignOutAlt } from 'react-icons/fa';
import './profile.css'



import { useHistory } from 'react-router-dom';
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
    <div>
      <div className='fixed z-10'>
        <Headers />
      </div>
      <div className="flex" style={{
        paddingTop:'200px'
      }}>
      <div className="flex flex-col items-center justify-center w-4/12 p-4 border-r border-gray-500">
        <div className="mb-6">
          <button
            onClick={() => { navigate("/updateuserinfo") }}
            className="profile-button"
          >
            <FaUserEdit className="icon" />
            Update Information
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => { navigate("/userreviewrating") }}
            className="profile-button"
          >
            <FaRegComment className="icon" />
            User's All Reviews
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => { navigate("/bookmarks") }}
            className="profile-button"
          >
            <FaBookmark className="icon" />
            Bookmarks
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => { navigate("/changepassword") }}
            className="profile-button"
          >
            <FaLock className="icon" />
            Change Password
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="profile-button"
          >
            <FaSignOutAlt className="icon" />
            Logout
          </button>
        </div>
      </div>

        {/* Second Half (70% width) */}
        <div className="flex flex-col items-center justify-center w-8/12 p-4">
          <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '50px' }}>Profile Page</h1>

          <img
            src={userData?.photoURL || avatar}
            alt="Profile"
            
            onClick={handleImageClick}
            className='profile-image'
          />
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

<div className="profile-info-container">
  <div className='profile-info bg-glass'>
    Name: {userData?.name}
  </div>
  <div className='profile-info bg-glass'>
    Email: {userData?.email}
  </div>
  <div className='profile-info bg-glass'>
    Location Preferences:
  </div>
  <div className='preferences-container'>
    {locationPreferences.map((location, index) => (
      <div key={index} className='preference-item bg-glass'>
        {location}
      </div>
    ))}
  </div>
  <div className='profile-info bg-glass'>
    Category Preferences:
  </div>
  <div className='preferences-container'>
    {categoryPreferences.map((category, index) => (
      <div key={index} className='preference-item bg-glass'>
        {category}
      </div>
    ))}
  </div>
</div>



        </div>
      </div>
    </div>
  );

}