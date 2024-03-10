import React, { useState } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import InputControlPage from "./InputControlPage";
import { auth } from "../config/firebase";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = async () => {
    try {
      if (!values.email) {
        setErrorMsg("Please provide email");
        return;
      }
      setErrorMsg("");

      sendPasswordResetEmail(auth, values.email);
      toast.success('Varification link sent to email successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/login");
    }
    catch (error) {
      console.log("Error occured while sending password reset link", error);
      alert("Error sending password reset link")
    }


  };

  return (
    <div className="flex flex-row items-center justify-center  h-screen bg-cover bg-center bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(${background})`,

      }}>
      <div>
        <div className="">
          <img src={logo} alt="logo image" className="w-[220px] h-[220px] ml-[120px] mt-[-100px]" />
        </div>
        <div className="p-8 bg-white rounded-lg shadow-xl w-[450px] mt-[-30px]">
          <h1 className="text-2xl font-bold mb-4 ml-[90px]">Forgot password</h1>
          <InputControlPage
            label="Email"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter Email"
            className="mb-[10px]"
          />

          <div className="mt-6">
            <b className="text-red-500 block mb-2">{errorMsg}</b>
            <button
              disabled={submitButtonDisabled}
              onClick={handleSubmission}
              className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
            >
              Send link
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword