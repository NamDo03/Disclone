
const API_URL = 'http://localhost:3000/api';
import Cookies from "js-cookie";

const getToken = () => Cookies.get("token");

export const getChannelById = async (channelId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/channel/${channelId}/get-by-id`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching channel');
        }

        return data;
    } catch (error) {
        console.error("Fetch channel error:", error);
        throw error;
    }
};

export const createChannel = async (serverId, name, type) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/create-channel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ serverId, name, type })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error creating channel');
        }

        return data;
    } catch (error) {
        console.error("Create channel error:", error);
        throw error;
    }
};
export const updateChannel = async (channelId, name, userId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/channel/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ channelId: channelId, userId: userId, name: name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error updating channel');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteChannel = async (channelId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/channel/${channelId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error deleting channel');
        }

        return data;
    } catch (error) {
        console.error("Delete channel error:", error);
        throw error;
    }
};
