import { serverController } from '../controllers/ServerController.js';
import prisma from '../db/prismaClient.js';
import {jest} from '@jest/globals';

jest.mock('../db/prismaClient.js');

describe('ServerController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getServerById', () => {
    it('should return server data when found', async () => {
      const mockServer = {
        id: 1,
        server_name: 'Test Server',
        channels: [],
        members: [],
      };
      prisma.server.findUnique.mockResolvedValue(mockServer);

      const server = await serverController.getServerById(1);
      expect(server).toEqual(mockServer);
      expect(prisma.server.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { channels: true, members: { include: { user: true } } },
      });
    });

    it('should throw error if server not found', async () => {
      prisma.server.findUnique.mockResolvedValue(null);

      await expect(serverController.getServerById(1)).rejects.toThrow('Server not found');
    });
  });

  describe('createServer', () => {
    it('should create a new server with initial channel', async () => {
      const mockServer = {
        id: 1,
        server_name: 'Test Server',
        image_url: 'test.png',
        user_id: 1,
        channels: [{ id: 1, channel_name: 'general', type: 'TEXT' }],
      };
      prisma.server.create.mockResolvedValue(mockServer);

      const server = await serverController.createServer(1, 'Test Server', 'test.png');
      expect(server).toEqual(mockServer);
      expect(prisma.server.create).toHaveBeenCalledWith({
        data: {
          server_name: 'Test Server',
          image_url: 'test.png',
          user_id: 1,
          channels: { create: { channel_name: 'general', type: 'TEXT' } },
        },
      });
    });

    it('should throw an error if server creation fails', async () => {
      prisma.server.create.mockRejectedValue(new Error('Creation failed'));

      await expect(serverController.createServer(1, 'Test Server', 'test.png')).rejects.toThrow('Failed to create new server: Creation failed');
    });
  });

  describe('getListOfOwnServers', () => {
    it('should return list of own servers', async () => {
      const mockServers = [
        { id: 1, server_name: 'Server 1', user_id: 1 },
        { id: 2, server_name: 'Server 2', user_id: 1 },
      ];
      prisma.server.findMany.mockResolvedValue(mockServers);

      const servers = await serverController.getListOfOwnServers(1);
      expect(servers).toEqual(mockServers);
      expect(prisma.server.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });
  });

  describe('addMemberToServer', () => {
    it('should add a new member to server', async () => {
      prisma.server.findUnique.mockResolvedValue({ id: 1 });
      prisma.serverMember.findUnique.mockResolvedValue(null);
      const mockNewMember = { server_id: 1, user_id: 2 };
      prisma.serverMember.create.mockResolvedValue(mockNewMember);

      const newMember = await serverController.addMemberToServer(1, 2);
      expect(newMember).toEqual(mockNewMember);
      expect(prisma.serverMember.create).toHaveBeenCalledWith({
        data: { server_id: 1, user_id: 2 },
      });
    });

    it('should throw an error if user is already a member', async () => {
      prisma.server.findUnique.mockResolvedValue({ id: 1 });
      prisma.serverMember.findUnique.mockResolvedValue({ server_id: 1, user_id: 2 });

      await expect(serverController.addMemberToServer(1, 2)).rejects.toThrow('User is already a member of this server');
    });

    it('should throw an error if server not found', async () => {
      prisma.server.findUnique.mockResolvedValue(null);

      await expect(serverController.addMemberToServer(1, 2)).rejects.toThrow('Server not found');
    });
  });
});
