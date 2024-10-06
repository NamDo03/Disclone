
const API_URL = 'http://localhost:3000/api';

export const updateServer = async (serverId, name, img_url, userId, token) => {
    try {
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