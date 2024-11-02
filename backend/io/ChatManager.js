import prisma from "../db/prismaClient.js";
import videoClient from "../stream-io/VideoManager.js";
const apiKey = process.env.API_VIDEO;

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

      socket.on('joinCall', async({ serverId, channelId, currentUser }) => {
        await this.joinCall(socket, serverId, channelId, currentUser);
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
        orderBy: { created_at: 'desc' },
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

  async joinCall(socket, serverId, channelId, currentUser) {
    try {
      const user = {
        id: currentUser.id.toString(),
        role: 'user',
        name: currentUser.username,
        image: currentUser.avatar_url,
      };
      await videoClient.upsertUsers([user]);
      const token = videoClient.generateUserToken({ user_id: user.id, validity_in_seconds: 60 * 60 * 2 });
      const callId = `${serverId}${channelId}`;
      socket.emit('getCall', { apiKey, callId, token, user });
    } catch (error) {
      console.error('Error get video call', error);
    }
  }
}


