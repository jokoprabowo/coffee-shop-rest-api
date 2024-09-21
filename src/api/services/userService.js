const userRepository = require('../repositories/userRepository');
const { encryptPassword, checkPassword } = require('../utilities/encrypt');
const { createToken }  = require('../utilities/token');
const { validatePassword, validateEmail } = require('../utilities/validate');

const userService = {
    async register(args){
        try{
            const { email, password, name, address } = args;
            const check = await userRepository.findOne(email);
            if(check){
                throw new Error("Email already in used!");
            };
            const validEmail = validateEmail(email);
            if(!validEmail){
                throw new Error("It is not an email");
            }
            const validPassword = validatePassword(password);
            if(!validPassword){
                throw new Error("Password does not meet minimum security requirements");
            };
            const encrypt = await encryptPassword(password);
            const data = await userRepository.create({email, encrypt, name, address});
            return data;
        }catch(err){
            throw new Error(err.message);
        }
    },
    
    async login(args){
        const { email, password } = args;
        const user = await userRepository.findOne(email);
        if(!user){
            throw new Error("Account not found!");
        };
        const isMatch = await checkPassword(user.password, password);
        if(!isMatch){
            throw new Error("Incorrect password!");
        }
        delete user.password;
        const token = createToken(user);
        return token;
    },

    async update(args, auth){
        const { email, password, name, address } = args;
        const encrypt = await encryptPassword(password);
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