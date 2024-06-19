import React,{ useState, useEffect } from 'react';
import Headers from '../components/Headers';
import PopularCard from '../components/PopularCard';
import RecommendationCard from '../components/RecommendationCard';
import Category from '../components/category';
import './HomeScreen.css'; // Import CSS file for styling
import Alldesti from '../components/alldestination';
function HomeScreen(props) {
 

  return (
    <div className="home-screen">
      <div className="fixed z-10">
                <Headers />
            </div>
    
    <div className='pt-56'>
        <Category />
        <Alldesti />
      </div>
      </div>
    
  );
}

export default HomeScreen;
