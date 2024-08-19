const transactionRepository = require('../repositories/transactionRepository');
const cookieRepository = require('../repositories/cookieRepository');

const transactionService = {
    async create(email, args){
        try{
            const { cookieId, totalItem } = args;
            const cookie = await cookieRepository.findOne(cookieId);
            const totalPrice = cookie.price * totalItem;
            const data = await transactionRepository.create({ email, cookieId, totalItem, totalPrice });
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async findOne(id){
        try{
            const data = await transactionRepository.findOne(id);
            if(!data){
                throw new Error("Transaction not found!");
            }
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async findAll(){
        try{
            const data = await transactionRepository.findAll();
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async update(args, id){
        try{
            const { email, cookieId, totalItem } = args;
            const check = await transactionRepository.findOne(id);
            if(!check){
                throw new Error("Transaction not found!");
            }
            const cookie = await cookieRepository.findOne(cookieId);
            const totalPrice = cookie.price * totalItem; 
            const data = await transactionRepository.update({ email, cookieId, totalItem, totalPrice }, id);
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    }
};

module.exports = transactionService;