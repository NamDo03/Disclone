import bcrypt from 'bcryptjs';
import { userController } from '../controllers/UserController.js'; 
import prisma from '../db/prismaClient.js';
import {jest} from '@jest/globals';

jest.mock('../db/prismaClient.js');
jest.mock('bcryptjs');

describe('UserController', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return user if email exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const user = await userController.getUserByEmail('test@example.com');
      expect(user).toEqual(mockUser);
    });

    it('should return null if email does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const user = await userController.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user if email is unique', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedPassword'); 
      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'hashedPassword',
        avatar_url: 'defaultAvatarUrl'
      };
      prisma.user.create.mockResolvedValue(mockUser);
      
      const newUser = await userController.createUser('newuser@example.com', 'newuser', 'password123');
      expect(newUser).toEqual(mockUser);
    });

    it('should throw an error if email already exists', async () => {
      const mockUser = { id: 1, email: 'existing@example.com' };
      prisma.user.findUnique.mockResolvedValue(mockUser); // User with the same email exists
      
      await expect(userController.createUser('existing@example.com', 'existinguser', 'password123'))
        .rejects.toThrow('User with email existing@example.com already exists');
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login timestamp', async () => {
      const mockUser = { id: 1, last_login_at: new Date() };
      prisma.user.update.mockResolvedValue(mockUser);
      
      const result = await userController.updateLastLogin(1, new Date());
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUsername', () => {
    it('should update username if password is correct', async () => {
      const mockUser = { id: 1, username: 'olduser', password: 'hashedPassword' };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      
      const updatedUser = { id: 1, username: 'newuser' };
      prisma.user.update.mockResolvedValue(updatedUser);
      
      const result = await userController.updateUsername(1, 'newuser', 'password123');
      expect(result).toEqual(updatedUser);
    });

    it('should throw an error if current password is incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue({ password: 'hashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(userController.updateUsername(1, 'newuser', 'wrongpassword'))
        .rejects.toThrow('Current password is incorrect');
    });
  });

  describe('sendFriendInvite', () => {
    it('should send a friend invite if friend is not already invited', async () => {
      const mockFriend = { id: 2, username: 'friendUser' };
      prisma.user.findUnique.mockResolvedValue(mockFriend);
      prisma.friendInvite.findFirst.mockResolvedValue(null); 
      
      const mockInvite = { id: 1, senderId: 1, receiverId: 2, status: 'PENDING' };
      prisma.friendInvite.create.mockResolvedValue(mockInvite);
      
      const result = await userController.sendFriendInvite(1, 'friendUser');
      expect(result).toEqual({ message: 'Friend invite sent successfully!', invite: mockInvite });
    });

    it('should throw an error if friend is already invited', async () => {
      const mockFriend = { id: 2, username: 'friendUser' };
      prisma.user.findUnique.mockResolvedValue(mockFriend);
      prisma.friendInvite.findFirst.mockResolvedValue({ status: 'PENDING' }); 
      
      await expect(userController.sendFriendInvite(1, 'friendUser'))
        .rejects.toThrow('Friend invite already sent and is pending!');
    });
  });

  describe('acceptFriendInvite', () => {
    it('should accept a friend invite and create friendship', async () => {
      const mockInvite = { id: 1, senderId: 1, receiverId: 2, status: 'PENDING' };
      prisma.friendInvite.findUnique.mockResolvedValue(mockInvite);
      
      const mockFriendship = { userId: 1, friendId: 2 };
      prisma.friendship.create.mockResolvedValue(mockFriendship);
      prisma.friendInvite.update.mockResolvedValue({ ...mockInvite, status: 'ACCEPTED' });
      
      const result = await userController.acceptFriendInvite(1);
      expect(result).toEqual({ message: 'Friend invite accepted successfully!', friendship: mockFriendship });
    });

    it('should throw an error if invite is already accepted', async () => {
      prisma.friendInvite.findUnique.mockResolvedValue({ status: 'ACCEPTED' });

      await expect(userController.acceptFriendInvite(1))
        .rejects.toThrow('This invite has already been processed!');
    });
  });
});
