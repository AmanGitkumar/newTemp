import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={`home-container ${theme}`}>
      <div className="header-container">
        <div className="homeright">
          <h1 className="home-title">Finance Tracker</h1>
          <p className="home-description">
            Take control of your finances! Manage your Dashboard, Incomes, and Expenses efficiently.
          </p>
          <div className="navbar-right">
            <ul className="auth-links">
              <li><Link to="/login" className="login-btn">Log in</Link></li>
              <li><Link to="/signup" className="signup-btn">Sign up</Link></li>
            </ul>
          </div>
        </div>

        {/* Theme Toggle Image */}
        <img 
          className="daypic" 
          src={theme === "light" ? "/day.jpg" : "/night.jpg"} 
          alt="Theme Toggle" 
          onClick={toggleTheme} 
        />

        {/* Finance Tracker Image */}
        <img className="homep"  src={theme === "light" ? "/photo2.jpg" : "/photo1.jpg"} alt="Finance Tracker Logo" />
      </div>
    </div>
  );
};

export default Home;