const userService = require('../services/userService');
const { encryptPassword, checkPassword } = require('../utilities/encrypt');
const { createToken } = require('../utilities/token');

const authController = {
    async regis(req, res){
        try{
            const { email, password, name, address } = req.body;
            const encrypt = encryptPassword(password);
            const check = await userService.findOne(email);
            if(check != 0){
                res.status(400).json({
                    status: "FAIL",
                    message: "Email already in use!",
                });
                return;
            }
            const data = await userService.create({email, encrypt, name, address});
            delete data.password;
            res.status(201).json({
                user: data,
                status: "SUCCESSFULL",
                message: "Account successfully created!",
            });
        }catch(err){
            res.status(500).json({
                status: "INTERNAL ERROR",
                message: err.message
            })
        }
    }
}