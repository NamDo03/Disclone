class ChanelController{
    async createChanel(userId,name,type){
        const chanel={userId:userId,name:name,type:type}
        return chanel;
    }
}

export const chanelController = new ChanelController();
