import prisma from "../db/prismaClient.js";

class ServerController {
    servers;
    constructor() {
        this.servers = [
            { id: 1, userId: 1, name: 'Server 1', img_url: 'https://example.com/img1.png' },
            { id: 2, userId: 1, name: 'Server 2', img_url: 'https://example.com/img2.png' },
            { id: 3, userId: 2, name: 'Server 3', img_url: 'https://example.com/img3.png' },
        ];
    }

    async createServer(userId, name, img_url) {
        const server = { userId: userId, name: name, img_url: img_url }
        return server;
    }

    async getListOfServers(userId) {
        const userServers = this.servers.filter(server => server.userId === parseInt(userId));
        return userServers;
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
