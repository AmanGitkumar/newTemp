import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Income from "./components/Incomes";
import Expenses from "./components/Expenses";
import Login from "./components/Login";
import Signup from "./components/Signup";



function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // ✅ Get current route
  const isLoggedIn = !!localStorage.getItem("token"); // ✅ Check if user is logged in

  return (
    <>
      {/* ✅ Navbar will appear only if the user is logged in */}
      {isLoggedIn && <Navbar />}

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incomes" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
