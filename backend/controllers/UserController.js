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
        where: { id: id },
      });
      return user
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  async createUser(email, username, password) {
    try {
      const user = await this.getUserByEmail(email)
      if (user) {
        throw new Error(`User with email ${email} already exists`);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashedPassword,
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
}

export const userController = new UserController()