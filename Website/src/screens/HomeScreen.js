import React from 'react'
import { Link } from 'react-router-dom'
import sortCategories from '../components/sortCategories'

function HomeScreen(props) {
    return (
        <div>
            <sortCategories />
        </div>
    )
}

export default HomeScreen