import React, { useState, useEffect } from "react";
import { addIncome, getIncomes, deleteIncome } from "../services/income";
import "../components/Incomes.css";

const Incomes = () => {
    const [incomes, setIncomes] = useState([]);
    const [formData, setFormData] = useState({
        source: "",
        amount: "",
        date: "",
       
    });
    const [loading, setLoading] = useState(false);

    // Fetch incomes when the component loads
    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        const token = localStorage.getItem("token"); // ✅ Get token
    
        if (!token) {
            console.error("No token found!");
            alert("Please log in again.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/incomes/all", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Ensure "Bearer " prefix
                    "Content-Type": "application/json",
                },
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch incomes");
            }
    
            setIncomes(data); // ✅ Update state
        } catch (error) {
            console.error("Error fetching incomes:", error);
            alert(error.message);
        }
    };
    
    
    

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleAddIncome = async () => {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
        if (selectedDate > today) {
            alert("Future dates are not allowed!");
            return;
        }
    
        if (!formData.source || !formData.amount || !formData.date) {
            alert("All fields are required!");
            return;
        }
    
        try {
            await addIncome(formData);
            fetchIncomes();
            setFormData({ source: "", amount: "", date: "" });
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };
    


    const handleDeleteIncome = async (id) => {
        if (!window.confirm("Are you sure you want to delete this income?")) return;
    
        console.log("Deleting Income ID:", id); // ✅ Debugging
    
        try {
            setLoading(true);
            await deleteIncome(id);
            setIncomes((prevIncomes) => prevIncomes.filter((income) => income._id !== id)); // ✅ Remove from UI
        } catch (error) {
            console.log("Error deleting income:", error);
            alert("Failed to delete income!");
        } finally {
            setLoading(false);
        }
    };
    
    
    

    return (
        <div className="income-container">
            <h2 className="income-heading">Income</h2>

            {/* Add Income Form */}
            <div className="income-form">
                <input
                    type="text"
                    name="source"
                    placeholder="Source"
                    value={formData.source}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount (₹)"
                    value={formData.amount}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                <button onClick={handleAddIncome} disabled={loading}>
                    {loading ? "Adding..." : "Add Income"}
                </button>
            </div>

            {/* Income Table (Category Removed) */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="income-table">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Amount (₹)</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incomes.length === 0 ? (
                            <tr>
                                <td colSpan="4">No incomes found.</td>
                            </tr>
                        ) : (
                            incomes.map((income) => (
                                <tr key={income._id}>
                                    <td>{income.source}</td>
                                    <td>₹{income.amount}</td>
                                    <td>{new Date(income.date).toLocaleDateString("en-GB")}</td>
                                    <td>
                                        <button className="delete-btn" onClick={() => handleDeleteIncome(income._id)}>
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Incomes;
