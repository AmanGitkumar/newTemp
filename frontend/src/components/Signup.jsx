import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./Signup.css";

const Signup = () => {
    const navigate = useNavigate(); // ✅ Initialize useNavigate
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup Successful!");
                
                // ✅ Store Token in Local Storage
                localStorage.setItem("authToken", data.token);

                // ✅ Redirect to Dashboard
                navigate("/dashboard");
            } else {
                alert(data.message || "Signup Failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="signup-container flex justify-center items-center h-screen bg-gray-100">
            <div className="signup-box bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Enter your name"
                    className="border p-2 w-full mb-4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="border p-2 w-full mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Create a password"
                    className="border p-2 w-full mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleSignup}
                    className="bg-pink-500 text-white p-2 rounded w-full"
                >
                    Sign Up
                </button>
                <p className="login-link text-center mt-4">
                    Already have an account? <a href="/login" className="text-blue-500">Log In</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;




