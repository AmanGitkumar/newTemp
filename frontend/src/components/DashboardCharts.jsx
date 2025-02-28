import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "axios";

const DashboardCharts = () => {
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);

    useEffect(() => {
        fetchExpenseSummary();
    }, []);

    const fetchExpenseSummary = async () => {
        try {
            const response = await axios.get("/api/dashboard/expense-summary");
            setCategoryData(response.data.categoryData);
            setMonthlyTrend(response.data.monthlyTrend);
        } catch (error) {
            console.error("Error fetching expense summary:", error);
        }
    };

    const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800"];

    return (
        <div className="dashboard-charts">
            <h2>Expense Insights</h2>

            {/* Pie Chart - Expense by Category */}
            <div className="chart-container">
                <h3>Expenses by Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={categoryData} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100}>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Line Chart - Monthly Trend */}
            <div className="chart-container">
                <h3>Monthly Expense Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardCharts;
