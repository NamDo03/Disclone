import prisma from "../db/prismaClient.js";

class ChannelController {
    async getChannelById(channelId) {
        try {
            const channel = await prisma.channel.findUnique({
                where: { id: parseInt(channelId) },
            });
            return channel;
        } catch (error) {
            throw new Error('Error retrieving channel: ' + error.message);
        }
    }

    async createChannel(serverId, name, type) {
        try {
            const channel = await prisma.channel.create({
                data: {
                    server_id: parseInt(serverId),
                    channel_name: name,
                    type,
                }
            });
            return channel;
        } catch (error) {
            throw new Error(`Failed to create new channel: ${error.message}`);
        }
    }

    async getListOfChannels(serverId) {
        try {
            const channels = await prisma.channel.findMany({
                where: {
                    server_id: parseInt(serverId),
                }
            });
            return channels;
        } catch (error) {
            throw new Error(`Failed to retrieve channels: ${error.message}`);
        }
    }

    async deleteChannelById(id) {
        try {
            const channel = await prisma.channel.findUnique({
                where: { id: parseInt(id) },
            });
            const textChannelCount = await prisma.channel.count({
                where: {
                    server_id: channel.server_id,
                    type: 'TEXT',
                },
            });

            const voiceChannelCount = await prisma.channel.count({
                where: {
                    server_id: channel.server_id,
                    type: 'VOICE',
                },
            });
            if (channel.type === 'TEXT' && textChannelCount <= 1) {
                throw new Error("always have at least one channel");
            }
            await prisma.channel.delete({ where: { id: parseInt(id) } });
        } catch (error) {
            throw new Error(`Failed to delete channel ${id}: ${error.message}`);
        }
    }

    async updateChannel(channelId, userId, channel_name) {
        try {
            const channel = await prisma.channel.findUnique({
                where: { id: parseInt(channelId) },
                include: {
                    server: true,
                },
            });

            if (!channel) {
                throw new Error('Channel not found');
            }

            if (channel.server.user_id !== parseInt(userId)) {
                throw new Error('You do not have permission to edit this channel');
            }

            const updatedChannel = await prisma.channel.update({
                where: { id: parseInt(channelId), },
                data: {
                    channel_name: channel_name || channel.channel_name,
                },
            });

            return updatedChannel;
        } catch (error) {
            throw new Error('Error updating channel: ' + error.message);
        }
    }
}

export const channelController = new ChannelController();
