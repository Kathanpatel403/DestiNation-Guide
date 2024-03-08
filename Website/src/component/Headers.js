import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './header.css';
import logo  from '../assets/images/logo.png';
import  a from '../assets/images/avatar.png';
const HomeHeader = () => {
  return (
    <>
      <div className="logo-and-text">
        <img src={logo} alt="logo" style={{marginTop:"-30px",marginLeft:"-50px",height:"200px",width:"200px"}}/>
        <h4 className="animated-text ml-96" style={{
          fontSize:48, marginTop:-40
        }} >
          <span>D</span><span>e</span><span>s</span><span>t</span><span>i</span><span>n</span><span>a</span><span>t</span><span>i</span><span>o</span><span>n</span><span> </span><span>G</span><span>u</span><span>i</span><span>d</span><span>e</span>
        </h4>
      </div>
      <div className="container">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li> {/* Connect to Home page */}
            <li><Link to="/destinations">Destinations</Link></li> {/* Connect to Destinations page */}
            <li><Link to="#">Bookmark</Link></li> 
            <li><Link to="#">Search</Link></li> 
            <li style={{ marginLeft: '48%' }}>
        <Link to="#" className="profile-link" >
          <img
            src={a} // Provide the path to your image here
            alt="Profile"
            style={{ width: '44px', height: '44px',marginBottom:'-30px',marginTop:'-30px'}} // Adjust width and height as needed
          />
        </Link>
      </li>
          </ul>
        </nav>
      </div>  
    </>
  );
};

export default HomeHeader;
