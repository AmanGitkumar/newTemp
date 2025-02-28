import axios from "axios";

export const setGoal = async (userId, goalAmount) => {
    await axios.post("/api/goal/set-goal", { userId, goalAmount });
};

export const getGoal = async (userId) => {
    const response = await axios.get(`/api/goal/get-goal/${userId}`);
    return response.data;
};
