import { channelController } from '../controllers/ChannelController.js';
import prisma from "../db/prismaClient.js";
import {jest} from '@jest/globals';

jest.mock('../db/prismaClient.js'); 

describe('ChannelController', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('createChannel should create a new channel', async () => {
        const mockChannel = { id: 1, server_id: 1, channel_name: 'general', type: 'TEXT' };

        prisma.channel.create.mockResolvedValue(mockChannel);

        const channel = await channelController.createChannel(1, 'general', 'TEXT');

        expect(channel).toEqual(mockChannel);
        expect(prisma.channel.create).toHaveBeenCalledWith({
            data: {
                server_id: 1,
                channel_name: 'general',
                type: 'TEXT',
            }
        });
    });

    test('getChannelById should return a channel by ID', async () => {
        const mockChannel = { id: 1, server_id: 1, channel_name: 'general', type: 'TEXT' };

        prisma.channel.findUnique.mockResolvedValue(mockChannel);

        const channel = await channelController.getChannelById(1);

        expect(channel).toEqual(mockChannel);
        expect(prisma.channel.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });

    test('deleteChannelById should delete a channel', async () => {
        const mockChannel = { id: 1, server_id: 1, type: 'TEXT' };

        prisma.channel.findUnique.mockResolvedValue(mockChannel);
        prisma.channel.count.mockResolvedValue(1); 
        prisma.channel.delete.mockResolvedValue(mockChannel);

        await expect(channelController.deleteChannelById(1)).rejects.toThrow('Cannot delete the last text channel in the server.');

        prisma.channel.count.mockResolvedValue(2); 

        await channelController.deleteChannelById(1);
        
        expect(prisma.channel.delete).toHaveBeenCalledWith({
            where: { id: 1 },
        });
    });
});
