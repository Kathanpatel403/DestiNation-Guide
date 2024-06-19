import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Headers from '../components/Headers';
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
import { auth, firestore, storage } from "../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, arrayUnion, arrayRemove } from "firebase/firestore";
import { FaUser, FaRegComment, FaBookmark, FaLock, FaSignOutAlt } from 'react-icons/fa';
import './profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPlus, faCheck,faUser} from '@fortawesome/free-solid-svg-icons';


export default function UpdateUserInformation() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState(['']);
  const [categories, setCategories] = useState(['']);
  const [name, setName] = useState(['']); const [userData, setUserData] = useState(null);
  const [locationPreferences, setLocationPreferences] = useState([]);
  const [categoryPreferences, setCategoryPreferences] = useState([]);

  const addLocationField = () => {
    setLocations([...locations, '']);
  };

  const addCategoryField = () => {
    setCategories([...categories, '']);
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleInformation = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);

      const updateObject = {};

      if (name.length !== 0) {
        updateObject.name = name;
      }

      // Check if the 'locations' field is provided and not empty
      // if (locations.length !== 0) {
      //     updateObject.LocationPreference = locations;
      // }

      // // Check if the 'categories' field is provided and not empty
      // if (categories.length !== 0) {
      //     updateObject.CategoryPreference = categories;
      // }

      if (Array.isArray(locations) && locations.some(value => value.trim() !== '')) {
        updateObject.LocationPreference = locations.map(value => value.trim());
      }

      // Check if the 'categories' field is provided, not null, and the array has non-empty elements
      if (Array.isArray(categories) && categories.some(value => value.trim() !== '')) {
        updateObject.CategoryPreference = categories.map(value => value.trim());
      }

      console.log(updateObject)
      updateDoc(userRoleRef, updateObject).then(() => {
        console.log("Preferences set successfully.");
        toast.success(`User preferences set successfully!`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/profile");
      }).catch((error) => {
        console.error("Error setting Preferences", error);
        toast.success(`Error setting preferences`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
    } else {
      console.log("user is not loggedin");
      toast.success(`User is not loggedIn!`, {
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
    <>
      <div>
        <div className="fixed z-10">
          <Headers />
        </div>
        <div className="flex" style={{
          paddingTop:'200px'
        }}>
        <div className="flex flex-col items-center justify-center w-4/12 p-4 border-r border-gray-500">
        <div className="mb-6">
          <button
            onClick={() => { navigate("/profile") }}
            className="profile-button"
          >
            <FaUser className="icon" />
            Profile
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


      <div className="flex flex-col items-center justify-center w-8/12 p-4">
  <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '10px' }}>Update information</h1>

  <div className="profile-info-container">
    <div className="form space-y-2">

      <label className="text-gray-700 ml-4">
        <FontAwesomeIcon icon={faUser} className="mr-2" />
        User's new Name
      </label>
      <input
        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
        placeholder={`Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div>
        <label className="text-gray-700 ml-4">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          Location Preferences
        </label>
        {locations.map((location, index) => (
          <input
            key={index}
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder={`Location ${index + 1}`}
            value={location}
            onChange={(e) => handleLocationChange(index, e.target.value)}
          />
        ))}

        <div>
          <button
            onClick={addLocationField}
            className="text-white py-2 px-4 rounded-md overflow-hidden transform  bg-gray-600  hover:bg-gray-800 hover:shadow-md group"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add location
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-50"></span>
          </button>
        </div>
      </div>

      <div>
        <label className="text-gray-700 ml-4">
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          Category Preferences
        </label>
        {categories.map((category, index) => (
          <input
            key={index}
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder={`Category ${index + 1}`}
            value={category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
          />
        ))}

        <div>
          <button
            onClick={addCategoryField}
            className="text-white py-2 px-4 rounded-md overflow-hidden transform  bg-gray-600  hover:bg-gray-800 hover:shadow-md group"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add category
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-50"></span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleInformation}
          className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-500 hover:shadow-md group"
        >
          <FontAwesomeIcon icon={faCheck} className="mr-2" />
          Submit Information
          <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
        </button>
      </div>
    </div>
  </div>
</div>

        </div>

      </div>
    </>
  )
}