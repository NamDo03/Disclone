import prisma from "../db/prismaClient.js";

export default class DirectMessageManager {
  constructor(io) {
    this.io = io;
    this.prisma = prisma;

    if (DirectMessageManager.instance) {
      return DirectMessageManager.instance;
    }
    DirectMessageManager.instance = this;
  }

  setupSocketEvents() {
    this.io.on('connection', (socket) => {
      socket.on('joinDirectMessage', async ({ directMessageId }) => {
        await this.joinDirectMessage(socket, directMessageId);
      });

      socket.on('newDirectMessage', async (msg) => {
        await this.handleNewDirectMessage(msg);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected from direct messaging');
      });
    });
  }

  async joinDirectMessage(socket, directMessageId) {
    try {
      const roomName = `direct_message_${directMessageId}`;
      socket.rooms.forEach(room => {
        if (room !== roomName) {
          socket.leave(room);
        }
      });
      socket.join(roomName);
      console.log(`User ${socket.id} joined direct message room ${roomName}`);
  
      const messages = await this.prisma.message.findMany({
        where: { direct_message_id: parseInt(directMessageId) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar_url: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
  
      socket.emit('previousDirectMessages', messages);
    } catch (error) {
      console.error('Error joining direct message room:', error);
    }
  }
  

  async handleNewDirectMessage(msg) {
    try {
      const newMessage = await this.prisma.message.create({
        data: {
          content: msg.content,
          iv: msg.iv,
          direct_message_id: parseInt(msg.direct_message_id),
          user_id: parseInt(msg.author_id),
        },
        include: {
          user: true
        },
      });
  
      const roomName = `direct_message_${msg.direct_message_id}`;
      this.io.to(roomName).emit('directMessage', newMessage);
      console.log(`New message sent to room ${roomName}:`);
    } catch (error) {
      console.error('Error saving direct message:', error);
    }
  }
}