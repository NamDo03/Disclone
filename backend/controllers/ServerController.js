import prisma from "../db/prismaClient.js";

class ServerController {
    async createServer(userId, name, img_url) {
        try {
            const server = await prisma.server.create({
                data: {
                    server_name: name,
                    image_url: img_url,
                    user_id: userId,
                }
            });
            return server;
        } catch (error) {
            throw new Error(`Failed to create new server: ${error.message}`)
        }
    }

    async getListOfServers(userId) {
        try {
            const servers = await prisma.server.findMany({
                where: {
                    user_id: userId,
                }
            });

            return servers;
        } catch (error) {
            throw new Error(`Failed to retrieve servers: ${error.message}`);
        }
    }

    async deleteServerById(id) {
        try {
            await prisma.server.delete({ where: { id } });
        } catch (error) {
            throw new Error(`Failed to delete server ${id}: ${error.message}`);
        }
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
