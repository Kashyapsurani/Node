import axios from "axios";

const API_URL = "http://localhost:3000/transactions";

export const addTransaction = async (transaction) => {
    try {
        const response = await axios.post(API_URL, transaction);
        console.log("Transaction added:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding transaction:", error);
    }
};
