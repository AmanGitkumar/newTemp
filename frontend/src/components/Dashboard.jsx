// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { getExpenses } from "../services/expense";
// import { getIncomes } from "../services/income";
// import "./Dashboard.css";

// const Dashboard = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [incomes, setIncomes] = useState([]);
//   const [totalIncome, setTotalIncome] = useState(0);
//   const [totalExpenses, setTotalExpenses] = useState(0);
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     // ✅ Corrected Token Name
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       navigate("/login");  // ✅ Token nahi mila to login pe redirect
//       return;
//     }

//     fetchExpenses();
//     fetchIncomes();
// }, []);


//   const fetchExpenses = async () => {
//     try {
//       const data = await getExpenses();
//       setExpenses(data);
//       setTotalExpenses(data.reduce((acc, expense) => acc + expense.amount, 0));
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//     }
//   };

//   const fetchIncomes = async () => {
//     try {
//       const data = await getIncomes();
//       setIncomes(data);
//       setTotalIncome(data.reduce((acc, income) => acc + income.amount, 0));
//     } catch (error) {
//       console.error("Error fetching incomes:", error);
//     }
//   };

//   const totalBalance = totalIncome - totalExpenses;

//   return (
//     <div className="dashboard-container">
//       <h1>Finance Dashboard</h1>

//       <div className="summary-cards">
//         <div className="card balance">
//           <h3>Total Balance</h3>
//           <p>₹{totalBalance}</p>
//         </div>
//         <div className="card income">
//           <h3>Total Income</h3>
//           <p>₹{totalIncome}</p>
//         </div>
//         <div className="card expenses">
//           <h3>Total Expenses</h3>
//           <p>₹{totalExpenses}</p>
//         </div>
//       </div>

//       <div className="transactions">
//         <h2>Recent Transactions</h2>
//         <table className="transactions-table">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Category</th>
//               <th>Type</th>
//               <th>Amount (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {[...incomes, ...expenses]
//               .sort((a, b) => new Date(b.date) - new Date(a.date)) // ✅ Newest first
//               .map((transaction) => {
//                 const transactionType = transaction.type
//                   ? transaction.type.toLowerCase()
//                   : incomes.some((inc) => inc._id === transaction._id)
//                   ? "income"
//                   : "expense";

//                 const formattedDate = new Date(transaction.date).toLocaleDateString("en-GB", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 });

//                 return (
//                   <tr
//                     key={transaction._id}
//                     style={{
//                       backgroundColor: transactionType === "income" ? "lightgreen" : "lightcoral",
//                       color: "black",
//                     }}
//                   >
//                     <td>{formattedDate}</td>
//                     <td>{transaction.category || transaction.source}</td>
//                     <td>{transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}</td>
//                     <td>₹{transaction.amount}</td>
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>

//       <div className="dashboard-actions">
//         <Link to="/incomes" className="dashboard-btn income-btn">
//           View Incomes
//         </Link>
//         <Link to="/expenses" className="dashboard-btn expenses-btn">
//           View Expenses
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getExpenses } from "../services/expense";
import { getIncomes } from "../services/income";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
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

  // 📌 Expenses ke liye Pie Chart Data
  const expenseCategories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.keys(expenseCategories).map((key) => ({
    name: key,
    value: expenseCategories[key],
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4567"];

  // 📌 Income vs Expenses ke liye Line Chart Data
  const graphData = incomes.map((income, index) => ({
    month: `M${index + 1}`,
    income: income.amount,
    expense: expenses[index] ? expenses[index].amount : 0,
  }));

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
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((transaction) => {
                const transactionType = transaction.type
                  ? transaction.type.toLowerCase()
                  : incomes.some((inc) => inc._id === transaction._id)
                  ? "income"
                  : "expense";

                const formattedDate = new Date(transaction.date).toLocaleDateString("en-GB", {
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

      {/* 📌 Pie Chart for Expense Breakdown */}
      <div className="chart-container">
        <div className="chart-box">
          <h2>Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📌 Line Chart for Income vs Expenses */}
        <div className="chart-box">
          <h2>Income vs Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="green" strokeWidth={3} />
              <Line type="monotone" dataKey="expense" stroke="red" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;

