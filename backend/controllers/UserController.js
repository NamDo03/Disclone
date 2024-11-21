import bcrypt from 'bcryptjs';
import prisma from '../db/prismaClient.js';

class UserController {
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  }

  async getUserByUsername(username) {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    return user;
  }
  
  
  async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      return user
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  async createUser(email, username, password) {
    try {
      const user = await this.getUserByEmail(email);
      if (user) {
        throw new Error(`User with email ${email} already exists`);
      }
      const userByUsername = await this.getUserByUsername(username);
      if (userByUsername) {
        throw new Error(`Username "${username}" is already taken`);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const defaultAvatarUrl = "https://res.cloudinary.com/dyzlyiggq/image/upload/v1730085888/c5aaqj0pfasjfoufwwx5.png"; 
  
      const newUser = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashedPassword,
          avatar_url: defaultAvatarUrl,
        },
      });
  
      return newUser;   
    } catch (error) {
      throw new Error(`Failed to create new user: ${error.message}`);
    }
  }
  

  async updateLastLogin(userId, lastLoginAt) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: { last_login_at: lastLoginAt }
      });
    } catch (error) {
      throw new Error(`Failed to update last login time: ${error.message}`);
    }
  }  
  async deleteUserById(id) {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to delete user ${id}: ${error.message}`);
    }
  }

  async updateUsername(userId, newUsername, currentPassword) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt (userId) },
      });
    
      if (!user) {
        throw new Error('User not found');
      }
    
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
    
      if (user.username === newUsername) {
        throw new Error("The new username cannot be the same as the current username");
      }
      const updatedUser = await prisma.user.update({
        where: { id: parseInt (userId) },
        data: { username: newUsername },
      });
    
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating username: ' + error.message);
    }
  }

  async updatePassword(userId, newPassword) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt (userId) },
        data: { password: newPassword }, 
      });
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating password: ' + error.message);
    }
  }

  async updateAvatar(userId, avatarUrl) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: parseInt (userId) },
        data: { avatar_url: avatarUrl },
      });
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating avatar: ' + error.message);
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(userId) },
      });
      return deletedUser; 
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }
  
  async sendFriendInvite(userId, friendUsername) {
    try {
      const friend = await prisma.user.findUnique({
        where: { username: friendUsername }
      });
  
      if (!friend) {
        throw new Error("Friend not found!");
      }
  
      if (userId === friend.id) {
        throw new Error("You cannot send a friend invite to yourself!");
      }
  
   
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userId: parseInt(userId), friendId: parseInt(friend.id) },
            { userId: parseInt(friend.id), friendId: parseInt(userId) }
          ]
        }
      });
  
      if (existingFriendship) {
        throw new Error("You are already friends with this user!");
      }
  
     
      const existingInvite = await prisma.friendInvite.findFirst({
        where: {
          OR: [
            { senderId: Number(userId), receiverId: friend.id, status: { in: ["PENDING", "REJECTED"] } },
            { senderId: friend.id, receiverId: Number(userId), status: { in: ["PENDING", "REJECTED"] } },
          ],
        },
      });
  
      if (existingInvite) {
        if (existingInvite.status === 'PENDING') {
          throw new Error("Friend invite already sent and is pending!");
        } else if (existingInvite.status === 'REJECTED') {
          await prisma.friendInvite.delete({
            where: { id: existingInvite.id },
          });
        }
      }
  
  
      const newInvite = await prisma.friendInvite.create({
        data: {
          senderId: parseInt(userId),
          receiverId: parseInt(friend.id),
          status: 'PENDING'
        }
      });
  
      return {
        message: "Friend invite sent successfully!",
        invite: newInvite
      };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  

  async acceptFriendInvite(inviteId) {
    try {
      const invite = await prisma.friendInvite.findUnique({
        where: { id: parseInt(inviteId) },
      });
  
      if (!invite) {
        throw new Error("Friend invite not found!");
      }
  
      if (invite.status !== 'PENDING') {
        throw new Error("This invite has already been processed!");
      }
  
    
      const newFriendship = await prisma.friendship.create({
        data: {
          userId: invite.senderId,
          friendId: invite.receiverId
        }
      });
  
      await prisma.friendInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED' }
      });
      
      await prisma.directMessage.create({
        data: {
          sender: {
            connect: { id: invite.senderId }
          },
          receiver: {
            connect: { id: invite.receiverId }
          },
          created_at: new Date()
        }
      });

      return {
        message: "Friend invite accepted successfully!",
        friendship: newFriendship
      };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
  
  async getPendingInvites(userId) {
    try {
      const pendingInvites = await prisma.friendInvite.findMany({
        where: {
          receiverId: userId,
          status: 'PENDING', 
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true, 
              avatar_url:true,
            },
          },
        },
      });
      return pendingInvites;
    } catch (error) {
      throw new Error(`Failed to get pending invites for userId ${userId}: ${error.message}`);
    }
  }
  
  async rejectFriendInvite(inviteId) {
    try {
      const invite = await prisma.friendInvite.findUnique({
        where: { id: parseInt(inviteId) },
      });
  
      if (!invite) {
        throw new Error("Friend invite not found!");
      }
  
      if (invite.status !== 'PENDING') {
        throw new Error("This invite has already been processed!");
      }
  
      await prisma.friendInvite.update({
        where: { id: invite.id },
        data: { status: 'REJECTED' }
      });
  
      return {
        message: "Friend invite rejected successfully!"
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getFriends(userId) {
    try {
        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            throw new Error("Invalid userId provided");
        }

        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { userId: parsedUserId },
                    { friendId: parsedUserId }
                ]
            },
            include: {
                user: true,
                friend: true
            }
        });

        const friends = friendships.map(f => f.userId === parsedUserId ? f.friend : f.user);
        return friends;
    } catch (error) {
        console.error("Error in getFriends:", error);
        throw new Error(error.message || "Error retrieving friends");
    }
}

async removeFriend(userId, friendId) {
  try {
    const parsedUserId = parseInt(userId);
    const parsedFriendId = parseInt(friendId);

    if (isNaN(parsedUserId) || isNaN(parsedFriendId)) {
      throw new Error("Invalid userId or friendId provided");
    }


    const deleteFriendship = await prisma.friendship.deleteMany({
      where: {
        OR: [
          { userId: parsedUserId, friendId: parsedFriendId },
          { userId: parsedFriendId, friendId: parsedUserId }
        ]
      }
    });

    if (deleteFriendship.count === 0) {
      throw new Error("Friendship not found or already deleted!");
    }

   
    await prisma.friendInvite.deleteMany({
      where: {
        OR: [
          { senderId: parsedUserId, receiverId: parsedFriendId },
          { senderId: parsedFriendId, receiverId: parsedUserId }
        ]
      }
    });

    await prisma.directMessage.deleteMany({
      where: {
        OR: [
          { sender_id: parsedUserId, receiver_id: parsedFriendId },
          { sender_id: parsedFriendId, receiver_id: parsedUserId }
        ]
      }
    })

    return { message: "Friendship and related invites deleted successfully" };
  } catch (error) {
    console.error("Error in removeFriend:", error);
    throw new Error(error.message || "Error removing friend and invites");
  }
}
async getDirectMessagesForUser(userId) {
  try {
    const directMessages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      select: {
        id: true,
        created_at: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatar_url: true
          }
        }
      }
    });
    return directMessages;
  } catch (error) {
    console.error("Error getting direct messages for user:", error);
    throw error;
  }
}
async getDirectMessageById (directMessageID) {
  try {
    const directMessage = await prisma.directMessage.findFirst({
      where: {
        id: directMessageID
      }
    });

    return directMessage;
  } catch (error) {
    throw new Error('Error fetching direct message');
  }
};

async deleteMessage(userId, messageId) {
  try {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new Error("Message not found!");
    }

    if (message.user_id !== userId) {
      throw new Error("You are not authorized to delete this message!");
    }
    
    await prisma.message.delete({
      where: { id: messageId },
    });

    return { message: "Message deleted successfully" };
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

async updateMessage(userId, messageId, content, iv) {
  try {
    
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });
    
    if (!message) {
      throw new Error("Message not found!");
    }
   
    if (message.user_id !== userId) {
      throw new Error("You are not authorized to edit this message!");
    }
    
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { 
        content,
        iv,
        edited_at: new Date() 
      }
    });

  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
}

async getDirectmsgId (friendId, userId) {
  try {
    const directMessage = await prisma.directMessage.findFirst({
      where: {
        OR: [
          { sender_id: userId, receiver_id: friendId },
          { sender_id: friendId, receiver_id: userId }
        ]
      },
      select: {
        id: true, 
      },
    });

    return directMessage.id;
  } catch (error) {
    throw new Error('Error fetching direct message');
  }
};
}

export const userController = new UserController()