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

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found!");
      alert("Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/incomes/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch incomes");
      }

      setIncomes(data);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddIncome = async () => {
    const selectedDate = new Date(formData.date.split("/").reverse().join("-"));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    try {
      setLoading(true);
      await deleteIncome(id);
      setIncomes((prevIncomes) =>
        prevIncomes.filter((income) => income._id !== id)
      );
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="income-container">
      <h2 className="income-heading">Income</h2>

      {/* ✅ Income Form */}
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
          onChange={(e) => {
            setFormData({ ...formData, date: e.target.value });
          }}
        />
      </div>

      {/* ✅ Add Income Button (Between Input Section & Table) */}
      <button
        className="add-income-btn"
        onClick={handleAddIncome}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Income"}
      </button>

      {/* ✅ Income Table */}
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
              incomes.map((income) => {
                const formattedDate = new Date(income.date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                );

                return (
                  <tr key={income._id}>
                    <td>{income.source}</td>
                    <td>₹{income.amount}</td>
                    <td>{formattedDate}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteIncome(income._id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Incomes;
