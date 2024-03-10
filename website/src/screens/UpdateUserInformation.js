import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import { doc, updateDoc } from 'firebase/firestore';
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UpdateUserInformation() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState(['']);
  const [categories, setCategories] = useState(['']);
  const [name, setName] = useState(['']);

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


  return (
    <div className="flex flex-row items-center justify-center  bg-cover bg-center bg-no-repeat min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
      }}>
      <div>
        <div className="">
          <img src={logo} alt="logo image" className="w-[220px] h-[220px] ml-[120px]" />
        </div>

        <div className="p-8 bg-white rounded-lg shadow-xl w-[450px] mt-[-30px]">
          <h1 className="text-2xl font-bold mb-4 ml-[80px]">Update User's Information</h1>

          <div className=" bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
            <div className="form space-y-2">

              <label className="text-gray-700 ml-4">Name</label>
              <input
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder={`Name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />


              <div>
                <label className="text-gray-700 ml-4">Location Preferences</label>
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
                    Add location
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-50"></span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-700 ml-4">Category Preferences</label>
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
                    Add categorie
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-50"></span>
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleInformation}
                  className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
                >
                  Submit Information
                  <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}