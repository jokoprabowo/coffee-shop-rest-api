const userRepository = require('../repositories/userRepository');
const { encryptPassword } = require('../utilities/encrypt');
const { createToken }  = require('../utilities/token');

const userService = {
    async register(args){
        try{
            const { email, password, name, address } = args;
            const encrypt = await encryptPassword(password);
            const data = await userRepository.create({email, encrypt, name, address});
            return data;
        }catch(err){
            throw err.message;
        }
    },
    
    async login(email){
        const user = await userRepository.findOne(email);
        delete user.password;
        const token = createToken(user);
        console.log(token);
        return token;
    },

    async update(args, auth){
        const { email, password, name, address } = args;
        const encrypt = await encryptPassword(password);
        // const bearerToken = auth;
        // const token = bearerToken.split("Bearer ")[1];
        // const tokenPayload = verifyToken(token);

        const data = await userRepository.update({email, encrypt, name, address}, auth);
        delete data.password;
        return data;
    },

    async findOne(email){
        const user = await userRepository.findOne(email);
        return user;
    }
}

module.exports = userService;