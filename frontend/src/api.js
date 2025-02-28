const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    me: `${API_BASE_URL}/auth/me`,
    addExpense: `${API_BASE_URL}/expenses/add`,
    getExpenses: `${API_BASE_URL}/expenses/all`,
    updateExpense: (id) => `${API_BASE_URL}/expenses/update/${id}`,
    deleteExpense: (id) => `${API_BASE_URL}/expenses/delete/${id}`,
    addIncome: `${API_BASE_URL}/incomes/add`,
    getIncomes: `${API_BASE_URL}/incomes/all`,
    updateIncome: (id) => `${API_BASE_URL}/incomes/update/${id}`,
    deleteIncome: (id) => `${API_BASE_URL}/incomes/delete/${id}`,
};
