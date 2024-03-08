import React from 'react';
import Headers from '../component/Headers';
import PopularCard from '../component/PopularCard';
import RecommendationCard from '../component/RecommendationCard';
import Category from '../component/category';
import './HomeScreen.css'; // Import CSS file for styling

function HomeScreen(props) {
    return (
        <div className="home-screen">
            <Headers/>
            <Category/>
            <PopularCard/>
            <RecommendationCard/>
            
        </div>
    );
}

export default HomeScreen;
