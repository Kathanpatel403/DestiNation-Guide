import React from 'react';
import Recommendationcard from '../components/RecommendationCard';
import HomeHeader from '../components/Headers';
import background from "../assets/images/background.jpg";


export default function RecommendedPlaces() {
    return (
        <div>
            <div>
                <HomeHeader />
            </div>
            <Recommendationcard />
        </div>
    )
}
