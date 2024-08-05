const transactionService = require('../services/transactionService');

const transactionController = {
    async create(args){
        try{
            const data = await transactionService.create(args);
            return data;
        }catch(err){
            res.status.json({
                status: "INTERNAL ERROR",
                message: err.message
            })
        }
    }
};

module.exports = transactionController;