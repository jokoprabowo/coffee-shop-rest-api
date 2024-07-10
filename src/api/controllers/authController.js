const { use } = require('../routers/userRoute');
const userService = require('../services/userService');
const { checkPassword } = require('../utilities/encrypt');

const authController = {
    async register(req, res){
        try{
            const user = await userService.register(req.body);
            delete user.password;
            res.status(201).json({
                status: "SUCCESS",
                message: "Account successfully created!",
                user: user
            });
        }catch(err){
            if(err.message == "Email already in used!"){
                res.status(400).json({
                    status: "FAIL",
                    message: err.message,
                });
            }else{
                res.status(500).json({
                    status: "INTERNAL ERROR",
                    message: err.message
                });
            }
        }
    },

    async login(req, res){
        try{
            const user = await userService.findOne(req.body.email);
            if(!user){
                res.status(404).json({
                    status: "FAIL",
                    message: "Account not found!"
                });
                return;
            }
            const isMatch = await checkPassword(user.password, req.body.password);
            if(!isMatch){
                res.status(400).json({
                    status: "FAIL",
                    message: "Incorrect password!"
                });
                return;
            }
            const token = await userService.login(req.body.email);
            res.cookie("token", token, {
                httpOnly: true,
            }).status(200).json({
                status: "SUCCESS",
                message: "Login successfull!",
            });
        }catch(err){
            res.status(500).json({
                status: "INTERNAL ERROR",
                message: err.message
            });
        }
    }
}

module.exports = authController;