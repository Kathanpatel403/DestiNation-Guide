import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import { doc, updateDoc } from 'firebase/firestore';
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserReviewRating() {


  return (
    <div className="flex flex-row items-center justify-center  bg-cover bg-center bg-no-repeat min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${background})`,
      }}>
      <div>
        User's All Review Rating Page.
      </div>
    </div>
  )
}