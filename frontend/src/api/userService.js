const API_URL = 'http://localhost:3000/api';
import Cookies from "js-cookie";

const getToken = () => Cookies.get("token");;

export const createServer = async (userId, name, img_url) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/create-server`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, name, img_url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error creating server');
        }

        return data;
    } catch (error) {
        console.error("Create server error:", error);
        throw error;
    }
};

export const getListOfServers = async (userId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/${userId}/list-server`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching servers');
        }

        return data.servers;
    } catch (error) {
        console.error("Fetch servers error:", error);
        throw error;
    }
};

export const getUserById = async (userId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/${userId}/get-by-id`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching user');
        }

        return data;
    } catch (error) {
        console.error("Fetch user error:", error);
        throw error;
    }
};