import prisma from "../db/prismaClient.js";

class ServerController {
    async getServerById(serverId) {
        try {
            const server = await prisma.server.findUnique({
                where: { id: parseInt(serverId) },
                include: {
                    channels: true,
                },
            });
            return server;
        } catch (error) {
            throw new Error('Error retrieving server: ' + error.message);
        }
    }
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

    async getListOfOwnServers(userId) {
        try {
            const servers = await prisma.server.findMany({
                where: {
                    user_id: parseInt(userId),
                }
            });

            return servers;
        } catch (error) {
            throw new Error(`Failed to retrieve servers: ${error.message}`);
        }
    }

    async getListOfServers(userId) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            ownedServers: true,
            serverMemberships: {
              include: {
                server: true,
              },
            },
          },
        });
      
        if (!user) {
          throw new Error('User not found');
        }

        const ownedServers = user.ownedServers;
        const memberServers = user.serverMemberships.map(membership => membership.server);
        const allServers = [...ownedServers, ...memberServers];
      
        return allServers;
      } catch (error) {
          throw new Error(`Failed to retrieve servers: ${error.message}`);
      }
  }

    async deleteServerById(id) {
        try {
            await prisma.server.delete({ where: { id: parseInt(id) } });
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
    async getListOfMembers(serverId) {
        try {
          const serverExists = await prisma.server.findUnique({
            where: {
              id: parseInt(serverId),
            },
          });
      
          if (!serverExists) {
            throw new Error('Server không tồn tại.');
          }
          
          const members = await prisma.serverMember.findMany({
            where: {
              server_id: parseInt(serverId),
            },
            include: {
              user: {
                select: {
                  id: true,
                  avatar_url: true,
                  username: true,
                },
              },
            },
          });
          return members.map((member) => ({
            id: member.user.id,
            avatar_url: member.user.avatar_url,
            username: member.user.username,
          }));
        } catch (error) {
          throw new Error(`Failed to retrieve server members: ${error.message}`);
        }
      }
      async deleteMember(serverId, userId) {
        try {
          const deleteMember = await prisma.serverMember.deleteMany({
            where: {
              server_id: parseInt(serverId),
              user_id: parseInt(userId),
            },
          });
    
          if (!deleteMember.count) {
            throw new Error('Member not found or already deleted');
          }
    
          return { message: 'Member deleted successfully' };
        } catch (error) {
          throw new Error(`Failed to delete member: ${error.message}`);
        }
      }
    }


export const serverController = new ServerController();
