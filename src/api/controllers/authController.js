const userService = require('../services/userService');
const { validateEmail } = require('../utilities/email');
const { checkPassword } = require('../utilities/encrypt');

const authController = {
    async register(req, res){
        try{
            const check = await userService.findOne(req.body.email);
            if(check){
                res.status(404).json({
                    status: "FAIL",
                    message: "Email already in used!",
                });
                return;
            };
            const user = await userService.register(req.body);
            res.status(201).json({
                status: "SUCCESS",
                message: "Account successfully created!",
                user: user
            });
        }catch(err){
            res.status(500).json({
                status: "INTERNAL ERROR",
                message: err.message
            });
        }
    },

    async login(req, res){
        try{
            const isEmail = validateEmail(req.body.email);
            if(!isEmail){
                res.status(422).json({
                    status: "FAIL",
                    message: "It is not an email!"
                });
                return;
            };
            const user = await userService.findOne(req.body.email);
            if(!user){
                res.status(404).json({
                    status: "FAIL",
                    message: "Account not found!"
                });
                return;
            }
            const isMatch = checkPassword(user.password, req.body.password);
            if(!isMatch){
                res.status(400).json({
                    status: "FAIL",
                    message: "Incorrect password!"
                });
                return;
            }
            const token = await userService.login(req.body);
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