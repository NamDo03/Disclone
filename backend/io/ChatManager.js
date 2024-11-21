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
  
      socket.on('joinCall', async ({ serverId, channelId, currentUser }) => {
        await this.joinCall(socket, serverId, channelId, currentUser);
      });
  
      socket.on('newMessage', async (msg) => {
        await this.handleNewMessage(msg);
      });

      socket.on("createChannel", async (channelData) => {
        await this.handleCreateChannel(channelData);
      });

      socket.on("updateChannel", async (channelData) => { 
        await this.handleUpdateChannel(channelData);
      });

      socket.on("deleteChannel", async (channelData) => {
        await this.handleDeleteChannel(channelData);
      });

      socket.on('messageUpdated', async (data) => {
        await this.handleUpdateMessages(data);
      });

      socket.on('messageDeleted', async (data) => {
        await this.handleDeleteMessages(data);
      });
  
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  async joinServer(socket, serverId, channelId) {
    try {
      socket.rooms.forEach(room => {
        if (room !== `channel_${channelId}` || room !== `server_${channelId}`) {
          socket.leave(room);
        }
      });
      socket.join(`server_${serverId}`);
      console.log(`User ${socket.id} joined server_${serverId}`);

      socket.join(`channel_${channelId}`);
      console.log(`User ${socket.id} joined channel_${channelId}`);

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
          iv: msg.iv,
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

  async handleCreateChannel(channelData) {
    const { serverId, channel } = channelData;
    try {
      this.io.to(`server_${serverId}`).emit("channelCreated", channel);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  }

  async handleUpdateChannel(channelData) {
    const { serverId, updatedChannel } = channelData;
    try {
        this.io.to(`server_${serverId}`).emit("channelUpdated",  updatedChannel );
    } catch (error) {
        console.error("Error updating channel:", error);
    }
  }

  async handleDeleteChannel(channelData) {
    const { serverId, channelId } = channelData;
    try {
        this.io.to(`server_${serverId}`).emit("channelDeleted",  channelId );
    } catch (error) {
       console.error("Error deleting channel:", error);
    }
  }
  
  async handleUpdateMessages(data) {
    const roomName = data.directMessageId ? `direct_message_${data.directMessageId}` : `channel_${data.channelId}`
    const { messageId, editedMessage } = data;
    try {
      this.io.to(roomName).emit("onMessageUpdated", { messageId, editedMessage });
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }

  async handleDeleteMessages(data) {
    const roomName = data.directMessageId ? `direct_message_${data.directMessageId}` : `channel_${data.channelId}`
    const { messageId } = data;
    try {
      this.io.to(roomName).emit("onMessageDeleted", messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }
}  

