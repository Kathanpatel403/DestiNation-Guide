import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const CategoryDetails = () => {
  const { categoryTitle } = useParams(); // Extract categoryTitle from URL
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories data from the backend using categoryTitle
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/places/category/${categoryTitle}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [categoryTitle]); // Fetch data whenever categoryTitle changes

  return (
    <>
      <h1 className='mt-10 -mb-5 text-center w-60 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-4xl rounded-lg p-4 shadow-md transform' style={{ marginLeft: '720px' }}>Category</h1>
      <div id="container">
        {categories.map((category, index) => (
          <Link key={index} to={`/category/${category.title}`}>
            <div id={`category-${index}`} className="element">
              <img src={category.image} alt={category.title} /> {/* Use default property for dynamic imports */}
              <p>{category.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryDetails;
