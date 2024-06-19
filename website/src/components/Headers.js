import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useNavigationType } from 'react-router-dom'; // Import Link from react-router-dom
import './header.css';
import logo from '../assets/images/logo.png';
import a from '../assets/images/avatar.png';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import { auth, firestore, storage } from "../config/firebase";
import { getFirestore, doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeHeader = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRoleRef = doc(firestore, "userRoles", uid);

      try {
        const docSnapshot = await getDoc(userRoleRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData(data);
        } else {
          toast.success('User data not found in firestore', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        toast.success(`Error fetching profile image!`, {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(() => {
      fetchUserData();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSearchNavigation = () => {
    // Perform any search-related tasks with the searchValue
    console.log('Performing search with:', searchValue);
    navigate("/searchplace", { state: { placeName: searchValue } });
  };

  const handleScroll = () => {
    const header = document.querySelector('.fixed');
    const content = document.querySelector('.content');
  
    if (window.scrollY > header.offsetHeight) {
      header.classList.add('glassy');
      content.classList.add('scroll-offset');
    } else {
      header.classList.remove('glassy');
      content.classList.remove('scroll-offset');
    }
  };
  
  window.addEventListener('scroll', handleScroll);

  return (
    <>
      <div className="logo-and-text">
        <img src={logo} alt="logo" style={{ marginTop: "-30px", marginLeft: "-30px", height: "200px", width: "200px" }} />
        <h4 className="animated-text">
  <span>D</span>
  <span>e</span>
  <span>s</span>
  <span>t</span>
  <span>i</span>
  <span>n</span>
  <span>a</span>
  <span>t</span>
  <span>i</span>
  <span>o</span>
  <span>n</span>
  <span> </span>
  <span>G</span>
  <span>u</span>
  <span>i</span>
  <span>d</span>
  <span>e</span>
</h4>
      </div>

      <div className="container">
        <nav className="flex items-center">
          <ul className="flex space-x-5">
            <li style={{marginTop: '28px', fontWeight: '600',width:'150px'}}><Link to="/">Home</Link></li>
            <li style={{marginTop: '28px', fontWeight: '600',width:'250px'}}><Link to="/popular">Popular Places</Link></li>
            <li style={{marginTop: '28px', fontWeight: '600',width:'350px'}}><Link to="/recommended">Recommended Places</Link></li>

            <li className="flex items-center justify-center mt-[48px] h-[15px] w-[1 00px]">
              <div className="relative ml-[50px] mr-[-300px] cursor-pointer">
                <FaSearch className="absolute left-1 text-gray-500 mt-[15px] ml-[7px]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-12 border p-2 rounded-l-md focus:outline-none"
                  style={{ width: "calc(100% - 30px)" }}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 rounded-r-md absolute right-0 mt-[7px] mr-[30px] h-[40px] w-[40px] cursor-pointer"
                  onClick={handleSearchNavigation}
                >
                  <FaArrowRight className="text-gray-500" />
                </button>
              </div>
            </li>

            <div className="profile-section" style={{
              marginTop:'37px',marginLeft:'150px'
            }}>
              <li>
                <Link to="/profile" className="profile-link flex items-center">
                  <img
                    src={userData?.photoURL || a}
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                  />
                </Link>
              </li>
            </div>

          </ul>
        </nav>
      </div>
    </>
  );
};

export default HomeHeader;
