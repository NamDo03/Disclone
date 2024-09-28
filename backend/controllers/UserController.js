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
      const user = this.getUserByEmail(email)
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
}

export const userController = new UserController()