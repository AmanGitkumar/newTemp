import React, { useEffect, useState } from "react";
import { addExpense, getExpenses, deleteExpense } from "../services/expense";
import "./Expenses.css";

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: "" });

    // ✅ Backend se expenses load karega
    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data);
        } catch (error) {
            console.log("Error fetching expenses:", error);
        }
    };

    const handleAddExpense = async () => {
        const selectedDate = new Date(newExpense.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
        if (selectedDate > today) {
            alert("Future dates are not allowed!");
            return;
        }
    
        if (!newExpense.category || !newExpense.amount || !newExpense.date) {
            alert("Please fill all fields");
            return;
        }
    
        try {
            const updatedExpenses = await addExpense(newExpense); // ✅ Get full updated list
            setExpenses(updatedExpenses); // ✅ Update state with full list
            setNewExpense({ category: "", amount: "", date: "" }); // ✅ Clear form
        } catch (error) {
            alert(error.message || "Failed to add expense");
        }
    };
    
    
    
    

    const handleDeleteExpense = async (id) => {
        try {
            const updatedExpenses = await deleteExpense(id); // ✅ Get full updated list
            setExpenses(updatedExpenses); // ✅ Update state with full list
        } catch (error) {
            console.log("Error deleting expense:", error);
        }
    };
    

    return (
        <div className="expenses-container">
            <h2>Expenses</h2>
            <div className="add-expense">
                <input
                    type="text"
                    placeholder="Category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                />
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
        {expenses.length > 0 ? (
            expenses.map((expense) => (
                <tr key={expense._id}>
                    <td>{expense.category}</td>
                    <td>₹{expense.amount}</td>
                    <td>{new Date(expense.date).toLocaleDateString()}</td>
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



