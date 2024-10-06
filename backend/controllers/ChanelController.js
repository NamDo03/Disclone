import prisma from "../db/prismaClient.js";

class ChanelController {
  async createChanel(userId, name, type) {
    const chanel = { userId: userId, name: name, type: type }
    return chanel;
  }

  async deleteChannelById(id) {
    await prisma.channel.delete({ where: { id } });
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

export const chanelController = new ChanelController();
