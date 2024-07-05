const userRepository = require('../repositories/userRepository');
const { checkPassword, encryptPassword } = require('../Utilities/encrypt');

const userService = {
    async register(args){
        try{
            const { email, password, name, address } = args;
            const encrypt = encryptPassword(password);
            const check = await userRepository.findOne(email);
            if(check != 0){
                throw new Error("Email already in use!");
            }
            const data = await userRepository.create({email, encrypt, name, address});
            return data;
        }catch(err){
            throw err.message;
        }

    }
}