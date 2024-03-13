import React from 'react';
import Headers from '../components/Headers';
import PopularCard from '../components/PopularCard';
import RecommendationCard from '../components/RecommendationCard';
import Category from '../components/category';
import './HomeScreen.css'; // Import CSS file for styling
import Alldesti from '../components/alldestination';

function HomeScreen(props) {
  return (
    <div className="home-screen">
      <Headers />
      <Category />
      <Alldesti />
    </div>
  )
}

export default HomeScreen;