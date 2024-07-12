const cookieRepository = require('../repositories/cookieRepository');

const cookieService = {
    async create(args){
        try{
            const check = await cookieRepository.findOne(args.name);
            if(check){
                throw new Error('Cookies already exist!');
            }
            const data = await cookieRepository.create(args);
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async findOne(name){
        try{
            const data = await cookieRepository.findOne(name);
            if(!data){
                throw new Error('Cookies not found!');
            }
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async findAll(){
        try{
            const data = await cookieRepository.findAll();
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async update(args){
        try{
            const check = await cookieRepository.findOne(args.id);
            if(!check){
                throw new Error('Cookies not found!');
            }
            const data = await cookieRepository.update(args);
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    }
};

module.exports = cookieService;