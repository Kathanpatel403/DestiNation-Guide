import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import InputControlPage from "./InputControlPage";
import { auth } from "../config/firebase";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    pass: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.email || !values.pass) {
      setErrorMsg("All fields are mendetory");
      return;
    }
    setErrorMsg("");

    signInWithEmailAndPassword(auth, values.email, values.pass);
    toast.success('Login successful!', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate("/home");
  };

  return (
    <div className="flex flex-row items-center justify-center  h-screen bg-cover bg-center bg-no-repeat min-h-screen"
      style={{
        backgroundImage: `url(${background})`,

      }}>
      <div className="">
        <div className="">
          <img src={logo} alt="logo image" className="w-[220px] h-[220px] ml-[120px] mt-[-100px]" />
        </div>
        <div className="p-8 bg-white rounded-lg shadow-xl w-[450px] mt-[-30px]">
          <h1 className="text-2xl font-bold mb-4 ml-[150px]">Login</h1>

          <InputControlPage
            label="Email"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="Enter email address"
            className="mb-[10px]"
          />

          <InputControlPage
            label="Password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
            placeholder="Enter Password"
          />

          <div className="mt-6">
            <b className="text-red-500 block mb-2">{errorMsg}</b>
            <button
              disabled={submitButtonDisabled}
              onClick={handleSubmission}
              className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
            >
              Login
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
            </button>
          </div>

          <div className="text-right">
            <Link to="/forgotpassword" className="text-gray-500 text-m">
              Forgot Password?
            </Link>
          </div>

          <p className="mt-4 text-m">
            Don't have an account?{" "}
            <span className="text-gray-500 font-semibold">
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage