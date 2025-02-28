import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", checkAuth); // Listen for changes
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/"); // ✅ Redirects to Home Page instead of Login Page
    };

    return (
        isLoggedIn && (
            <nav className="navbar">
                <h2>Personal Finance</h2>
                <div className="nav-links">
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/incomes">Incomes</Link>
                    <Link to="/expenses">Expenses</Link>
                    <Link to="/payment">Go to Payment</Link>

                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>
        )
    );
};

export default Navbar;
