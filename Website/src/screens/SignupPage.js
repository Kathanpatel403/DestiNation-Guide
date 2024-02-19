import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from "../config/firebase";
import InputControlPage from "./InputControlPage";
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
                    navigate("/userinfo")
                    alert(`User created successfully!`);
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


        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Signup</h1>

                <InputControlPage
                    label="Name"
                    placeholder="Enter your name"
                    onChange={(event) =>
                        setValues((prev) => ({ ...prev, name: event.target.value }))
                    }
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
                        onClick={handleSubmission}
                        disabled={submitButtonDisabled}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                    >
                        Signup
                    </button>
                </div>

                <p className="mt-4 text-sm">
                    Already have an account?{" "}
                    <span className="text-blue-500">
                        <Link to="/login">Login</Link>
                    </span>
                </p>
            </div>
        </div>
    )
}

export default SignupPage;