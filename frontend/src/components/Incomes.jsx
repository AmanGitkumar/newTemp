import React, { useState, useEffect } from "react";
import { addIncome, getIncomes, deleteIncome } from "../services/income";
import "../components/Incomes.css";
import { Trash2 } from "lucide-react";


const Incomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIncomes();
  }, []);

  useEffect(() => {
    applySortingAndFiltering(incomes);
  }, [sortType, searchQuery]);

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
      applySortingAndFiltering(data);
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
    try {
      setLoading(true);
      await deleteIncome(id);
      setIncomes((prevIncomes) =>
        prevIncomes.filter((income) => income._id !== id)
      );
      applySortingAndFiltering(incomes.filter((income) => income._id !== id));
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income!");
    } finally {
      setLoading(false);
    }
  };

  const applySortingAndFiltering = (data) => {
    let sortedIncomes = [...data];

    if (searchQuery) {
      sortedIncomes = sortedIncomes.filter((income) =>
        income.source.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortType === "latest") {
      sortedIncomes.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === "oldest") {
      sortedIncomes.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortType === "high") {
      sortedIncomes.sort((a, b) => b.amount - a.amount);
    } else if (sortType === "low") {
      sortedIncomes.sort((a, b) => a.amount - b.amount);
    }

    setFilteredIncomes(sortedIncomes);
  };

  return (
    <div className="income-container">
      <h2 className="income-heading">Income</h2>

      {/* ✅ Sorting & Search Filters */}
      <div className="filters">
        <select onChange={(e) => setSortType(e.target.value)}>
          <option value="latest">Sort by: Latest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="high">Sort by: High Amount</option>
          <option value="low">Sort by: Low Amount</option>
        </select>
        <input
          type="text"
          placeholder="Search by Source"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      {/* ✅ Add Income Button */}
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
            {filteredIncomes.length === 0 ? (
              <tr>
                <td colSpan="4">No incomes found.</td>
              </tr>
            ) : (
              filteredIncomes.map((income) => (
                <tr key={income._id}>
                  <td>{income.source}</td>
                  <td>₹{income.amount}</td>
                  <td>{new Date(income.date).toLocaleDateString("en-GB")}</td>
                  <td>
  <button
    className="delete-btn"
    onClick={() => handleDeleteExpense(expense._id)}
  >
    <Trash2 size={20} color="red" />
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
