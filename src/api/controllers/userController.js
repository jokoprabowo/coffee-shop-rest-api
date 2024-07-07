const userService = require('../services/userService');

const userController = {
    async update(req, res){
        try{
            const data = await userService.update(req.body, req.user.email);
            res.status(201).json({
                status: "SUCCESS",
                message: "User data has been updated!",
                user: data
            });
        }catch(err){
            res.status(500).json({
                status: "INTERVAL ERROR",
                message: err.message
            })
        }
    }
}

module.exports = userController;