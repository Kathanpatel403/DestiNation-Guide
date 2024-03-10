import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import axios from "axios";
import "./card.css";
import HomeHeader from "./Headers";
import { FaSearch, FaArrowRight, FaHeart } from "react-icons/fa";
// Import the details component

const PopularCard = () => {
  const [places, setPlaces] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/destinations/sorted-by-likes"
        );
        console.log(response);
        setPlaces(response.data.destinations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handlebookmarks = async () => {
    console.log("bookmarked handled!")
  };

  return (
    <>
      <h1
        className="mt-10 -mb-3 text-center w-96 bg-gradient-to-r from-slate-300 to-slate-400 text-black text-4xl rounded-lg p-4 shadow-md transform"
        style={{ marginLeft: "580px" }}
      >
        Popular Destinations
      </h1> 
      <div className="wrapper">
        {places.map((place, index) => (
          <div className="card" key={index}>
            <img src={place.Image[0]} alt={place.Name} />
            <div className="descriptions">
              <h1>{place.Name}</h1>
              <p>{place.ShortDescription}</p>
              {/* Use Link to redirect to details page */}
              
                {" "}
                <button  onClick={() => { navigate(`/place/${encodeURIComponent(place.Name)}`, { state: { placeId: place.Place_id } }) }}>
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

export default PopularCard;
