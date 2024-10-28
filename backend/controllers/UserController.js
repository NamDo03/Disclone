import bcrypt from 'bcryptjs';
import prisma from '../db/prismaClient.js';

class UserController {
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email: email },
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
  
}

export const userController = new UserController()