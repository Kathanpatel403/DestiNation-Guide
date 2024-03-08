import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from "../config/firebase";
import InputControlPage from "./InputControlPage";
import logo from '../assets/images/logo.png';
import background from "../assets/images/background.jpg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = async () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("All fields are mendetory");
      return;
    }
    setErrorMsg("");

    if (values.email && values.pass) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.pass);

        const uid = userCredential.user.uid;

        const userRoleRef = doc(collection(firestore, 'userRoles'), uid);
        setDoc(userRoleRef, {
          role: "user",
          email: values.email,
          name: values.name,
        }).then(() => {
          console.log("User role set successfully.");
          toast.success('Signup successful!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/userinfo")
        }).catch((error) => {
          console.error("Error setting user role:", error);
        })
      } catch (err) {
        alert(`got error: ${err.message}`);
        console.log("got error: ", err.message);
      }
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
          <h1 className="text-2xl font-bold mb-4 ml-[150px]">Signup</h1>

          <InputControlPage
            label="Name"
            placeholder="Enter your name"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
            className="mb-[10px]"
          />
          <InputControlPage
            label="Email"
            placeholder="Enter email address"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <InputControlPage
            label="Password"
            placeholder="Enter password"
            onChange={(event) =>
              setValues((prev) => ({ ...prev, pass: event.target.value }))
            }
          />

          <div className="mt-6">
            <b className="text-red-500 block mb-2">{errorMsg}</b>
            <button
              disabled={submitButtonDisabled}
              onClick={handleSubmission}
              className="text-white py-2 px-4 rounded-md overflow-hidden transform transition-all duration-300 ease-in-out bg-gray-600 hover:scale-105 hover:bg-gray-800 hover:shadow-md group"
            >
              Signup
              <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-50"></span>
            </button>
          </div>

          <p className="mt-4 text-m">
            Already have an account?{" "}
            <span className="text-gray-500 font-semibold">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage;