import axios from "axios";
import { api } from "../api";

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(api.login, { email, password });
        localStorage.setItem("token", res.data.token); // ✅ Token store in localStorage
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const signupUser = async (name, email, password) => {
    try {
        const res = await axios.post(api.signup, { name, email, password });
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;

        const res = await axios.get(api.me, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;
    } catch (error) {
        return null;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};
