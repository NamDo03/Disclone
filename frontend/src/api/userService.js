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

export const editUsername = async (userId, username, password) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/update-username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId:userId, newUsername:username, currentPassword:password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error updating username');
        }

        return data;
    } catch (error) {
        console.error("Update username error:", error);
        throw error;
    }
};

export const editUserPassword = async (userId, newPassword, password) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/update-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId:userId, newPassword:newPassword, currentPassword:password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error updating password');
        }

        return data;
    } catch (error) {
        console.error("Update password error:", error);
        throw error;
    }
};

export const editUserAvatar = async (userId, avatar) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/update-avatar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId:userId, avatarUrl:avatar })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error updating avatar');
        }

        return data;
    } catch (error) {
        console.error("Update avatar error", error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId:userId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error deleting user');
        }

        return data;
    } catch (error) {
        console.error("Delete user error", error);
        throw error;
    }
};
export const sendFriendInvite = async (userId, friendUsername, token) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/add-friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: userId, friendUsername: friendUsername })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error sending friend invite');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Fetch send friend invite error:", error);
        throw error; 
    }
};

export const acceptFriendInvite = async (inviteId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/accept-friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ inviteId: inviteId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error accepting friend invite');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Fetch accept friend invite error:", error);
        throw error; 
    }
};

export const rejectFriendInvite = async (inviteId) => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/reject-friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ inviteId: inviteId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error rejecting friend invite');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Fetch reject friend invite error:", error);
        throw error; 
    }
};

export const getPendingInvites = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${API_URL}/user/pending-invites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error fetching pending invites');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Fetch pending invites error:", error);
        throw error; 
    }
};

export const getFriends = async (userId) => {
    if (!userId || isNaN(userId)) {
        throw new Error("Invalid userId provided");
    }

    const token = getToken(); 
 
    if (!token) {
        throw new Error("Token is not available");
    }

    try {
        const response = await fetch(`${API_URL}/user/${userId}/friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching friends:", errorData);
            throw new Error(errorData.message || 'Error fetching friends');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch friends error:", error);
        throw new Error(error.message || "Error retrieving friends");
    }
};
export const removeFriend = async (friendId) => {
    if (!friendId || isNaN(friendId)) {
        throw new Error("Invalid friendId provided");
    }

    const token = getToken(); 

    if (!token) {
        throw new Error("Token is not available");
    }

    try {
        const response = await fetch(`${API_URL}/user/remove-friend`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ friendId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error removing friend:", errorData);
            throw new Error(errorData.message || 'Error removing friend');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Remove friend error:", error);
        throw new Error(error.message || "Error removing friend");
    }
};


export const getListDM = async (userId) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("Authorization token is missing");
        }

        const response = await fetch(`${API_URL}/user/${userId}/direct-messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching direct messages');
        }

        return data; 
    } catch (error) {
        console.error("Fetch direct messages error:", error);
        throw error;
    }
};
export const getDMById = async (conversationId) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("Authorization token is missing");
        }

        const response = await fetch(`${API_URL}/user/direct-messages/get-by-id/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching direct messages by Id');
        }

        return data; 
    } catch (error) {
        console.error("Fetch direct messages Id error:", error);
        throw error;
    }
};

export const deleteMessageById = async (messageId) => {
    try {
        const token = getToken(); 
        if (!token) {
            throw new Error("Authorization token is missing");
        }

        const response = await fetch(`${API_URL}/message/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ messageId }) 
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error deleting the message');
        }

        return data;
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};

export const updateMessageById = async (messageId, content, iv) => {
    if (!messageId || !content) {
      throw new Error("Message ID and new content are required!");
    }
  
    try {
      const token = getToken(); 
      if (!token) {
        throw new Error("Authorization token is missing");
      }
  
      const response = await fetch(`${API_URL}/message/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ messageId, content, iv }) 
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error updating the message');
      }
  
      return data; 
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  };
  
export const getDirectmsgId = async (friendId,userId) => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("Authorization token is missing");
        }

        const response = await fetch(`${API_URL}/user/get-directmsg-id/${friendId}/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error fetching direct messages by Id');
        }

        return data; 
    } catch (error) {
        console.error("Fetch direct messages Id error:", error);
        throw error;
    }
};