import bcrypt from 'bcryptjs';

class UserController {
  async getUserByName(username) {
    // const user = await prismaClient.user.findUnique({
    //   where: { username: username },
    // });
    const hashedPassword = await bcrypt.hash('password', 10);
    const user = { id: 1, username: 'test', password: hashedPassword };
    return username === user.username ? user : null;
  }
  
  async getUserById(id) {
    // try {
    //   const user = await prismaClient.user.findUnique({
    //     where: { id: id },
    //   });
    //   return user
    // } catch (error) {
    //   throw new Error(`Failed to find user by id: ${error.message}`);
    // }
    return { id: 1, username: 'test' };
  }

  async createUser(username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // const newUser = await prismaClient.user.create({
      //   data: {
      //     username: username,
      //     password: hashedPassword,
      //   },
      // });
      const newUser = { username: 'test' }
  
      return newUser;   
    } catch (error) {
      throw new Error(`Failed to create new user: ${error.message}`);
    }
  }
}

export const userController = new UserController()