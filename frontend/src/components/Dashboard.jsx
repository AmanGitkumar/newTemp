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
  {[...incomes, ...expenses]
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date (oldest first)
    .map((transaction) => {
      const transactionType = transaction.type
        ? transaction.type.toLowerCase()
        : incomes.some((inc) => inc._id === transaction._id)
        ? "income"
        : "expense";

      // Convert date to dd/mm/yyyy format
      const formattedDate = new Date(transaction.date)
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

      return (
        <tr
          key={transaction._id}
          style={{
            backgroundColor: transactionType === "income" ? "lightgreen" : "lightcoral",
            color: "black",
          }}
        >
          <td>{formattedDate}</td>
          <td>{transaction.category || transaction.source}</td>
          <td>{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</td>
          <td>₹{transaction.amount}</td>
        </tr>
      );
    })}
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
