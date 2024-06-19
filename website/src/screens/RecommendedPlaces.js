import React from 'react';
import Recommendationcard from '../components/RecommendationCard';
import HomeHeader from '../components/Headers';
import background from "../assets/images/background.jpg";


export default function RecommendedPlaces() {
    return (
        <div>
            <div className='fixed z-10'>
                <HomeHeader />
            </div>
            <div style={{paddingTop:'200px'}}>
            <Recommendationcard /></div>
        </div>
    )
}
