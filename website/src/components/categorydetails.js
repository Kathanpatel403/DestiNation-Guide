import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HomeHeader from './Headers';

const CategoryDetails = () => {
  const { categoryTitle } = useParams(); // Extract categoryTitle from URL
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch categories data from the backend using categoryTitle
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/places/category/${categoryTitle}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPlaces(data.places);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [categoryTitle]); // Fetch data whenever categoryTitle changes

  return (
    <>
    <HomeHeader/>
     <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '580px' }}>{categoryTitle} Destinations</h1>
      <div className="wrapper">
        {places && places.length > 0 && places.map((place, index) => (
          <div className="card" key={index}>
            <img src={place.Image[0]} alt={place.Name} />
            <div className="descriptions">
              <h1>{place.Name}</h1>
              <p>{place.ShortDescription}</p>
              {/* Use Link to redirect to details page */}
              
                <button onClick={() => { navigate(`/place/${encodeURIComponent(place.Name)}`, { state: { placeId: place.Place_id } }) }}>
                  <i className="fab fa-youtube"></i>
                  View More
                </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryDetails;
