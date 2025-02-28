import axios from "axios";
import { api } from "../api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token? { Authorization: `Bearer ${token}` }:{};
};
export const addExpense = async (expenseData) => {
    try {
        const res = await axios.post(api.addExpense, expenseData, {
            headers: getAuthHeaders()
        });

        // ✅ Page refresh after adding expense
        window.location.reload();

        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to add expense" };
    }
};


export const getExpenses = async () => {
    try {
        const res = await axios.get(api.getExpenses, {
            headers: getAuthHeaders()
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch expenses" };
    }
};

export const updateExpense = async (id, expenseData) => {
    try {
        const res = await axios.put(`${api.updateExpense}/${id}`, expenseData, {
            headers: getAuthHeaders()
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update expense" };
    }
};

export const deleteExpense = async (id) => {
    try {
        const token = localStorage.getItem("token"); 
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`http://localhost:5000/expenses/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete expense: ${response.status}`);
        }

        // ✅ Refresh page after successful delete
        window.location.reload();

    } catch (error) {
        console.error("Error deleting expense:", error.message || error);
        throw error;
    }
};





