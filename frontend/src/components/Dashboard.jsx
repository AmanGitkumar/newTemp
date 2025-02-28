import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getExpenses } from "../services/expense";
import { getIncomes } from "../services/income";
import "./Dashboard.css";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigate = useNavigate(); // ✅ Navigation ke liye

  useEffect(() => {
    // ✅ Authentication Check
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // ✅ Agar token nahi mila toh login pe bhej do
      return;
    }

    fetchExpenses();
    fetchIncomes();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
      setTotalExpenses(data.reduce((acc, expense) => acc + expense.amount, 0));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
      setTotalIncome(data.reduce((acc, income) => acc + income.amount, 0));
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  const totalBalance = totalIncome - totalExpenses;

  return (
    <div className="dashboard-container">
      <h1>Finance Dashboard</h1>

      <div className="summary-cards">
        <div className="card balance">
          <h3>Total Balance</h3>
          <p>₹{totalBalance}</p>
        </div>
        <div className="card income">
          <h3>Total Income</h3>
          <p>₹{totalIncome}</p>
        </div>
        <div className="card expenses">
          <h3>Total Expenses</h3>
          <p>₹{totalExpenses}</p>
        </div>
      </div>

      <div className="transactions">
        <h2>Recent Transactions</h2>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {[...incomes, ...expenses].map((transaction) => (
              <tr
                key={transaction._id}
                className={
                  transaction.type ? transaction.type.toLowerCase() : "income"
                }
              >
                <td>
                  {new Date(transaction.date).toLocaleDateString("en-GB")}
                </td>
                <td>{transaction.category || transaction.source}</td>
                <td>
                  {transaction.type
                    ? transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)
                    : incomes.some((inc) => inc._id === transaction._id)
                    ? "Income"
                    : "Expense"}
                </td>

                <td>₹{transaction.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-actions">
        <Link to="/incomes" className="dashboard-btn income-btn">
          View Incomes
        </Link>
        <Link to="/expenses" className="dashboard-btn expenses-btn">
          View Expenses
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;



