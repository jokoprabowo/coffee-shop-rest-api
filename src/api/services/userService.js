const userRepository = require('../repositories/userRepository');
const { checkPassword, encryptPassword } = require('../utilities/encrypt');
const { createToken, verifyToken }  = require('../utilities/token');
const { validateEmail } = require('../utilities/email');

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
    },
    
    async login(args){
        try{
            const { email, password } = args;
            const isEmail = validateEmail(email);
            if(!isEmail){
                throw new Error("It is not an email!");
            }
            const user = await userRepository.findOne(email);
            if(user != 0){
                throw new Error("User not found!");
            };
            const isMatch = checkPassword(user.password, password);
            if(!isMatch){
                throw new Error("Incorrect password!");
            };
            delete user.password;
            const token = createToken(user);
            return token;
        }catch(err){
            throw new Error(err.message);
        }
    },

    async update(args, auth){
        try{
            const { email, password, name, address } = args;
            const encrypt = encryptPassword(password);
            // const bearerToken = auth;
            // const token = bearerToken.split("Bearer ")[1];
            // const tokenPayload = verifyToken(token);

            const data = await userRepository.update({email, encrypt, name, address}, auth);
            delete data.password;
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },
}

module.exports = userService;