import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import axios from 'axios';
import './card.css';
import HomeHeader from './Headers';
 // Import the details component

const PopularCard = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/destinations/sorted-by-likes');
        console.log(response);
        setPlaces(response.data.destinations);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
     
      <h1 className='mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '580px' }}>Popular Destinations</h1>
      <div className="wrapper">
        {places.map((place, index) => (
          <div className="card" key={index}>
            <img src={place.Image[0]} alt={place.Name} />
            <div className="descriptions">
              <h1>{place.Name}</h1>
              <p>{place.ShortDescription}</p>
              {/* Use Link to redirect to details page */}
              <Link to={{
      pathname: `/place/${encodeURIComponent(place.Name)}`
    }}>          <button>
                  <i className="fab fa-youtube"></i>
                  View More
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PopularCard;
