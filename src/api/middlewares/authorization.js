const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

module.exports = {
    async authorize(req, res, next){
        try{
            const bearerToken = req.headers.authorization;
            const token = bearerToken.split("Bearer ")[1];
            const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await userService.findOne(tokenPayload);
            next();
        }catch(error){
            console.log(error);
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
}