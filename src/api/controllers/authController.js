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
            }else if(err.message == "Password does not meet minimum security requirements"){
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
            const token = await userService.login(req.body);
            res.cookie("token", token, {
                httpOnly: true,
            }).status(200).json({
                status: "SUCCESS",
                message: "Login successfull!",
            });
        }catch(err){
            if(err.message == "Account not found!"){
                res.status(404).json({
                    status: "FAIL",
                    message: err.message
                });
            }else if(err.message == "Incorrect password!"){
                res.status(400).json({
                    status: "FAIL",
                    message: err.message
                });
            }else{
                res.status(500).json({
                    status: "INTERNAL ERROR",
                    message: err.message
                });
            }
        }
    },

    async logout(req, res){
        res.clearCookie("token").status(200).json({
            status: "SUCCESS",
            message: "You have been logout!"
        });
    }
}

module.exports = authController;