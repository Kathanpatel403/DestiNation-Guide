import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import { doc, updateDoc } from 'firebase/firestore';
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserInformationForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState(['']); 
  const [categories, setCategories] = useState(['']);

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

  const handlesubmmitform = () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);

      updateDoc(userRoleRef, {
        LocationPreference: locations,
        CategoryPreference: categories,
      }).then(() => {
        console.log("Preferences set successfully.");
        toast.success('Preferences set successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
        navigate("/home");
      }).catch((error) => {
        console.error("Error setting Preferences", error);
      })
    } else {
      console.log("user is not loggedin");
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
          <h1 className="text-2xl font-bold mb-4 ml-[80px]">User Information</h1>

          <div className=" bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
            <div className="form space-y-2">
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
                  onClick={handlesubmmitform}
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