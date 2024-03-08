import React, {useState} from "react";
import {  useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import InputControlPage from "./InputControlPage";
import { auth } from "../config/firebase";

function ForgotPassword() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: "",
    });
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = async () => {
        try{
            sendPasswordResetEmail(auth, values.email);
            alert("Password reset link sent to email successfully!");
            navigate("/login");
        }
        catch(error){
            console.log("Error occured while sending password reset link", error);
            alert("Error sending password reset link")
        }
        
        
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Forgot password</h1>
                <InputControlPage
                    label="Email"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, email: event.target.value }))
                    }
                    placeholder="Enter Email"
                />

                <div className="mt-6">
                    <button
                        disabled={submitButtonDisabled}
                        onClick={handleSubmission}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Send link
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword