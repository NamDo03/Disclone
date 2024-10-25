
const API_URL = "http://localhost:3000/api";
import Cookies from "js-cookie";

const getToken = () => Cookies.get("token");;

export const updateServer = async (serverId, name, img_url, userId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ serverId: serverId, userId: userId, name: name, img_url: img_url })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error updating server');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const getListOfChannels = async (serverId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/${serverId}/list-channel`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching channels');
        }

        return data.channels;
    } catch (error) {
        console.error("Fetch channels error:", error);
        throw error;
    }
};

export const deleteServer = async (serverId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/${serverId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error deleting server');
        }

        return data;
    } catch (error) {
        console.error("Delete server error:", error);
        throw error;
    }
};
export const getServerById = async (serverId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/${serverId}/get-by-id`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching server');
        }

        return data;
    } catch (error) {
        console.error("Fetch server error:", error);
        throw error;
    }
};

export const getListOfMembers = async (serverId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/${serverId}/list-member`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching server members');
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to fetch server members: ${error.message}`);
    }
};

export const deleteMember = async (serverId, userId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/delete-member`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                serverId: serverId,
                userId: userId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error deleting member');
        }

        return data;
    } catch (error) {
        throw new Error(`Failed to delete member: ${error.message}`);
    }
};

export const joinServer = async (userId, serverId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/server/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ serverId: serverId, userId: userId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to join server');
        }

        return data;
    } catch (error) {
        throw error;
    }
};