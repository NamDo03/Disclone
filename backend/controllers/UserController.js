import bcrypt from 'bcryptjs';
import prisma from '../db/prismaClient.js';

class UserController {
  async getUserByName(username) {
    const user = await prisma.user.findUnique({
      where: { username: username },
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

  async createUser(username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await prisma.user.create({
        data: {
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