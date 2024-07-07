const { verifyToken } = require('../utilities/token');
const userService = require('../services/userService');

module.exports = {
    async authorize(req, res, next){
        try{
            const bearerToken = req.headers.authorization;
            const token = bearerToken.split("Bearer ")[1];
            const tokenPayload = verifyToken(token);

            req.user = await userService.findOne(tokenPayload.email);
            next();
        }catch(error){
            console.log(error);
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
}