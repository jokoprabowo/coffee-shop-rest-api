const cookieService = require('../services/cookieService');

const cookieController = {
    async create(req, res){
        try{
            const data = await cookieService.create(req.body);
            res.status(201).json({
                status: "SUCCESS",
                message: "Cookie has been added!"
            });
        }catch(err){
            if(err.message == "Cookie already exist!"){
                res.status(400).json({
                    status: "FAIL",
                    message: err.message
                })
            }else{
                res.status(500).json({
                    status: "INTERNAL ERROR",
                    message: err.message
                })
            }
        }
    }
};

module.exports = cookieController;