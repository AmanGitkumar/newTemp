import React, { useEffect, useState } from "react";
import { addExpense, getExpenses, deleteExpense } from "../services/expense";
import "./Expenses.css";

const categoryOptions = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Health"];

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ category: categoryOptions[0], amount: "", date: "" });
    const [sortType, setSortType] = useState("latest");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            if (!Array.isArray(data)) {
                console.error("Fetched data is not an array:", data);
                return;
            }
            setExpenses(data);
            applySortingAndFiltering(data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleAddExpense = async () => {
        const selectedDate = new Date(newExpense.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            alert("Future dates are not allowed!");
            return;
        }

        if (!newExpense.amount || !newExpense.date) {
            alert("Please fill all fields");
            return;
        }

        try {
            const updatedExpenses = await addExpense(newExpense);
            if (!Array.isArray(updatedExpenses)) {
                console.error("Updated expenses is not an array:", updatedExpenses);
                return;
            }
            setExpenses(updatedExpenses);
            applySortingAndFiltering(updatedExpenses);
            setNewExpense({ category: categoryOptions[0], amount: "", date: "" });
        } catch (error) {
            console.error("Failed to add expense:", error);
        }
    };

    const handleDeleteExpense = async (id) => {
        try {
            const updatedExpenses = await deleteExpense(id);
            if (!Array.isArray(updatedExpenses)) {
                console.error("Updated expenses after deletion is not an array:", updatedExpenses);
                return;
            }
            setExpenses(updatedExpenses);
            applySortingAndFiltering(updatedExpenses);
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    useEffect(() => {
        applySortingAndFiltering(expenses);
    }, [sortType, selectedCategory]);

    const applySortingAndFiltering = (data) => {
        let sortedExpenses = [...data];

        if (selectedCategory !== "All") {
            sortedExpenses = sortedExpenses.filter(expense => expense.category === selectedCategory);
        }

        if (sortType === "latest") {
            sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortType === "oldest") {
            sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortType === "high") {
            sortedExpenses.sort((a, b) => b.amount - a.amount);
        } else if (sortType === "low") {
            sortedExpenses.sort((a, b) => a.amount - b.amount);
        }

        setFilteredExpenses(sortedExpenses);
    };

    return (
        <div className="expenses-container">
            <h2>Expenses</h2>

            <div className="filters">
                <select onChange={(e) => setSortType(e.target.value)}>
                    <option value="latest">Sort by: Latest</option>
                    <option value="oldest">Sort by: Oldest</option>
                    <option value="high">Sort by: High Amount</option>
                    <option value="low">Sort by: Low Amount</option>
                </select>

                <select onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="All">Filter by: All Categories</option>
                    {categoryOptions.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div className="add-expense">
                <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                    {categoryOptions.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
                <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
                <button onClick={handleAddExpense}>Add Expense</button>
            </div>

            <table className="expenses-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount (₹)</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                            <tr key={expense._id}>
                                <td>{expense.category}</td>
                                <td>₹{expense.amount}</td>
                                <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDeleteExpense(expense._id)}>
                                        ❌
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No expenses found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Expenses;
