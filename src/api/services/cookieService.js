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
    }
};

module.exports = cookieService;