import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import { doc, updateDoc } from 'firebase/firestore';

export default function UserInformationForm() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState(['']); // State for location fields
    const [categories, setCategories] = useState(['']);

    const addLocationField = () => {
        setLocations([...locations, '']);
    };

    // Function to add a new category field
    const addCategoryField = () => {
        setCategories([...categories, '']);
    };

    // Function to handle changes in location fields
    const handleLocationChange = (index, value) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setLocations(newLocations);
    };

    // Function to handle changes in category fields
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
                
                navigate("/Home");
            }).catch((error) => {
                console.error("Error setting Preferences", error);
            })
        } else {
            console.log("user is not loggedin");
            
        }
    }


    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">User Information</h1>

                <div className=" bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                    <div className="form space-y-2">

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

                        <button onClick={addLocationField} className="py-3 bg-gray-400 rounded-xl">
                            <span className="font-xl font-bold text-center text-black">Add Locations</span>
                        </button>

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

                        <button onClick={addCategoryField} className="py-3 bg-gray-400 rounded-xl">
                            <span className="font-xl font-bold text-center text-black">Add Category</span>
                        </button>

                        <button onClick={handlesubmmitform} className="py-3 bg-gray-400 rounded-xl">
                            <span className="font-xl font-bold text-center text-black">Submit Information</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}