import prisma from "../db/prismaClient.js";

class ServerController {
  async createServer(userId, name, img_url) {
    const server = { userId: userId, name: name, img_url: img_url }
    return server;
  }

  async updateServer(serverId, userId, server_name, image_url) {
    try {
      const server = await prisma.server.findUnique({
        where: { id: parseInt(serverId), }
      });

      if (!server) {
        throw new Error('Server not found');
      }

      if (server.user_id !== parseInt(userId)) {
        throw new Error('You do not have permission to edit this server');
      }

      const updatedServer = await prisma.server.update({
        where: { id: parseInt(serverId) },
        data: {
          server_name: server_name || server.server_name,
          image_url: image_url || server.image_url,
        },
      });

      return updatedServer;
    } catch (error) {
      throw new Error('Error updating server: ' + error.message);
    }
  }
}

export const serverController = new ServerController();
