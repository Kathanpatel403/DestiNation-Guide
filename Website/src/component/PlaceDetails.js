import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PlaceDetails.css'
import HomeHeader from './Headers';
const PlaceDetails = () => {
  const { placeName } = useParams();
  const [place, setPlace] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
 

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/places/${placeName}`);
        setPlace(response.data.place); // Assuming the response contains a 'place' property
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };

    fetchPlaceDetails();
  }, [placeName]);


  // const categoryArray = JSON.parse(place.Category);
  useEffect(() => {
    const startCarousel = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % place.Image.length);
      }, 3000); // Change image every 3 seconds
    };

    const stopCarousel = () => {
      clearInterval(intervalRef.current);
    };

    if (place && place.Image && place.Image.length > 1) {
      startCarousel();
      return () => stopCarousel();
    }
  }, [place]);
  
  return (
    <>
    <div style={{
      width:'98%',
      marginLeft:'12px'
    }}>
    <HomeHeader/></div>
    
    <div>
      {place ? (
        <div>
          <h1 className='mt-10 text-3xl text-center mb-6'>{place.Name}</h1>
          
          {/* Carousel */}
          <div className='carousel-container'>
            {place.Image.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index}`}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: `${index === currentIndex ? '0' : '-100%'}`,
                  transition: 'left 1s',
                  width: '95%',
                  height: '97%',
                  
                  margin:15,
                  
                  objectFit: 'cover',
                  borderRadius:10
                }}
              />
            ))}
          </div>
         
          <div className='main-div'>
          <p className='text-xl description'>
  <span className=' description-heading'>Description</span><br/>
  {place.LongDescription}
</p>

          <p className=' location' ><span className='location-heading' >Location:</span> {place.City},{place.State},{place.Country}({place.latitude},{place.longitude})</p>
          
          <p className='Timing'><span className='Timings-h'>Timings:</span> {place.Timings}</p>
          <p className='Fee'><span className='Fee-h'>Fee:</span> {place.Fee}</p>
          <p className='Feelink'>
  <span style={{fontWeight:'bolder',color:'black'}}>FeeLink:</span> 
  <a href={place.FeeLink} target="_blank" rel="noopener noreferrer">Click Here</a>
</p>
          <p className='BMTV' style={{fontWeight:'bolder',color:'black'}}><span className='BMTV-h'>BMTV:</span> {place.BMTV}</p>
          <div>
  <h2 className='Activities' style={{fontWeight:'bolder',color:'black'}}>Activities:</h2>
  <ul className='Activities'>
    {Array.isArray(place.Activities) ? (
      place.Activities.map((Activities, index) => (
        <li key={index}>{Activities}</li>
      ))
    ) : (
      <li>{place.Category}</li>
    )}
  </ul>
</div>
<div>
  <h2 className='Amenities' style={{fontWeight:'bolder',color:'black'}}>Amenities:</h2>
  <ul className='Amenities'>
    {Array.isArray(place.Amenities) ? (
      place.Amenities.map((Amenities, index) => (
        <li key={index}>{Amenities}</li>
      ))
    ) : (
      <li>{place.Category}</li>
    )}
  </ul>
</div></div>

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div></>
  );
};

export default PlaceDetails;