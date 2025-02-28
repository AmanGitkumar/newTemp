import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const navigate = useNavigate();

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        isLoggedIn && (
            <nav className="navbar bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Personal Finance</h2>

                <div className="nav-links flex gap-4">
                    <Link className="text-gray-700 dark:text-gray-300 hover:text-blue-500" to="/dashboard">Dashboard</Link>
                    <Link className="text-gray-700 dark:text-gray-300 hover:text-blue-500" to="/incomes">Incomes</Link>
                    <Link className="text-gray-700 dark:text-gray-300 hover:text-blue-500" to="/expenses">Expenses</Link>
                    <Link className="text-gray-700 dark:text-gray-300 hover:text-blue-500" to="/payment">Go to Payment</Link>

                    {/* Dark Mode Toggle */}
                    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800">
                        {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon />}
                    </button>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="logout-btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </nav>
        )
    );
};

export default Navbar;