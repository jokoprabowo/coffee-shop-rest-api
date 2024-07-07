const userService = require('../services/userService');
const authController = {
    async register(req, res){
        try{
            const user = await userService.register(req.body);
            res.status(201).json({
                status: "SUCCESS",
                message: "Account successfully created!",
                user: user
            });
        }catch(err){
            if (err.message == "Email already in use!"){
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

    async login(req, res){
        try{
            const token = await userService.login(req.body);
            res.status(200).json({
                status: "SUCCESS",
                message: "Login successfull!",
                token: token
            });
        }catch(err){
            if(err.message == "It is not an email!"){
                res.status(422).json({
                    status: "FAIL",
                    message: err.message
                });
            }else if(err.message == "User not found!"){
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
    }
}

module.exports = authController;