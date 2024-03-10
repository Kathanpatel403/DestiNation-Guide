import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './category.css';

const BASE_URL = 'http://localhost:8000/'; // Assuming this is your base API URL

const categoriesData = [
 
    {
      title: "Mountains",
      image: require("../assets/images/mountain.png"),
    },
    {
      title: "Adventure",
      image: require("../assets/images/camp.png"),
    },
    {
      title: "Spiritual",
      image: require("../assets/images/sunset.png"),
    },
    {
      title: "Wildlife",
      image: require("../assets/images/hiking.png"),
    },
    {
      title: "Beach",
      image: require("../assets/images/beach.png"),
    },
    {
      title: "Forest",
      image: require("../assets/images/forest.png"),
    },
    {
      title: "Historical",
      image: require("../assets/images/historical.jpg"),
    },
  ];
const Category = () => {
  const [places, setPlaces] = useState([]);

  const fetchPlacesByCategory = async (category) => {
    try {
      const response = await fetch(`${BASE_URL}api/places/category/${category}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPlaces(data.places);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  useEffect(() => {
    // Example: Fetch places for the first category on component mount
    if (categoriesData.length > 0) {
      fetchPlacesByCategory(categoriesData[0].title);
    }
  }, []);

  const handleCategoryPress = (category) => {
    // Fetch places data based on the selected category
    fetchPlacesByCategory(category);
  };

  return (
    <>
      <h1 className='mt-10 -mb-5 text-center w-60 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '630px' }}>Category</h1>

      <div id="container">
        {categoriesData.map((category, index) => (
          <Link key={index} to={`/category/${category.title}`} className="category-link">
            <div id={`category-${index}`} className="element" onClick={() => handleCategoryPress(category.title)}>
              <img src={category.image} alt={category.title} /> {/* Use default property for dynamic imports */}
              <p>{category.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Category;
