const userService = require('../services/userService');

const authController = {
    async regis(req, res){
        try{
            const check = await userService.findOne(req.body.email);
            if(check != 0){
                res.status(400).json({
                    status: "FAIL",
                    message: "Email already in use!",
                });
                return;
            }
            const data = await userService.create(req.body);
            delete data.password;
            res.status(201).json({
                user: data,
                message: "Account successfully created!",
            });
        }catch(err){
            res.status(500).json({
                message: "Internal error!"
            })
        }
    },
}