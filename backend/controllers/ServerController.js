class ServerController{
    async createServer(userId,name,img_url){
        const server={userId:userId,name:name,img_url:img_url}
        return server;
    }
}

export const serverController = new ServerController();
