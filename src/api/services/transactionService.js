const transactionRepository = require('../repositories/transactionRepository');

const transactionService = {
    async create(args){
        try{
            const data = await transactionRepository.create(args);
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },
};

module.exports = transactionService;