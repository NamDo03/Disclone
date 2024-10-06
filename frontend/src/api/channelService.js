
const API_URL = 'http://localhost:3000/api';

export const updateChannel = async (channelId, name, userId, token) => {
    try {
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