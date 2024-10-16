import prisma from "../db/prismaClient.js";

export default class ChatManager {
  constructor(io) {
    this.io = io;
    this.prisma = prisma;

    if (ChatManager.instance) {
      return ChatManager.instance;
    }
    ChatManager.instance = this;
  }

  setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('a user connected:', socket.id);

      socket.on('joinServer', async ({ serverId, channelId }) => {
        await this.joinServer(socket, serverId, channelId);
      });

      socket.on('newMessage', async (msg) => {
        await this.handleNewMessage(msg);
      });

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  async joinServer(socket, serverId, channelId) {
    try {
      socket.join(`server_${serverId}`);
      console.log(`User ${socket.id} joined server ${serverId}`);

      socket.join(`channel_${channelId}`);
      console.log(`User ${socket.id} joined channel ${channelId}`);

      const messages = await this.prisma.message.findMany({
        where: { channel_id: parseInt(channelId) },
        include: { user: true },
        orderBy: { created_at: 'asc' },
      });

      socket.emit('previousMessages', messages);
    } catch (error) {
      console.error('Error joining server/channel:', error);
    }
  }

  async handleNewMessage(msg) {
    try {
      const newMessage = await this.prisma.message.create({
        data: {
          content: msg.content,
          channel_id: parseInt(msg.channelId),
          user_id: parseInt(msg.author_id),
        },
        include: { user: true },
      });

      this.io.to(`channel_${msg.channelId}`).emit('message', newMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }
}


