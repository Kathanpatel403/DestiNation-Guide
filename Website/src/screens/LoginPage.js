import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import InputControlPage from "./InputControlPage";
import { auth } from "../config/firebase";
import logo from '../assets/images/logo.png'

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
        alert("signin successful!")
        navigate("/Home");
    };
    return (
        <div className="flex flex-row items-center justify-center  h-screen  bg-gray-300">
            <div className="">
                <div className="">
                    <img src={logo} alt="logo image" className="w-[200px] h-[200px] ml-[150px]"/>
                </div>
                <div className="p-8 bg-white rounded-lg shadow-md w-[500px] mt-[-30px]">
                    <h1 className="text-2xl font-bold mb-4 ml-[200px]">Login</h1>

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
                            className="text-white bg-gray-500 py-2 px-4 rounded-md"
                        >
                            Login
                        </button>
                    </div>

                    <div className="text-right">
                        <Link to="/forgotpassword" className="text-gray-500 text-sm">
                            Forgot Password?
                        </Link>
                    </div>

                    <p className="mt-4 text-sm">
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