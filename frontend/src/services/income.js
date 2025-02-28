import axios from "axios";
import { api } from "../api"; // Ensure api object has correct endpoints

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// ➕ **Add Income**
export const addIncome = async (incomeData) => {
    try {
        const res = await axios.post(api.addIncome, incomeData, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to add income" };
    }
};

// 📜 **Get Incomes**
export const getIncomes = async () => {
    try {
        const res = await axios.get(api.getIncomes, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch incomes" };
    }
};

// ✏️ **Update Income**
export const updateIncome = async (id, incomeData) => {
    try {
        const res = await axios.put(`${api.updateIncome}/${id}`, incomeData, {
            headers: getAuthHeaders(),
        });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to update income" };
    }
};


export const deleteIncome = async (id) => {
    const token = localStorage.getItem("token"); // ✅ Token ensure karo
    const res = await axios.delete(`http://localhost:5000/incomes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
